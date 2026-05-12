import { getTranslations } from "next-intl/server";

export default async function AdminSellersPage() {
  const t = await getTranslations("Admin");
  return (
    <div className="border-b border-border bg-surface-page py-12">
      <div className="ui-container max-w-3xl">
        <h1 className="font-display text-display-sm text-brand-navy">{t("sellers")}</h1>
        <p className="ui-prose mt-4 text-base">
          Queue rows from <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-sm">vendor_profiles</code> where{" "}
          <code className="font-mono text-sm">onboarding_status</code> is not <code className="font-mono text-sm">live</code>. Approve with{" "}
          <code className="font-mono text-sm">approved_at</code> and an audit log entry.
        </p>
        <div className="ui-card mt-8 border-dashed py-14 text-center text-text-muted shadow-none">No pending sellers (demo)</div>
      </div>
    </div>
  );
}
