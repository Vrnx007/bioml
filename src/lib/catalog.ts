import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDemoProductBySlug, demoCatalog } from "@/lib/demo-catalog";
import type { CatalogProduct, ProductDetail } from "@/lib/types";
import type { CatalogFilterState } from "@/lib/catalog-filter-state";
import { applyCatalogFilters } from "@/lib/catalog-filters";

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  brand: string | null;
  cas_primary: string | null;
  description: string | null;
  product_type: string | null;
  api_family: string | null;
  product_format: string | null;
  promotion: boolean;
  fulfillment_city: string | null;
  fulfillment_state: string | null;
  moq_display: string | null;
  chemical_image_url: string | null;
  pubchem_cid: string | null;
  specs: unknown;
  accreditation_product: string | null;
  accreditation_lab: string | null;
  analyte: string | null;
  impurity_type: string | null;
  sil_type: string | null;
  matrix: string | null;
};

function promotionTagsFromSpecs(specs: unknown): string[] {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return [];
  const o = specs as Record<string, unknown>;
  const t = o.promotion_tags;
  if (!Array.isArray(t)) return [];
  return t.map((x) => String(x)).filter(Boolean);
}

function categorySlugsFromSpecs(specs: unknown): string[] {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return [];
  const o = specs as Record<string, unknown>;
  const t = o.category_slugs;
  if (!Array.isArray(t)) return [];
  return t.map((x) => String(x).toLowerCase()).filter(Boolean);
}

function mapRow(
  p: ProductRow,
  variant: { id: string; pack_size: number; unit: string } | undefined,
  firstTier: { unit_price: number; min_qty: number } | undefined
): CatalogProduct {
  const specs = typeof p.specs === "object" && p.specs && !Array.isArray(p.specs) ? (p.specs as Record<string, unknown>) : {};
  const purity = typeof specs.purity === "string" ? specs.purity : null;
  const tags = promotionTagsFromSpecs(p.specs);
  const catSlugs = categorySlugsFromSpecs(p.specs);

  const pricePerKg =
    variant?.unit === "kg" && firstTier
      ? firstTier.unit_price
      : firstTier && variant?.pack_size
        ? firstTier.unit_price / Number(variant.pack_size)
        : null;

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
    promotion_tags: tags.length ? tags : p.promotion ? ["special_offer"] : [],
    fulfillment_city: p.fulfillment_city,
    fulfillment_state: p.fulfillment_state,
    moq_display: p.moq_display,
    price_per_kg: pricePerKg,
    min_order_kg: variant ? Number(variant.pack_size) : null,
    image_url: p.chemical_image_url,
    purity_grade: purity,
    accreditation_product: p.accreditation_product,
    accreditation_lab: p.accreditation_lab,
    analyte: p.analyte,
    impurity_type: p.impurity_type,
    sil_type: p.sil_type,
    matrix: p.matrix,
    category_slugs: catSlugs,
  };
}

/** All published products (demo or Supabase), before URL facet filters. */
export async function fetchAllCatalogProducts(): Promise<CatalogProduct[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [...demoCatalog];

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,slug,title,brand,cas_primary,description,product_type,api_family,product_format,promotion,fulfillment_city,fulfillment_state,moq_display,chemical_image_url,pubchem_cid,specs,accreditation_product,accreditation_lab,analyte,impurity_type,sil_type,matrix"
    )
    .eq("status", "published");

  if (error || !data?.length) return [...demoCatalog];

  const rows = data as unknown as ProductRow[];
  const ids = rows.map((p) => p.id);
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

  return rows.map((p) => {
    const v = variantByProduct.get(p.id);
    const tlist = v ? (tierByVariant.get(v.id) ?? []) : [];
    const sorted = [...tlist].sort((a, b) => a.min_qty - b.min_qty);
    const first = sorted[0];
    return mapRow(p, v, first);
  });
}

export async function fetchCatalog(filterState: CatalogFilterState): Promise<CatalogProduct[]> {
  const all = await fetchAllCatalogProducts();
  return applyCatalogFilters(all, filterState);
}

export async function fetchProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return getDemoProductBySlug(slug);

  const { data: p } = await supabase.from("products").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (!p) return getDemoProductBySlug(slug);

  const { data: variants } = await supabase.from("product_variants").select("*").eq("product_id", p.id);

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

  const specs =
    typeof p.specs === "object" && p.specs && !Array.isArray(p.specs) ? (p.specs as Record<string, string | number | null>) : {};
  const tags = promotionTagsFromSpecs(p.specs);
  const catSlugs = categorySlugsFromSpecs(p.specs);

  const base: CatalogProduct = {
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
    promotion_tags: tags.length ? tags : p.promotion ? ["special_offer"] : [],
    fulfillment_city: p.fulfillment_city,
    fulfillment_state: p.fulfillment_state,
    moq_display: p.moq_display,
    price_per_kg: null,
    min_order_kg: null,
    image_url: p.chemical_image_url,
    purity_grade: typeof specs.purity === "string" ? specs.purity : null,
    accreditation_product: p.accreditation_product,
    accreditation_lab: p.accreditation_lab,
    analyte: p.analyte,
    impurity_type: p.impurity_type,
    sil_type: p.sil_type,
    matrix: p.matrix,
    category_slugs: catSlugs,
  };

  return {
    ...base,
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
