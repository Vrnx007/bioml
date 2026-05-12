"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

const steps = [1, 2, 3, 4, 5] as const;

export function VendorOnboardingWizard() {
  const t = useTranslations("Vendor");
  const [step, setStep] = useState<(typeof steps)[number]>(1);

  const labels = [t("step1"), t("step2"), t("step3"), t("step4"), t("step5")];

  return (
    <div>
      <ol className="mb-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-2" aria-label="Onboarding steps">
        {steps.map((s) => {
          const done = s < step;
          const active = s === step;
          return (
            <li key={s} className="flex-1 sm:flex-initial">
              <button
                type="button"
                onClick={() => setStep(s)}
                className={`flex w-full min-h-11 items-center gap-2 rounded-ui border px-3 py-2.5 text-left text-sm font-semibold transition sm:min-w-0 ${
                  active
                    ? "border-accent-teal bg-accent-subtle text-brand-navy"
                    : done
                      ? "border-success/30 bg-success-surface text-success"
                      : "border-border bg-surface-elevated text-text-muted hover:border-border-strong"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    active ? "bg-accent-teal text-white" : done ? "bg-success text-white" : "bg-surface-muted text-text-muted"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : s}
                </span>
                <span className="leading-snug">{labels[s - 1]}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <div className="ui-card p-6 shadow-card sm:p-8">
          <p className="text-base leading-relaxed text-text-secondary">GSTIN / PAN upload and verification queue (admin or API provider).</p>
          <label className="ui-label mt-6">GSTIN</label>
          <input className="ui-input max-w-md" placeholder="15-character GSTIN" />
        </div>
      )}
      {step === 2 && (
        <div className="ui-card p-6 shadow-card sm:p-8">
          <p className="text-base leading-relaxed text-text-secondary">Company legal name, addresses, bank reference ID (no raw PAN in logs).</p>
          <label className="ui-label mt-6">Legal name</label>
          <input className="ui-input" placeholder="Registered legal entity" />
        </div>
      )}
      {step === 3 && (
        <div className="ui-card p-6 shadow-card sm:p-8">
          <p className="text-base leading-relaxed text-text-secondary">CSV / API catalog — use the import page. Auto-CAS match via PubChem.</p>
        </div>
      )}
      {step === 4 && (
        <div className="ui-card p-6 shadow-card sm:p-8">
          <p className="text-base leading-relaxed text-text-secondary">CoA / SDS templates, versioning in Supabase Storage.</p>
        </div>
      )}
      {step === 5 && (
        <div className="ui-card p-6 shadow-card sm:p-8">
          <p className="text-base leading-relaxed text-text-secondary">
            Training checklist and go-live flag on <span className="font-mono text-sm">vendor_profiles.onboarding_status</span>.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <button
          type="button"
          disabled={step <= 1}
          onClick={() => setStep((s) => (s > 1 ? ((s - 1) as (typeof steps)[number]) : s))}
          className="ui-btn-secondary disabled:pointer-events-none disabled:opacity-40"
        >
          {t("back")}
        </button>
        <button
          type="button"
          disabled={step >= 5}
          onClick={() => setStep((s) => (s < 5 ? ((s + 1) as (typeof steps)[number]) : s))}
          className="ui-btn-primary disabled:pointer-events-none disabled:opacity-40"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
