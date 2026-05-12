"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CatalogProduct } from "@/lib/types";

function ProductCardInner({ p, showPrice }: { p: CatalogProduct; showPrice: boolean }) {
  const c = useTranslations("Common");

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-sky-300">
      <Link href={`/products/${p.slug}`} className="block aspect-square bg-slate-100">
        {p.image_url ? (
          <Image src={p.image_url} alt="" width={400} height={400} className="h-full w-full object-contain p-4" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No image</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${p.slug}`} className="font-semibold text-sky-900 hover:underline">
          {p.title}
        </Link>
        <p className="text-xs text-slate-500">
          CAS {p.cas_primary ?? "—"} · {p.brand ?? "—"}
        </p>
        <p className="line-clamp-2 text-xs text-slate-600">{p.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-slate-100 pt-3 text-sm">
          <div>
            {showPrice && p.price_per_kg != null ? (
              <p className="font-medium text-slate-900">
                {c("pricePerKg")}: ₹{p.price_per_kg.toFixed(2)}
              </p>
            ) : (
              <p className="text-xs text-sky-700">{c("viewPricingLogin")}</p>
            )}
            <p className="text-xs text-slate-500">
              {c("minOrder")}: {p.moq_display ?? "—"}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">{c("inStock")}</span>
        </div>
      </div>
    </article>
  );
}

export function ProductCard({ p, showPrice }: { p: CatalogProduct; showPrice: boolean }) {
  return <ProductCardInner p={p} showPrice={showPrice} />;
}
