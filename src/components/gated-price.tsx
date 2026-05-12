"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus, Heart } from "lucide-react";
import type { ProductDetail } from "@/lib/types";

export function GatedPrice({
  showPrice,
  product,
  variantId,
}: {
  showPrice: boolean;
  product: ProductDetail;
  variantId: string;
}) {
  const c = useTranslations("Common");
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const [qty, setQty] = useState(1);

  if (!variant) return null;

  const sortedTiers = [...variant.tiers].sort((a, b) => a.min_qty - b.min_qty);
  const tier = [...sortedTiers].reverse().find((t) => qty >= t.min_qty) ?? sortedTiers[0];

  return (
    <div className="flex flex-col gap-6 border-t border-border pt-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{c("unitSize")}</p>
          <p className="mt-1 font-display text-lg font-semibold text-brand-navy">{variant.pack_label}</p>
          <p className="mt-1 text-sm text-text-secondary">
            <span className="font-semibold text-success">{c("inStock")}</span>
            {variant.sku_code && <span className="text-text-muted"> · {variant.sku_code}</span>}
          </p>
        </div>
        <div className="flex items-center gap-0 overflow-hidden rounded-ui border border-border-strong bg-surface-elevated shadow-sm">
          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center text-text-primary transition hover:bg-surface-muted"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <span className="min-w-[2.5rem] border-x border-border py-2 text-center font-mono text-base font-semibold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center text-text-primary transition hover:bg-surface-muted"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-end gap-4">
        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-ui border border-border text-text-muted transition hover:border-accent-teal hover:text-accent-teal"
          aria-label="Add to wishlist"
        >
          <Heart className="h-5 w-5" strokeWidth={2} />
        </button>
        <div className="min-w-[12rem] text-right">
          {showPrice && tier ? (
            <p className="font-mono text-xl font-bold tabular-nums text-text-primary">
              ₹{tier.unit_price.toFixed(2)}
              <span className="ml-2 text-xs font-sans font-normal text-text-muted">(demo line price)</span>
            </p>
          ) : (
            <button type="button" className="text-left text-sm font-semibold text-link hover:text-link-hover">
              {c("viewPricingLogin")}
            </button>
          )}
        </div>
        <button type="button" className="ui-btn-primary min-w-[10rem]">
          {c("addToCart")}
        </button>
      </div>
    </div>
  );
}
