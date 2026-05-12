import { getTranslations } from "next-intl/server";
import { VendorOnboardingWizard } from "@/components/vendor-onboarding-wizard";

export default async function VendorOnboardingPage() {
  const t = await getTranslations("Vendor");
  return (
    <div className="border-b border-border bg-surface-page py-12 sm:py-16">
      <div className="ui-container max-w-4xl">
        <h1 className="font-display text-display-sm text-brand-navy">{t("onboardingTitle")}</h1>
        <p className="ui-prose mt-4 max-w-2xl text-lg">{t("pubchemHint")}</p>
        <div className="mt-10">
          <VendorOnboardingWizard />
        </div>
      </div>
    </div>
  );
}
