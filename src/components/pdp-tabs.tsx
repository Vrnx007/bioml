"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, ShieldAlert } from "lucide-react";
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
    <div className="ui-card overflow-hidden shadow-none">
      <div
        className="flex flex-wrap gap-0 border-b border-border bg-surface-muted/40 px-1 pt-1"
        role="tablist"
        aria-label="Product information"
      >
        {tabs.map(([id, label]) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={`relative min-h-11 rounded-t-md px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                active
                  ? "z-10 -mb-px border border-b-0 border-border bg-surface-elevated text-brand-navy"
                  : "text-text-secondary hover:bg-surface-elevated/70 hover:text-text-primary"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="border-t border-border bg-surface-elevated p-6 sm:p-8" role="tabpanel">
        {tab === "overview" && (
          <div className="max-w-measure space-y-4 text-base leading-relaxed text-text-secondary">
            <p className="text-text-primary">{product.description}</p>
            <p className="border-l-2 border-accent-teal pl-4 text-sm text-text-muted">
              {product.moq_display} · {product.fulfillment_city}, {product.fulfillment_state}
            </p>
          </div>
        )}
        {tab === "specs" && (
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="border-b border-border pb-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">{k.replace(/_/g, " ")}</dt>
                <dd className="mt-1.5 font-mono text-base text-text-primary">{String(v ?? "—")}</dd>
              </div>
            ))}
          </dl>
        )}
        {tab === "compliance" && (
          <ul className="space-y-4">
            <li>
              <a
                href={product.coa_url ?? "#"}
                className="inline-flex min-h-11 items-center gap-2 text-base font-semibold text-link hover:text-link-hover"
              >
                <FileText className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
                {t("coa")}
              </a>
            </li>
            <li>
              <a
                href={product.sds_url ?? "#"}
                className="inline-flex min-h-11 items-center gap-2 text-base font-semibold text-link hover:text-link-hover"
              >
                <ShieldAlert className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
                {t("sds")}
              </a>
            </li>
            <li className="text-sm leading-relaxed text-text-secondary">
              {t("reach")}: template checklist (upload-first MVP).
            </li>
          </ul>
        )}
        {tab === "safety" && (
          <div className="max-w-measure space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{t("ghs")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.ghs_codes.map((g) => (
                  <span
                    key={g}
                    className="rounded-md border border-warning-border bg-warning-surface px-3 py-1.5 font-mono text-sm font-semibold text-amber-950"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-base leading-relaxed text-text-secondary">
              <span className="font-semibold text-text-primary">{t("hazards")}:</span> {product.hazards}
            </p>
            <p className="text-base leading-relaxed text-text-secondary">
              <span className="font-semibold text-text-primary">{t("storage")}:</span> {product.storage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
