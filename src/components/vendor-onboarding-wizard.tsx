"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const steps = [1, 2, 3, 4, 5] as const;

export function VendorOnboardingWizard() {
  const t = useTranslations("Vendor");
  const [step, setStep] = useState<(typeof steps)[number]>(1);

  const labels = [t("step1"), t("step2"), t("step3"), t("step4"), t("step5")];

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-8 flex flex-wrap gap-2">
        {steps.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setStep(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                step === s ? "bg-sky-700 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {s}. {labels[s - 1]}
            </button>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">GSTIN / PAN upload and verification queue (admin or API provider).</p>
          <input className="mt-4 w-full rounded border px-3 py-2 text-sm" placeholder="GSTIN" />
        </div>
      )}
      {step === 2 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">Company legal name, addresses, bank reference ID (no raw PAN in logs).</p>
          <input className="mt-4 w-full rounded border px-3 py-2 text-sm" placeholder="Legal name" />
        </div>
      )}
      {step === 3 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">CSV / API catalog — use the import page. Auto-CAS match via PubChem.</p>
        </div>
      )}
      {step === 4 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">CoA / SDS templates, versioning in Supabase Storage.</p>
        </div>
      )}
      {step === 5 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">Training checklist and go-live flag on vendor_profiles.onboarding_status.</p>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          disabled={step <= 1}
          onClick={() => setStep((s) => (s > 1 ? ((s - 1) as (typeof steps)[number]) : s))}
          className="rounded border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
        >
          {t("back")}
        </button>
        <button
          type="button"
          disabled={step >= 5}
          onClick={() => setStep((s) => (s < 5 ? ((s + 1) as (typeof steps)[number]) : s))}
          className="rounded bg-sky-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
