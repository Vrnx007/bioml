import { getTranslations } from "next-intl/server";

export default async function AdminProductsPage() {
  const t = await getTranslations("Admin");
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("products")}</h1>
      <p className="mt-4 text-sm text-slate-600">
        List <code className="rounded bg-slate-100 px-1">products</code> with <code className="rounded bg-slate-100 px-1">pending_review</code> for
        moderation before publish.
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">No pending SKUs (demo)</div>
    </div>
  );
}
