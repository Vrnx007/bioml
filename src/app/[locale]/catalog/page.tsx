import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { FilterSidebar } from "@/components/filter-sidebar";
import { ProductCard } from "@/components/product-card";
import { fetchAllCatalogProducts } from "@/lib/catalog";
import { canViewPricing } from "@/lib/auth-helpers";
import { parseCatalogFilterState } from "@/lib/catalog-filter-state";
import { applyCatalogFilters, CATEGORY_SLUGS } from "@/lib/catalog-filters";
import { buildFacetMap } from "@/lib/catalog-facets";
import { LayoutGrid } from "lucide-react";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const str = (k: string) => {
    const v = sp[k];
    return typeof v === "string" ? v : undefined;
  };
  const filterState = parseCatalogFilterState(sp);
  const q = str("q");

  const fullList = await fetchAllCatalogProducts();
  let products = applyCatalogFilters(fullList, filterState);

  if (q) {
    const ql = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(ql) ||
        (p.cas_primary && p.cas_primary.toLowerCase().includes(ql)) ||
        (p.catalog_code && p.catalog_code.toLowerCase().includes(ql)) ||
        (p.description && p.description.toLowerCase().includes(ql)) ||
        (p.api_family && p.api_family.toLowerCase().includes(ql)) ||
        (p.product_type && p.product_type.toLowerCase().includes(ql)) ||
        (p.analyte && p.analyte.toLowerCase().includes(ql)) ||
        (p.brand && p.brand.toLowerCase().includes(ql))
    );
  }

  const facets = buildFacetMap(fullList, filterState);
  const categoryCounts = Object.fromEntries(
    CATEGORY_SLUGS.map((slug) => {
      const base = applyCatalogFilters(fullList, filterState, { categorySlug: true });
      return [slug, base.filter((p) => p.category_slugs.includes(slug)).length] as const;
    })
  );

  const showPrice = (await canViewPricing()) || process.env.NEXT_PUBLIC_DEMO_SHOW_PRICES === "true";
  const tc = await getTranslations("Catalog");

  return (
    <div className="border-b border-border bg-surface-elevated py-10 sm:py-12">
      <div className="ui-container">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
          <div>
            <div className="flex items-center gap-2 text-accent-teal">
              <LayoutGrid className="h-5 w-5" strokeWidth={2} aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-widest">Catalog</span>
            </div>
            <h1 className="mt-2 font-display text-display-sm text-brand-navy">{tc("title")}</h1>
            <p className="ui-prose mt-3 max-w-2xl text-lg">{tc("subtitle")}</p>
          </div>
          <p className="rounded-full border border-border bg-surface-muted px-4 py-2 font-mono text-sm tabular-nums text-text-secondary">
            {tc("results")}: <span className="font-semibold text-text-primary">{products.length}</span>
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:gap-12">
          <Suspense
            fallback={<div className="h-72 w-full max-w-xs animate-pulse rounded-card bg-surface-muted lg:w-80" aria-hidden />}
          >
            <FilterSidebar facets={facets} categoryCounts={categoryCounts} />
          </Suspense>
          <div className="min-w-0 flex-1">
            {products.length === 0 ? (
              <div className="ui-card flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
                <p className="font-display text-xl text-brand-navy">{tc("noResults")}</p>
                <p className="max-w-md text-text-secondary">Try clearing filters or search with a CAS number or product name.</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} p={p} showPrice={showPrice} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
