import { getTranslations } from "next-intl/server";

export default async function AdminReviewsPage() {
  const t = await getTranslations("Admin");
  return (
    <div className="border-b border-border bg-surface-page py-12">
      <div className="ui-container max-w-3xl">
        <h1 className="font-display text-display-sm text-brand-navy">{t("reviews")}</h1>
        <p className="ui-prose mt-4 text-base">
          List <code className="font-mono text-sm">reviews</code> where <code className="font-mono text-sm">moderation = pending</code>.
        </p>
        <div className="ui-card mt-8 border-dashed py-14 text-center text-text-muted shadow-none">No pending reviews (demo)</div>
      </div>
    </div>
  );
}
