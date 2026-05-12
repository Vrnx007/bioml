import { getTranslations } from "next-intl/server";
import { VendorOnboardingWizard } from "@/components/vendor-onboarding-wizard";

export default async function VendorOnboardingPage() {
  const t = await getTranslations("Vendor");
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("onboardingTitle")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("pubchemHint")}</p>
      <div className="mt-8">
        <VendorOnboardingWizard />
      </div>
    </div>
  );
}
