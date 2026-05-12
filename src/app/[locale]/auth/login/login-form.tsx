"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  return (
    <div className="border-b border-border bg-surface-elevated py-12 sm:py-16">
      <div className="ui-container max-w-md">
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

        <p className="mt-8 text-center text-sm text-text-muted">
          <Link href="/catalog" className="font-medium text-link hover:underline">
            {c("brand")} — {t("backToCatalog")}
          </Link>
        </p>
      </div>
    </div>
  );
}
