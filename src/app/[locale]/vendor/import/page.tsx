"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("csvTitle")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("csvHint")}</p>
      <textarea
        className="mt-4 h-48 w-full rounded border border-slate-200 bg-white p-3 font-mono text-xs"
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        placeholder='Product_Name,CAS_Number,...\n"Caustic Soda",1310-73-2,...'
      />
      <button
        type="button"
        disabled={loading || !csv.trim()}
        onClick={parse}
        className="mt-3 rounded bg-sky-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "…" : t("parseCsv")}
      </button>
      {result && (
        <pre className="mt-6 overflow-auto rounded border border-slate-200 bg-slate-900 p-4 text-xs text-green-100">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
