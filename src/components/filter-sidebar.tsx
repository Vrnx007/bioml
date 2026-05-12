"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ChevronDown, Search } from "lucide-react";
import { PROMOTION_TAG_OPTIONS } from "@/lib/catalog-filter-state";
import type { FacetMap } from "@/lib/catalog-facets";
import { CATEGORY_SLUGS } from "@/lib/catalog-filters";

const SHOW_MORE_CAP = 8;

export type SerializableFacetMap = Record<string, { value: string; count: number }[]>;

type Props = { facets: SerializableFacetMap; categoryCounts: Record<string, number> };

function cloneParams(sp: URLSearchParams) {
  return new URLSearchParams(sp.toString());
}

function toggleRepeated(n: URLSearchParams, key: string, value: string, on: boolean) {
  const cur = n.getAll(key);
  n.delete(key);
  const next = on ? [...cur.filter((x) => x !== value), value] : cur.filter((x) => x !== value);
  next.forEach((v) => n.append(key, v));
}

export function FilterSidebar({ facets, categoryCounts }: Props) {
  const t = useTranslations("Filters");
  const tc = useTranslations("Catalog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});

  const pushParams = useCallback(
    (n: URLSearchParams) => {
      const q = n.toString();
      router.push(q ? `${pathname}?${q}` : pathname);
    },
    [pathname, router]
  );

  const casMode = (searchParams.get("casMode") === "and" ? "and" : "or") as "or" | "and";
  const productTypeMode = (searchParams.get("productTypeMode") === "and" ? "and" : "or") as "or" | "and";
  const apiFamilyMode = (searchParams.get("apiFamilyMode") === "and" ? "and" : "or") as "or" | "and";
  const impurityTypeMode = (searchParams.get("impurityTypeMode") === "and" ? "and" : "or") as "or" | "and";
  const formatMode = (searchParams.get("formatMode") === "and" ? "and" : "or") as "or" | "and";

  const setMode = useCallback(
    (key: string, mode: "or" | "and") => {
      const n = cloneParams(searchParams);
      n.set(key, mode);
      pushParams(n);
    },
    [pushParams, searchParams]
  );

  const toggle = useCallback(
    (key: string, value: string, checked: boolean) => {
      const n = cloneParams(searchParams);
      toggleRepeated(n, key, value, checked);
      pushParams(n);
    },
    [pushParams, searchParams]
  );

  const setSingle = useCallback(
    (key: string, value: string) => {
      const n = cloneParams(searchParams);
      if (!value) n.delete(key);
      else n.set(key, value);
      pushParams(n);
    },
    [pushParams, searchParams]
  );

  const has = useCallback((key: string, val: string) => searchParams.getAll(key).includes(val), [searchParams]);

  const facetList = useMemo(() => facets as FacetMap, [facets]);

  const ModeToggle = ({ param, value }: { param: string; value: "or" | "and" }) => (
    <div className="mb-3 flex items-center gap-2 rounded-full border border-border bg-surface-muted/60 p-1 text-xs font-semibold">
      <button
        type="button"
        className={`flex-1 rounded-full px-2 py-1.5 transition ${value === "or" ? "bg-surface-elevated text-accent-teal shadow-sm" : "text-text-muted"}`}
        onClick={() => setMode(param, "or")}
      >
        {t("modeOr")}
      </button>
      <button
        type="button"
        className={`flex-1 rounded-full px-2 py-1.5 transition ${value === "and" ? "bg-surface-elevated text-accent-teal shadow-sm" : "text-text-muted"}`}
        onClick={() => setMode(param, "and")}
      >
        {t("modeAnd")}
      </button>
    </div>
  );

  const CheckboxList = ({
    dimKey,
    options,
    param,
    expandedKey,
  }: {
    dimKey: string;
    options: { value: string; count: number }[];
    param: string;
    expandedKey: string;
  }) => {
    const expanded = showMore[expandedKey] ?? false;
    const list = expanded ? options : options.slice(0, SHOW_MORE_CAP);
    return (
      <ul className="space-y-1">
        {list.map(({ value, count }) => (
          <li key={`${dimKey}-${value}`}>
            <label className="flex min-h-10 cursor-pointer items-center justify-between gap-2 rounded-md px-1 py-1.5 text-sm text-text-secondary hover:bg-surface-muted/80">
              <span className="flex min-w-0 items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 rounded border-border-strong text-accent-teal focus:ring-accent-teal"
                  checked={has(param, value)}
                  onChange={(e) => toggle(param, value, e.target.checked)}
                />
                <span className="min-w-0 leading-snug">{value}</span>
              </span>
              <span className="shrink-0 tabular-nums text-text-muted">{count}</span>
            </label>
          </li>
        ))}
        {options.length > SHOW_MORE_CAP && (
          <li>
            <button
              type="button"
              className="mt-1 text-sm font-semibold text-link hover:underline"
              onClick={() => setShowMore((s) => ({ ...s, [expandedKey]: !expanded }))}
            >
              {expanded ? t("showLess") : t("showMore")}
            </button>
          </li>
        )}
      </ul>
    );
  };

  const SearchRow = ({ param, placeholderKey }: { param: string; placeholderKey: "selectOrSearch" }) => {
    const fromUrl = searchParams.get(param) ?? "";
    const [local, setLocal] = useState(fromUrl);
    useEffect(() => {
      setLocal(fromUrl);
    }, [fromUrl, param]);
    const opts = facetList[param as keyof FacetMap] ?? [];
    return (
      <div className="space-y-2">
        <div className="relative">
          <input
            list={`dl-${param}`}
            className="ui-input pr-10 text-sm"
            placeholder={t(placeholderKey)}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setSingle(param, (e.target as HTMLInputElement).value.trim());
            }}
            onBlur={() => setSingle(param, local.trim())}
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
        </div>
        <datalist id={`dl-${param}`}>
          {opts.map((o) => (
            <option key={o.value} value={o.value} />
          ))}
        </datalist>
      </div>
    );
  };

  const categoryCountsResolved = categoryCounts;

  return (
    <aside className="ui-card w-full shrink-0 overflow-hidden lg:w-80">
      <div className="border-b border-border bg-surface-muted/50 px-4 py-4 text-center">
        <h2 className="font-display text-base font-semibold text-brand-navy">{t("filterResults")}</h2>
      </div>

      <ul className="max-h-[min(72vh,720px)] divide-y divide-border overflow-y-auto [scrollbar-width:thin]">
        <FilterSection title={t("category")} accent>
          <ul className="space-y-1">
            {CATEGORY_SLUGS.map((slug) => (
              <li key={slug}>
                <label className="flex min-h-10 cursor-pointer items-center justify-between gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-surface-muted/80">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category-ui"
                      className="h-4 w-4 border-border-strong text-accent-teal focus:ring-accent-teal"
                      checked={searchParams.get("category") === slug}
                      onChange={() => setSingle("category", slug)}
                    />
                    <span className="capitalize text-text-secondary">{slug.replace(/-/g, " ")}</span>
                  </span>
                  <span className="tabular-nums text-text-muted">{categoryCountsResolved[slug] ?? 0}</span>
                </label>
              </li>
            ))}
            {searchParams.get("category") && (
              <li>
                <button type="button" className="text-sm font-semibold text-link hover:underline" onClick={() => setSingle("category", "")}>
                  {t("clearCategory")}
                </button>
              </li>
            )}
          </ul>
        </FilterSection>

        <FilterSection title={t("promotion")}>
          <ul className="space-y-1">
            {PROMOTION_TAG_OPTIONS.map(({ value, labelKey }) => {
              const count = facetList.promotionTags?.find((x) => x.value === value)?.count ?? 0;
              return (
                <li key={value}>
                  <label className="flex min-h-10 cursor-pointer items-center justify-between gap-2 rounded-md px-1 py-1.5 text-sm text-text-secondary hover:bg-surface-muted/80">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border-strong text-accent-teal focus:ring-accent-teal"
                        checked={has("promotionTag", value)}
                        onChange={(e) => toggle("promotionTag", value, e.target.checked)}
                      />
                      {t(labelKey)}
                    </span>
                    <span className="tabular-nums text-text-muted">{count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterSection>

        <FilterSection title={t("productType")}>
          <ModeToggle param="productTypeMode" value={productTypeMode} />
          <CheckboxList dimKey="pt" options={facetList.productType ?? []} param="productType" expandedKey="pt" />
        </FilterSection>

        <FilterSection title={t("apiFamily")}>
          <ModeToggle param="apiFamilyMode" value={apiFamilyMode} />
          <CheckboxList dimKey="af" options={facetList.apiFamily ?? []} param="apiFamily" expandedKey="af" />
        </FilterSection>

        <FilterSection title={t("analyte")}>
          <SearchRow param="analyte" placeholderKey="selectOrSearch" />
          <CheckboxList dimKey="an" options={facetList.analyte ?? []} param="analyte" expandedKey="an" />
        </FilterSection>

        <FilterSection title={t("casNumber")}>
          <ModeToggle param="casMode" value={casMode} />
          <CheckboxList dimKey="cas" options={facetList.cas ?? []} param="cas" expandedKey="cas" />
        </FilterSection>

        <FilterSection title={t("productFormat")}>
          <ModeToggle param="formatMode" value={formatMode} />
          <CheckboxList dimKey="fmt" options={facetList.format ?? []} param="format" expandedKey="fmt" />
        </FilterSection>

        <FilterSection title={t("impurityType")}>
          <ModeToggle param="impurityTypeMode" value={impurityTypeMode} />
          <CheckboxList dimKey="im" options={facetList.impurityType ?? []} param="impurityType" expandedKey="im" />
        </FilterSection>

        <FilterSection title={t("silType")}>
          <CheckboxList dimKey="sil" options={facetList.silType ?? []} param="silType" expandedKey="sil" />
        </FilterSection>

        <FilterSection title={t("matrix")}>
          <CheckboxList dimKey="mx" options={facetList.matrix ?? []} param="matrix" expandedKey="mx" />
        </FilterSection>

        <FilterSection title={t("brand")}>
          <CheckboxList dimKey="br" options={facetList.brand ?? []} param="brand" expandedKey="br" />
        </FilterSection>

        <FilterSection title={t("productAccreditations")}>
          <CheckboxList dimKey="pa" options={facetList.productAccreditations ?? []} param="productAccreditations" expandedKey="pa" />
        </FilterSection>

        <FilterSection title={t("labAccreditations")}>
          <CheckboxList dimKey="la" options={facetList.labAccreditations ?? []} param="labAccreditations" expandedKey="la" />
        </FilterSection>

        <FilterSection title={t("location")}>
          <CheckboxList dimKey="st" options={facetList.state ?? []} param="state" expandedKey="st" />
        </FilterSection>
      </ul>

      <div className="border-t border-border bg-surface-muted/30 p-3">
        <button
          type="button"
          className="ui-btn-secondary w-full border-dashed py-2.5 text-sm font-medium"
          onClick={() => router.push(pathname)}
        >
          {tc("clearFilters")}
        </button>
      </div>
    </aside>
  );
}

function FilterSection({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <li className="px-1">
      <details className="group px-3 py-1" open>
        <summary
          className={`flex cursor-pointer list-none items-center justify-between gap-2 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden ${accent ? "border-l-2 border-accent-teal pl-2 text-brand-navy" : "text-brand-navy"}`}
        >
          <span>{title}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden />
        </summary>
        <div className="border-t border-border pb-3 pt-2">{children}</div>
      </details>
    </li>
  );
}
