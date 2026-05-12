/** URL / catalog filter state — parsed from searchParams (Next.js). */

export type AndOr = "or" | "and";

export type CatalogFilterState = {
  categorySlug?: string;
  brand: string[];
  cas: string[];
  casMode: AndOr;
  apiFamily: string[];
  apiFamilyMode: AndOr;
  productType: string[];
  productTypeMode: AndOr;
  format: string[];
  formatMode: AndOr;
  state: string[];
  promotionTags: string[];
  productAccreditations: string[];
  labAccreditations: string[];
  analyte: string[];
  impurityType: string[];
  impurityTypeMode: AndOr;
  silType: string[];
  matrix: string[];
};

export const PROMOTION_TAG_OPTIONS = [
  { value: "new", labelKey: "promoNew" as const },
  { value: "replacement_part", labelKey: "promoReplacement" as const },
  { value: "special_offer", labelKey: "promoSpecial" as const },
] as const;

export const DEFAULT_FILTER_STATE: CatalogFilterState = {
  brand: [],
  cas: [],
  casMode: "or",
  apiFamily: [],
  apiFamilyMode: "or",
  productType: [],
  productTypeMode: "or",
  format: [],
  formatMode: "or",
  state: [],
  promotionTags: [],
  productAccreditations: [],
  labAccreditations: [],
  analyte: [],
  impurityType: [],
  impurityTypeMode: "or",
  silType: [],
  matrix: [],
};

function arr(sp: Record<string, string | string[] | undefined>, key: string): string[] {
  const v = sp[key];
  if (typeof v === "string" && v) return [v];
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && x.length > 0);
  return [];
}

function mode(sp: Record<string, string | string[] | undefined>, key: string, fallback: AndOr): AndOr {
  const v = typeof sp[key] === "string" ? sp[key] : undefined;
  return v === "and" ? "and" : v === "or" ? "or" : fallback;
}

export function parseCatalogFilterState(sp: Record<string, string | string[] | undefined>): CatalogFilterState {
  const category = typeof sp.category === "string" ? sp.category : undefined;
  return {
    categorySlug: category && /^[a-z0-9_-]+$/i.test(category) ? category.toLowerCase() : undefined,
    brand: arr(sp, "brand"),
    cas: arr(sp, "cas"),
    casMode: mode(sp, "casMode", "or"),
    apiFamily: arr(sp, "apiFamily"),
    apiFamilyMode: mode(sp, "apiFamilyMode", "or"),
    productType: arr(sp, "productType"),
    productTypeMode: mode(sp, "productTypeMode", "or"),
    format: arr(sp, "format"),
    formatMode: mode(sp, "formatMode", "or"),
    state: arr(sp, "state"),
    promotionTags: arr(sp, "promotionTag"),
    productAccreditations: arr(sp, "productAccreditations"),
    labAccreditations: arr(sp, "labAccreditations"),
    analyte: arr(sp, "analyte"),
    impurityType: arr(sp, "impurityType"),
    impurityTypeMode: mode(sp, "impurityTypeMode", "or"),
    silType: arr(sp, "silType"),
    matrix: arr(sp, "matrix"),
  };
}

export function hasActiveFilters(s: CatalogFilterState): boolean {
  return !!(
    s.categorySlug ||
    s.brand.length ||
    s.cas.length ||
    s.apiFamily.length ||
    s.productType.length ||
    s.format.length ||
    s.state.length ||
    s.promotionTags.length ||
    s.productAccreditations.length ||
    s.labAccreditations.length ||
    s.analyte.length ||
    s.impurityType.length ||
    s.silType.length ||
    s.matrix.length
  );
}
