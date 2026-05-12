import { getTranslations } from "next-intl/server";

export default async function AdminTaxonomyPage() {
  const t = await getTranslations("Admin");
  return (
    <div className="border-b border-border bg-surface-page py-12">
      <div className="ui-container max-w-3xl">
        <h1 className="font-display text-display-sm text-brand-navy">{t("taxonomy")}</h1>
        <p className="ui-prose mt-4 text-base">
          CRUD on <code className="font-mono text-sm">product_categories</code> (slug, name_en, name_hi, parent_id, sort_order).
        </p>
        <div className="ui-card mt-8 border-dashed py-14 text-center text-text-muted shadow-none">Taxonomy editor (demo)</div>
      </div>
    </div>
  );
}
