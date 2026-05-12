import { getTranslations } from "next-intl/server";
import { GstinForm } from "@/components/gstin-form";

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const t = await getTranslations("Account");
  const c = await getTranslations("Common");

  return (
    <div className="border-b border-border bg-surface-page py-12 sm:py-16">
      <div className="ui-container max-w-3xl">
        <h1 className="font-display text-display-sm text-brand-navy">{t("title")}</h1>
        <p className="mt-3 text-base text-text-secondary">
          {t("orders")} · {t("documents")} · {t("addresses")}
        </p>

        <section className="ui-card mt-10 p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-brand-navy">{t("gstin")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{t("gstinHint")}</p>
          <GstinForm />
        </section>

        {sp.rfq && (
          <section className="mt-8 rounded-card border border-accent-teal/30 bg-accent-subtle/40 p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-brand-navy">RFQ (demo)</h2>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              Product: <strong className="text-text-primary">{sp.product ?? "—"}</strong>. Wire this flow to <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-sm">rfqs</code> and notifications in production.
            </p>
          </section>
        )}

        <section className="mt-10 rounded-ui border border-border bg-surface-muted/50 p-5 text-sm leading-relaxed text-text-secondary">
          <p>
            {c("viewPricingLogin")} — after Supabase Auth, buyers with role{" "}
            <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-xs text-text-primary">buyer_user</code> align with RLS for{" "}
            <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-xs text-text-primary">price_tiers</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
