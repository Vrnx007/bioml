import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDemoCatalog, getDemoProductBySlug } from "@/lib/demo-catalog";
import type { CatalogProduct, ProductDetail } from "@/lib/types";

export async function fetchCatalog(filters?: Record<string, string | undefined>): Promise<CatalogProduct[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return getDemoCatalog(filters);

  let q = supabase
    .from("products")
    .select(
      "id,slug,title,brand,cas_primary,description,product_type,api_family,product_format,promotion,fulfillment_city,fulfillment_state,moq_display,chemical_image_url,pubchem_cid,specs"
    )
    .eq("status", "published");

  if (filters?.brand) q = q.ilike("brand", `%${filters.brand}%`);
  if (filters?.cas) q = q.ilike("cas_primary", `%${filters.cas}%`);
  if (filters?.apiFamily) q = q.ilike("api_family", `%${filters.apiFamily}%`);
  if (filters?.productType) q = q.ilike("product_type", `%${filters.productType}%`);
  if (filters?.format) q = q.eq("product_format", filters.format);
  if (filters?.state) q = q.eq("fulfillment_state", filters.state);
  if (filters?.promotion === "1") q = q.eq("promotion", true);

  const { data, error } = await q;
  if (error || !data?.length) return getDemoCatalog(filters);

  const ids = data.map((p) => p.id);
  const { data: variants } = await supabase
    .from("product_variants")
    .select("id,product_id,pack_label,unit,pack_size,hsn_code")
    .in("product_id", ids);

  type VariantRow = NonNullable<typeof variants>[number];

  const { data: tiers } = await supabase.from("price_tiers").select("variant_id,min_qty,unit_price,currency");

  const tierByVariant = new Map<string, { min_qty: number; unit_price: number; currency: string }[]>();
  (tiers ?? []).forEach((t) => {
    const list = tierByVariant.get(t.variant_id) ?? [];
    list.push({ min_qty: Number(t.min_qty), unit_price: Number(t.unit_price), currency: t.currency });
    tierByVariant.set(t.variant_id, list);
  });

  const variantByProduct = new Map<string, VariantRow>();
  (variants ?? []).forEach((v) => {
    if (!variantByProduct.has(v.product_id)) variantByProduct.set(v.product_id, v);
  });

  return data.map((p) => {
    const v = variantByProduct.get(p.id);
    const tlist = v ? tierByVariant.get(v.id) ?? [] : [];
    const sorted = [...tlist].sort((a, b) => a.min_qty - b.min_qty);
    const first = sorted[0];
    const pricePerKg =
      v?.unit === "kg" && first ? first.unit_price : first && v?.pack_size ? first.unit_price / Number(v.pack_size) : null;

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      brand: p.brand,
      cas_primary: p.cas_primary,
      catalog_code: null,
      description: p.description,
      product_type: p.product_type,
      api_family: p.api_family,
      product_format: p.product_format,
      promotion: p.promotion,
      fulfillment_city: p.fulfillment_city,
      fulfillment_state: p.fulfillment_state,
      moq_display: p.moq_display,
      price_per_kg: pricePerKg,
      min_order_kg: v ? Number(v.pack_size) : null,
      image_url: p.chemical_image_url,
      purity_grade: typeof p.specs === "object" && p.specs && "purity" in p.specs ? String((p.specs as { purity?: string }).purity ?? "") : null,
    } satisfies CatalogProduct;
  });
}

export async function fetchProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return getDemoProductBySlug(slug);

  const { data: p } = await supabase.from("products").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (!p) return getDemoProductBySlug(slug);

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", p.id);

  const vIds = (variants ?? []).map((v) => v.id);
  const { data: tiers } = await supabase.from("price_tiers").select("*").in("variant_id", vIds);
  const { data: inv } = await supabase.from("inventory_snapshots").select("*").in("variant_id", vIds);

  const tierMap = new Map<string, { min_qty: number; unit_price: number; currency: string }[]>();
  (tiers ?? []).forEach((t) => {
    const arr = tierMap.get(t.variant_id) ?? [];
    arr.push({ min_qty: Number(t.min_qty), unit_price: Number(t.unit_price), currency: t.currency });
    tierMap.set(t.variant_id, arr);
  });
  const invMap = new Map((inv ?? []).map((i) => [i.variant_id, Number(i.quantity_available) > 0]));

  const specs = typeof p.specs === "object" && p.specs && !Array.isArray(p.specs) ? (p.specs as Record<string, string | number | null>) : {};

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    brand: p.brand,
    cas_primary: p.cas_primary,
    catalog_code: null,
    description: p.description,
    product_type: p.product_type,
    api_family: p.api_family,
    product_format: p.product_format,
    promotion: p.promotion,
    fulfillment_city: p.fulfillment_city,
    fulfillment_state: p.fulfillment_state,
    moq_display: p.moq_display,
    price_per_kg: null,
    min_order_kg: null,
    image_url: p.chemical_image_url,
    purity_grade: typeof specs.purity === "string" ? specs.purity : null,
    iupac_name: p.iupac_name,
    formula: p.formula,
    pubchem_cid: p.pubchem_cid,
    specs,
    coa_url: "#",
    sds_url: "#",
    ghs_codes: typeof specs.ghs === "string" ? [specs.ghs] : [],
    hazards: String(specs.hazards ?? ""),
    storage: String(specs.storage ?? ""),
    reviews: [],
    variants: (variants ?? []).map((v) => ({
      id: v.id,
      sku_code: v.sku_code,
      pack_label: v.pack_label,
      unit: v.unit,
      pack_size: Number(v.pack_size),
      shelf_life: v.shelf_life,
      hsn_code: v.hsn_code,
      in_stock: invMap.get(v.id) ?? true,
      tiers: tierMap.get(v.id) ?? [],
    })),
  };
}
