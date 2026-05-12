import { getTranslations } from "next-intl/server";

export default async function AdminProductsPage() {
  const t = await getTranslations("Admin");
  return (
    <div className="border-b border-border bg-surface-page py-12">
      <div className="ui-container max-w-3xl">
        <h1 className="font-display text-display-sm text-brand-navy">{t("products")}</h1>
        <p className="ui-prose mt-4 text-base">
          List <code className="font-mono text-sm">products</code> with <code className="font-mono text-sm">pending_review</code> for moderation before publish.
        </p>
        <div className="ui-card mt-8 border-dashed py-14 text-center text-text-muted shadow-none">No pending SKUs (demo)</div>
      </div>
    </div>
  );
}
