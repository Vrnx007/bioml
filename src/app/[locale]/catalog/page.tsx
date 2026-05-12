import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { FilterSidebar } from "@/components/filter-sidebar";
import { ProductCard } from "@/components/product-card";
import { fetchCatalog } from "@/lib/catalog";
import { canViewPricing } from "@/lib/auth-helpers";

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
  const filters = {
    brand: str("brand"),
    cas: str("cas"),
    apiFamily: str("apiFamily"),
    productType: str("productType"),
    format: str("format"),
    state: str("state"),
    promotion: str("promotion"),
  };
  const q = str("q");
  let products = await fetchCatalog(filters);
  if (q) {
    const ql = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(ql) ||
        (p.cas_primary && p.cas_primary.includes(ql)) ||
        (p.catalog_code && p.catalog_code.toLowerCase().includes(ql)) ||
        (p.description && p.description.toLowerCase().includes(ql))
    );
  }

  const showPrice = (await canViewPricing()) || process.env.NEXT_PUBLIC_DEMO_SHOW_PRICES === "true";
  const tc = await getTranslations("Catalog");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{tc("title")}</h1>
      <p className="mt-1 text-sm text-slate-600">{tc("subtitle")}</p>
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <Suspense fallback={<div className="h-64 w-64 animate-pulse rounded bg-slate-200" />}>
          <FilterSidebar />
        </Suspense>
        <div className="flex-1">
          <p className="mb-4 text-sm text-slate-500">
            {tc("results")}: {products.length}
          </p>
          {products.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">{tc("noResults")}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} showPrice={showPrice} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
