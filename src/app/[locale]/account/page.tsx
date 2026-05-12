import { getTranslations } from "next-intl/server";
import { GstinForm } from "@/components/gstin-form";

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const t = await getTranslations("Account");
  const c = await getTranslations("Common");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
      <p className="mt-2 text-sm text-slate-600">
        {t("orders")} · {t("documents")} · {t("addresses")}
      </p>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t("gstin")}</h2>
        <p className="mt-1 text-xs text-slate-500">{t("gstinHint")}</p>
        <GstinForm />
      </section>

      {sp.rfq && (
        <section className="mt-8 rounded-lg border border-sky-200 bg-sky-50 p-6">
          <h2 className="font-semibold text-sky-900">RFQ (demo)</h2>
          <p className="mt-2 text-sm text-slate-700">
            Product: <strong>{sp.product ?? "—"}</strong>. Wire this form to `rfqs` / notifications in production.
          </p>
        </section>
      )}

      <section className="mt-8 text-sm text-slate-600">
        <p>
          {c("viewPricingLogin")} — after Supabase Auth, buyers with role <code className="rounded bg-slate-100 px-1">buyer_user</code> match
          RLS for <code className="rounded bg-slate-100 px-1">price_tiers</code>.
        </p>
      </section>
    </div>
  );
}
