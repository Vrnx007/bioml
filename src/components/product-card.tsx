"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight, Package } from "lucide-react";
import type { CatalogProduct } from "@/lib/types";

function ProductCardInner({ p, showPrice }: { p: CatalogProduct; showPrice: boolean }) {
  const c = useTranslations("Common");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface-elevated shadow-sm transition duration-200 hover:border-accent-teal/40 hover:shadow-card">
      <Link
        href={`/products/${p.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-b from-surface-muted to-slate-200/80"
      >
        {p.image_url ? (
          <Image
            src={p.image_url}
            alt={`${p.title} — 2D structure preview`}
            width={480}
            height={360}
            className="h-full w-full object-contain p-6 transition duration-300 group-hover:scale-[1.02]"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <Package className="h-12 w-12 opacity-40" strokeWidth={1.25} aria-hidden />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-text-muted">
            CAS {p.cas_primary ?? "—"}
          </p>
          <Link
            href={`/products/${p.slug}`}
            className="mt-1 block font-display text-lg font-semibold leading-snug text-brand-navy transition group-hover:text-accent-teal-hover"
          >
            {p.title}
          </Link>
          {p.brand && <p className="mt-1 text-sm font-medium text-text-secondary">{p.brand}</p>}
        </div>
        <p className="line-clamp-2 text-base leading-relaxed text-text-secondary">{p.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div className="min-w-0">
            {showPrice && p.price_per_kg != null ? (
              <p className="font-mono text-base font-semibold tabular-nums text-text-primary">
                ₹{p.price_per_kg.toFixed(2)}
                <span className="ml-1 text-xs font-sans font-normal text-text-muted">/ kg</span>
              </p>
            ) : (
              <p className="text-sm font-medium text-link">{c("viewPricingLogin")}</p>
            )}
            <p className="mt-1 text-xs text-text-muted">
              {c("minOrder")}: {p.moq_display ?? "—"}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-emerald-200/80 bg-success-surface px-2.5 py-1 text-xs font-semibold text-success">
            {c("inStock")}
          </span>
        </div>
        <Link
          href={`/products/${p.slug}`}
          className="inline-flex min-h-10 items-center justify-center gap-1 text-sm font-semibold text-accent-teal transition hover:text-accent-teal-hover"
        >
          View specifications
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function ProductCard({ p, showPrice }: { p: CatalogProduct; showPrice: boolean }) {
  return <ProductCardInner p={p} showPrice={showPrice} />;
}
