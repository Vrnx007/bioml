"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileSpreadsheet } from "lucide-react";

export default function VendorImportPage() {
  const t = useTranslations("Vendor");
  const [csv, setCsv] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const parse = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/parse-csv", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: csv,
      });
      setResult((await res.json()) as Record<string, unknown>);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-border bg-surface-page py-12 sm:py-16">
      <div className="ui-container max-w-4xl">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-ui border border-border bg-surface-elevated text-accent-teal">
            <FileSpreadsheet className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
          <div>
            <h1 className="font-display text-display-sm text-brand-navy">{t("csvTitle")}</h1>
            <p className="ui-prose mt-3 max-w-3xl text-base">{t("csvHint")}</p>
          </div>
        </div>

        <label htmlFor="csv-input" className="ui-label mt-8">
          Paste CSV
        </label>
        <textarea
          id="csv-input"
          className="ui-input min-h-[12rem] font-mono text-sm leading-relaxed"
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder={`Product_Name,CAS_Number,...\n"Caustic Soda",1310-73-2,...`}
        />
        <button
          type="button"
          disabled={loading || !csv.trim()}
          onClick={parse}
          className="ui-btn-primary mt-4 disabled:opacity-50"
        >
          {loading ? "Parsing…" : t("parseCsv")}
        </button>
        {result && (
          <pre
            className="mt-8 max-h-[28rem] overflow-auto rounded-card border border-border bg-brand-navy p-5 font-mono text-sm leading-relaxed text-emerald-100 shadow-inner"
            tabIndex={0}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
