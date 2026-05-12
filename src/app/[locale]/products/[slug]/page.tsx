import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PdpTabs } from "@/components/pdp-tabs";
import { GatedPrice } from "@/components/gated-price";
import { fetchProductBySlug } from "@/lib/catalog";
import { fetchPubChemByCas } from "@/lib/pubchem";
import { canViewPricing } from "@/lib/auth-helpers";
import { Link } from "@/i18n/navigation";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 text-sm text-slate-500">
        <Link href="/catalog" className="text-sky-700 hover:underline">
          Catalog
        </Link>
        <span className="mx-2">/</span>
        <span>{product.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative aspect-square bg-slate-50">
            {diagram ? (
              <Image src={diagram} alt="" fill className="object-contain p-6" sizes="(max-width: 1024px) 100vw, 50vw" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">No structure</div>
            )}
          </div>
          {pubchem?.smiles && (
            <p className="mt-2 break-all font-mono text-xs text-slate-600">
              <span className="font-semibold text-slate-800">SMILES:</span> {pubchem.smiles}
            </p>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-sky-900">{product.title}</h1>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-700">{t("productCode")}</dt>
              <dd className="text-slate-900">{product.catalog_code ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">{t("casNumber")}</dt>
              <dd className="text-slate-900">{product.cas_primary ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">Brand</dt>
              <dd className="text-sky-800 underline">{product.brand ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">Type / format</dt>
              <dd className="text-slate-900">
                {product.product_type} · {product.product_format}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">API family</dt>
              <dd className="text-slate-900">{product.api_family ?? "—"}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a href={product.coa_url ?? "#"} className="text-sky-800 underline">
              {t("coa")}
            </a>
            <a href={product.sds_url ?? "#"} className="text-sky-800 underline">
              {t("sds")}
            </a>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800">
            {c("isoBadge")}
            <span title="Accreditation info" className="cursor-help text-slate-500">
              ⓘ
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <PdpTabs product={product} />
      </div>

      {primaryVariant && (
        <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-6">
          <GatedPrice showPrice={showPrice} product={product} variantId={primaryVariant.id} />
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/account?rfq=1&product=${product.slug}`}
              className="rounded-md border border-sky-600 bg-white px-4 py-2 text-sm font-medium text-sky-800 hover:bg-sky-50"
            >
              {c("requestQuote")}
            </Link>
            <button type="button" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50">
              {c("sampleRequest")}
            </button>
          </div>
        </div>
      )}

      {product.reviews.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">{t("reviews")}</h2>
          <ul className="mt-3 space-y-3">
            {product.reviews.map((r, i) => (
              <li key={i} className="rounded border border-slate-200 bg-white p-4 text-sm">
                <p className="font-medium text-slate-900">{"★".repeat(r.rating)}</p>
                <p className="mt-1 text-slate-700">{r.body}</p>
                <p className="mt-1 text-xs text-slate-500">— {r.author}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
