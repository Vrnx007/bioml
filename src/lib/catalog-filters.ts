import type { CatalogFilterState } from "@/lib/catalog-filter-state";
import type { CatalogProduct } from "@/lib/types";

/** Normalize CAS for comparison (digits + single hyphen pattern loosely). */
export function normalizeCas(raw: string | null | undefined): string {
  if (!raw) return "";
  const s = raw.replace(/\s+/g, "").replace(/[–—]/g, "-").toUpperCase();
  if (!/\d/.test(s)) return "";
  return s;
}

export const CATEGORY_SLUGS = ["crm", "filtration", "solvents", "media", "cells", "filters"] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export function productMatchesCategorySlug(p: CatalogProduct, slug: string): boolean {
  const s = slug.toLowerCase() as CategorySlug;
  if (!CATEGORY_SLUGS.includes(s)) return false;
  return p.category_slugs.includes(s);
}

function splitTokens(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/[,;|]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.toLowerCase());
}

function typeTokenMatch(productTypeLower: string, sel: string): boolean {
  const tokens = splitTokens(productTypeLower);
  const s = sel.toLowerCase().trim();
  if (tokens.some((t) => t === s || t.includes(s) || s.includes(t))) return true;
  return productTypeLower.includes(s);
}

function casListMatch(productCas: string, casList: string[], mode: "or" | "and"): boolean {
  if (!casList.length) return true;
  const p = normalizeCas(productCas);
  const normalizedList = casList.map(normalizeCas).filter(Boolean);
  if (!p) return false;
  if (mode === "or") return normalizedList.some((c) => p.includes(c) || c.includes(p));
  return normalizedList.every((c) => p.includes(c) || c.includes(p));
}

function promotionTagsMatch(p: CatalogProduct, tags: string[]): boolean {
  if (!tags.length) return true;
  const set = new Set(p.promotion_tags.map((t) => t.toLowerCase()));
  if (p.promotion) set.add("special_offer");
  return tags.some((t) => set.has(t.toLowerCase()));
}

/**
 * Apply facet filters. Omit keys in `omit` to implement exclude-self facet counts
 * (pass a key from CatalogFilterState that is dimension name — handled by caller).
 */
export function applyCatalogFilters(
  products: CatalogProduct[],
  state: CatalogFilterState,
  omit?: Partial<Record<keyof CatalogFilterState, true>>
): CatalogProduct[] {
  return products.filter((p) => {
    if (!omit?.categorySlug && state.categorySlug && !productMatchesCategorySlug(p, state.categorySlug)) return false;

    if (!omit?.brand && state.brand.length) {
      const b = (p.brand ?? "").toLowerCase();
      if (!state.brand.some((sel) => b.includes(sel.toLowerCase()))) return false;
    }

    if (!omit?.cas && state.cas.length) {
      if (!casListMatch(p.cas_primary ?? "", state.cas, state.casMode)) return false;
    }

    if (!omit?.apiFamily && state.apiFamily.length) {
      const af = (p.api_family ?? "").toLowerCase();
      const ok =
        state.apiFamilyMode === "or"
          ? state.apiFamily.some((s) => af.includes(s.toLowerCase()))
          : state.apiFamily.every((s) => af.includes(s.toLowerCase()));
      if (!ok) return false;
    }

    if (!omit?.productType && state.productType.length) {
      const pt = (p.product_type ?? "").toLowerCase();
      const ok =
        state.productTypeMode === "or"
          ? state.productType.some((s) => typeTokenMatch(pt, s))
          : state.productType.every((s) => typeTokenMatch(pt, s));
      if (!ok) return false;
    }

    if (!omit?.format && state.format.length) {
      const f = (p.product_format ?? "").toLowerCase();
      const ok =
        state.formatMode === "or"
          ? state.format.some((s) => f === s.toLowerCase())
          : state.format.every((s) => f === s.toLowerCase());
      if (!ok) return false;
    }

    if (!omit?.state && state.state.length) {
      const st = (p.fulfillment_state ?? "").toLowerCase();
      if (!state.state.some((s) => st === s.toLowerCase())) return false;
    }

    if (!omit?.promotionTags && state.promotionTags.length) {
      if (!promotionTagsMatch(p, state.promotionTags)) return false;
    }

    if (!omit?.productAccreditations && state.productAccreditations.length) {
      const a = (p.accreditation_product ?? "").toLowerCase();
      if (!state.productAccreditations.some((s) => a.includes(s.toLowerCase()))) return false;
    }

    if (!omit?.labAccreditations && state.labAccreditations.length) {
      const a = (p.accreditation_lab ?? "").toLowerCase();
      if (!state.labAccreditations.some((s) => a.includes(s.toLowerCase()))) return false;
    }

    if (!omit?.analyte && state.analyte.length) {
      const an = (p.analyte ?? "").toLowerCase();
      if (!state.analyte.some((s) => an.includes(s.toLowerCase()))) return false;
    }

    if (!omit?.impurityType && state.impurityType.length) {
      const im = (p.impurity_type ?? "").toLowerCase();
      const ok =
        state.impurityTypeMode === "or"
          ? state.impurityType.some((s) => im.includes(s.toLowerCase()))
          : state.impurityType.every((s) => im.includes(s.toLowerCase()));
      if (!ok) return false;
    }

    if (!omit?.silType && state.silType.length) {
      const sil = (p.sil_type ?? "").toLowerCase();
      if (!state.silType.some((s) => sil.includes(s.toLowerCase()))) return false;
    }

    if (!omit?.matrix && state.matrix.length) {
      const m = (p.matrix ?? "").toLowerCase();
      if (!state.matrix.some((s) => m.includes(s.toLowerCase()))) return false;
    }

    return true;
  });
}
