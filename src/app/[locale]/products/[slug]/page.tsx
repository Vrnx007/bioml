import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PdpTabs } from "@/components/pdp-tabs";
import { GatedPrice } from "@/components/gated-price";
import { fetchProductBySlug } from "@/lib/catalog";
import { fetchPubChemByCas } from "@/lib/pubchem";
import { canViewPricing } from "@/lib/auth-helpers";
import { Link } from "@/i18n/navigation";
import { ChevronRight, Info, Star, FileDown } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const pubchem = product.cas_primary ? await fetchPubChemByCas(product.cas_primary) : null;
  const diagram = pubchem?.imageUrl ?? product.image_url;
  const showPrice = (await canViewPricing()) || process.env.NEXT_PUBLIC_DEMO_SHOW_PRICES === "true";
  const t = await getTranslations("Product");
  const c = await getTranslations("Common");
  const primaryVariant = product.variants[0];

  return (
    <div className="border-b border-border bg-surface-elevated pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="ui-container">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-text-muted" aria-label="Breadcrumb">
          <Link href="/catalog" className="font-medium text-link transition hover:text-link-hover">
            Catalog
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
          <span className="font-medium text-text-primary">{product.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="ui-card overflow-hidden p-6 shadow-card sm:p-8">
              <div className="relative aspect-square overflow-hidden rounded-ui bg-gradient-to-b from-surface-muted to-slate-200/90">
                {diagram ? (
                  <Image
                    src={diagram}
                    alt={`${product.title} — 2D chemical structure`}
                    fill
                    className="object-contain p-4 sm:p-8"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-text-muted">No structure diagram</div>
                )}
              </div>
              {pubchem?.smiles && (
                <p className="mt-4 break-all font-mono text-sm leading-relaxed text-text-secondary">
                  <span className="font-semibold text-text-primary">SMILES</span> {pubchem.smiles}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <h1 className="font-display text-display-sm text-brand-navy sm:text-[2.1rem]">{product.title}</h1>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">{t("productCode")}</dt>
                <dd className="mt-1.5 font-mono text-base font-medium text-text-primary">{product.catalog_code ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">{t("casNumber")}</dt>
                <dd className="mt-1.5 font-mono text-base font-medium text-text-primary">{product.cas_primary ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">Brand</dt>
                <dd className="mt-1.5 text-base font-semibold text-link">{product.brand ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">Type / format</dt>
                <dd className="mt-1.5 text-base text-text-secondary">
                  {product.product_type ?? "—"} · {product.product_format ?? "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">API family</dt>
                <dd className="mt-1.5 text-base text-text-secondary">{product.api_family ?? "—"}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={product.coa_url ?? "#"}
                className="inline-flex min-h-11 items-center gap-2 rounded-ui border border-border-strong bg-surface-muted px-4 text-sm font-semibold text-brand-navy transition hover:border-accent-teal hover:bg-accent-subtle/50"
              >
                <FileDown className="h-4 w-4" strokeWidth={2} aria-hidden />
                {t("coa")}
              </a>
              <a
                href={product.sds_url ?? "#"}
                className="inline-flex min-h-11 items-center gap-2 rounded-ui border border-border-strong bg-surface-muted px-4 text-sm font-semibold text-brand-navy transition hover:border-accent-teal hover:bg-accent-subtle/50"
              >
                <FileDown className="h-4 w-4" strokeWidth={2} aria-hidden />
                {t("sds")}
              </a>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-ui border border-border bg-surface-muted px-4 py-3 text-sm font-semibold text-brand-navy">
              {c("isoBadge")}
              <span className="inline-flex text-text-muted" title="Accreditation details">
                <Info className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <PdpTabs product={product} />
        </div>

        {primaryVariant && (
          <div className="ui-card mt-12 p-6 shadow-card sm:p-8 lg:mt-16">
            <GatedPrice showPrice={showPrice} product={product} variantId={primaryVariant.id} />
            <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-8">
              <Link href={`/account?rfq=1&product=${product.slug}`} className="ui-btn-secondary">
                {c("requestQuote")}
              </Link>
              <button type="button" className="ui-btn-secondary">
                {c("sampleRequest")}
              </button>
            </div>
          </div>
        )}

        {product.reviews.length > 0 && (
          <section className="mt-14 border-t border-border pt-12">
            <h2 className="font-display text-display-sm text-brand-navy">{t("reviews")}</h2>
            <ul className="mt-6 space-y-4">
              {product.reviews.map((r, i) => (
                <li key={i} className="ui-card rounded-ui p-6 shadow-sm">
                  <div className="flex items-center gap-1 text-amber-500" aria-label={`${r.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${j < r.rating ? "fill-current" : "fill-none opacity-30"}`}
                        strokeWidth={2}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-text-secondary">{r.body}</p>
                  <p className="mt-3 text-sm font-medium text-text-muted">— {r.author}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
