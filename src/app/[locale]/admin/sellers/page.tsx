import { getTranslations } from "next-intl/server";

export default async function AdminSellersPage() {
  const t = await getTranslations("Admin");
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("sellers")}</h1>
      <p className="mt-4 text-sm text-slate-600">
        Queue rows from <code className="rounded bg-slate-100 px-1">vendor_profiles</code> where{" "}
        <code className="rounded bg-slate-100 px-1">onboarding_status</code> is not <code className="rounded bg-slate-100 px-1">live</code>. Approve
        with <code className="rounded bg-slate-100 px-1">approved_at</code> + audit log entry.
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">No pending sellers (demo)</div>
    </div>
  );
}
