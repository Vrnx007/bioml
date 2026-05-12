"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ProductDetail } from "@/lib/types";

export function PdpTabs({ product }: { product: ProductDetail }) {
  const t = useTranslations("Product");
  const [tab, setTab] = useState<"overview" | "specs" | "compliance" | "safety">("overview");

  const tabs = [
    ["overview", t("tabs.overview")],
    ["specs", t("tabs.specs")],
    ["compliance", t("tabs.compliance")],
    ["safety", t("tabs.safety")],
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-t-md px-4 py-2 text-sm font-medium ${
              tab === id ? "border border-b-0 border-slate-200 bg-white text-sky-800" : "text-slate-600 hover:text-sky-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="border border-t-0 border-slate-200 bg-white p-4 text-sm">
        {tab === "overview" && (
          <div className="max-w-none space-y-2 text-sm leading-relaxed text-slate-700">
            <p>{product.description}</p>
            <p className="mt-2 text-xs text-slate-500">
              {product.moq_display} · {product.fulfillment_city}, {product.fulfillment_state}
            </p>
          </div>
        )}
        {tab === "specs" && (
          <dl className="grid gap-3 sm:grid-cols-2">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="border-b border-slate-100 pb-2">
                <dt className="text-xs font-semibold uppercase text-slate-500">{k.replace(/_/g, " ")}</dt>
                <dd className="text-slate-900">{String(v ?? "—")}</dd>
              </div>
            ))}
          </dl>
        )}
        {tab === "compliance" && (
          <ul className="space-y-2 text-sky-800">
            <li>
              <a href={product.coa_url ?? "#"} className="underline">
                {t("coa")}
              </a>
            </li>
            <li>
              <a href={product.sds_url ?? "#"} className="underline">
                {t("sds")}
              </a>
            </li>
            <li className="text-slate-600">{t("reach")}: template checklist (upload-first MVP).</li>
          </ul>
        )}
        {tab === "safety" && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-700">{t("ghs")}</p>
            <div className="flex flex-wrap gap-2">
              {product.ghs_codes.map((g) => (
                <span key={g} className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
                  {g}
                </span>
              ))}
            </div>
            <p>
              <span className="font-semibold">{t("hazards")}:</span> {product.hazards}
            </p>
            <p>
              <span className="font-semibold">{t("storage")}:</span> {product.storage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
