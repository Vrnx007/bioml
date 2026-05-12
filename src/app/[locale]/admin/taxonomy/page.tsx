import { getTranslations } from "next-intl/server";

export default async function AdminTaxonomyPage() {
  const t = await getTranslations("Admin");
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("taxonomy")}</h1>
      <p className="mt-4 text-sm text-slate-600">
        CRUD on <code className="rounded bg-slate-100 px-1">product_categories</code> (slug, name_en, name_hi, parent_id, sort_order).
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">Taxonomy editor (demo)</div>
    </div>
  );
}
