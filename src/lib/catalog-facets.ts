import type { CatalogFilterState } from "@/lib/catalog-filter-state";
import { applyCatalogFilters, normalizeCas } from "@/lib/catalog-filters";
import type { CatalogProduct } from "@/lib/types";

export type FacetOption = { value: string; count: number };

export type FacetMap = Record<string, FacetOption[]>;

const DIM_KEYS: (keyof CatalogFilterState)[] = [
  "promotionTags",
  "brand",
  "productAccreditations",
  "labAccreditations",
  "format",
  "impurityType",
  "silType",
  "matrix",
  "state",
  "productType",
  "apiFamily",
  "analyte",
  "cas",
];

function uniqueStrings(products: CatalogProduct[], getter: (p: CatalogProduct) => string | null | undefined): string[] {
  const s = new Set<string>();
  for (const p of products) {
    const v = getter(p);
    if (v && v.trim()) s.add(v.trim());
  }
  return [...s].sort((a, b) => a.localeCompare(b));
}

function uniqueTokensFromProductType(products: CatalogProduct[]): string[] {
  const s = new Set<string>();
  for (const p of products) {
    const raw = p.product_type;
    if (!raw) continue;
    raw.split(/[,;|]/).forEach((t) => {
      const x = t.trim();
      if (x) s.add(x);
    });
  }
  return [...s].sort((a, b) => a.localeCompare(b));
}

function uniquePromotionTags(products: CatalogProduct[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    p.promotion_tags.forEach((t) => set.add(t));
    if (p.promotion) set.add("special_offer");
  }
  return [...set].sort();
}

function promotionTagsMatchOne(p: CatalogProduct, tag: string): boolean {
  const t = tag.toLowerCase();
  const set = new Set(p.promotion_tags.map((x) => x.toLowerCase()));
  if (p.promotion) set.add("special_offer");
  return set.has(t);
}

function typeTokenMatch(productTypeLower: string, sel: string): boolean {
  const tokens = productTypeLower
    .split(/[,;|]/)
    .map((x) => x.trim())
    .filter(Boolean);
  const s = sel.toLowerCase().trim();
  return tokens.some((t) => t === s || t.includes(s) || s.includes(t)) || productTypeLower.includes(s);
}

function productMatchesDimensionValue(p: CatalogProduct, dim: keyof CatalogFilterState, value: string): boolean {
  switch (dim) {
    case "promotionTags":
      return promotionTagsMatchOne(p, value);
    case "brand":
      return (p.brand ?? "").toLowerCase().includes(value.toLowerCase());
    case "productAccreditations":
      return (p.accreditation_product ?? "").toLowerCase().includes(value.toLowerCase());
    case "labAccreditations":
      return (p.accreditation_lab ?? "").toLowerCase().includes(value.toLowerCase());
    case "format":
      return (p.product_format ?? "").toLowerCase() === value.toLowerCase();
    case "impurityType":
      return (p.impurity_type ?? "").toLowerCase().includes(value.toLowerCase());
    case "silType":
      return (p.sil_type ?? "").toLowerCase().includes(value.toLowerCase());
    case "matrix":
      return (p.matrix ?? "").toLowerCase().includes(value.toLowerCase());
    case "state":
      return (p.fulfillment_state ?? "").toLowerCase() === value.toLowerCase();
    case "productType":
      return typeTokenMatch((p.product_type ?? "").toLowerCase(), value);
    case "apiFamily":
      return (p.api_family ?? "").toLowerCase().includes(value.toLowerCase());
    case "analyte":
      return (p.analyte ?? "").toLowerCase().includes(value.toLowerCase());
    case "cas": {
      const pc = normalizeCas(p.cas_primary);
      const vc = normalizeCas(value);
      return !!(pc && vc && (pc.includes(vc) || vc.includes(pc)));
    }
    default:
      return true;
  }
}

/** Exclude-self facet counts: for each dimension D, base = all filters except D; option count = matches in baseList. */
export function buildFacetMap(fullList: CatalogProduct[], state: CatalogFilterState): FacetMap {
  const out: FacetMap = {};

  for (const dim of DIM_KEYS) {
    const omit: Partial<Record<keyof CatalogFilterState, true>> = { [dim]: true };
    const baseList = applyCatalogFilters(fullList, state, omit);

    if (dim === "promotionTags") {
      const opts = uniquePromotionTags(fullList);
      out.promotionTags = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "brand") {
      const opts = uniqueStrings(fullList, (p) => p.brand);
      out.brand = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "productAccreditations") {
      const opts = uniqueStrings(fullList, (p) => p.accreditation_product);
      out.productAccreditations = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "labAccreditations") {
      const opts = uniqueStrings(fullList, (p) => p.accreditation_lab);
      out.labAccreditations = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "format") {
      const opts = uniqueStrings(fullList, (p) => p.product_format);
      out.format = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "impurityType") {
      const opts = uniqueStrings(fullList, (p) => p.impurity_type);
      out.impurityType = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "silType") {
      const opts = uniqueStrings(fullList, (p) => p.sil_type);
      out.silType = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "matrix") {
      const opts = uniqueStrings(fullList, (p) => p.matrix);
      out.matrix = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "state") {
      const opts = uniqueStrings(fullList, (p) => p.fulfillment_state);
      out.state = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "productType") {
      const opts = uniqueTokensFromProductType(fullList);
      out.productType = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "apiFamily") {
      const opts = uniqueStrings(fullList, (p) => p.api_family);
      out.apiFamily = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "analyte") {
      const opts = uniqueStrings(fullList, (p) => p.analyte);
      out.analyte = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    } else if (dim === "cas") {
      const opts = uniqueStrings(fullList, (p) => p.cas_primary);
      out.cas = opts.map((value) => ({
        value,
        count: baseList.filter((p) => productMatchesDimensionValue(p, dim, value)).length,
      }));
    }
  }

  return out;
}
