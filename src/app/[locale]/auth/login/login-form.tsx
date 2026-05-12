"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { DEMO_AUTH } from "@/lib/demo-auth";

export function LoginForm() {
  const t = useTranslations("Auth");
  const c = useTranslations("Common");
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fill = (e: string) => {
    setEmail(e);
    setPassword(DEMO_AUTH.password);
    setError(null);
  };

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError(t("notConfigured"));
      setLoading(false);
      return;
    }
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signErr) {
      setError(signErr.message);
      setLoading(false);
      return;
    }
    const next = searchParams.get("next");
    const safe =
      next && next.startsWith(`/${locale}/`) && !next.includes("://") && !next.includes("..") ? next : `/${locale}/catalog`;
    router.push(safe);
    router.refresh();
    setLoading(false);
  }

  const rows = [
    { role: t("demoRoleAdmin"), email: DEMO_AUTH.adminEmail },
    { role: t("demoRoleVendor"), email: DEMO_AUTH.vendorEmail },
    { role: t("demoRoleBuyer"), email: DEMO_AUTH.buyerEmail },
  ] as const;

  return (
    <div className="border-b border-border bg-surface-elevated py-12 sm:py-16">
      <div className="ui-container max-w-2xl">
        <h1 className="font-display text-display-sm text-brand-navy">{t("title")}</h1>
        <p className="mt-2 text-text-secondary">{t("subtitle")}</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="ui-label">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="ui-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="ui-label">
              {t("password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="ui-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="rounded-ui border border-warning-border bg-warning-surface px-3 py-2 text-sm text-text-primary" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="ui-btn-primary w-full" disabled={loading}>
            {loading ? t("signingIn") : t("signIn")}
          </button>
        </form>

        <section className="ui-card mt-10 p-5 shadow-card sm:p-6" aria-labelledby="demo-creds-heading">
          <h2 id="demo-creds-heading" className="text-sm font-semibold uppercase tracking-wide text-brand-navy">
            {t("demoAccountsTitle")}
          </h2>
          <p className="mt-3 font-mono text-sm font-semibold text-text-primary">
            {t("demoPasswordLine")}: <span className="select-all text-accent-teal-hover">{DEMO_AUTH.password}</span>
          </p>
          <div className="mt-4 overflow-x-auto rounded-ui border border-border">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead className="border-b border-border bg-surface-muted/60">
                <tr>
                  <th className="px-3 py-2 font-semibold text-brand-navy">{t("tableRole")}</th>
                  <th className="px-3 py-2 font-semibold text-brand-navy">{t("tableEmail")}</th>
                  <th className="w-28 px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map(({ role, email }) => (
                  <tr key={email} className="border-b border-border last:border-0">
                    <td className="px-3 py-2.5 text-text-secondary">{role}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-text-primary sm:text-sm">{email}</td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        className="ui-btn-secondary w-full whitespace-nowrap px-2 py-1.5 text-xs font-medium"
                        onClick={() => fill(email)}
                      >
                        {t("demoFill")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-text-muted">{t("demoInvalidHint")}</p>
        </section>

        <section className="mt-8 rounded-ui border border-border bg-surface-muted/40 px-4 py-3 text-sm">
          <p className="font-semibold text-brand-navy">{t("quickLinksTitle")}</p>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/admin" className="font-medium text-link hover:underline">
                {t("adminPanelLink")} → <span className="font-mono text-xs text-text-muted">/{locale}/admin</span>
              </Link>
            </li>
            <li>
              <Link href="/vendor/onboarding" className="font-medium text-link hover:underline">
                {t("vendorPortalLink")} → <span className="font-mono text-xs text-text-muted">/{locale}/vendor/onboarding</span>
              </Link>
            </li>
          </ul>
        </section>

        <p className="mt-8 text-center text-sm text-text-muted">
          <Link href="/catalog" className="font-medium text-link hover:underline">
            {c("brand")} — {t("backToCatalog")}
          </Link>
        </p>
      </div>
    </div>
  );
}
