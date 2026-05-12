"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const tier =
    [...sortedTiers].reverse().find((t) => qty >= t.min_qty) ?? sortedTiers[0];

  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{c("unitSize")}</p>
        <p className="text-xs text-slate-600">
          {variant.pack_label} · <span className="text-emerald-700">{c("inStock")}</span>
        </p>
      </div>
      <div className="flex items-center gap-1 rounded border border-slate-200 bg-white">
        <button type="button" className="px-2 py-1 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          −
        </button>
        <span className="w-8 text-center text-sm">{qty}</span>
        <button type="button" className="px-2 py-1 text-lg" onClick={() => setQty((q) => q + 1)}>
          +
        </button>
      </div>
      <div className="flex-1 text-sm">
        {showPrice && tier ? (
          <p className="font-semibold text-slate-900">
            ₹{tier.unit_price.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ line (demo)</span>
          </p>
        ) : (
          <button type="button" className="text-sky-700 underline">
            {c("viewPricingLogin")}
          </button>
        )}
      </div>
      <button
        type="button"
        className="rounded-full bg-sky-700 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-sky-800"
      >
        {c("addToCart")}
      </button>
    </div>
  );
}
