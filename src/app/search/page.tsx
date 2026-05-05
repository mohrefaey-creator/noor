"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, BookOpen } from "lucide-react";
import Fuse from "fuse.js";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SURAHS, getSurah } from "@/data/surahs";
import { fetchSurah, type SurahData } from "@/lib/api/quran";
import { normalizeArabic } from "@/lib/hifz/normalize";
import { debounce } from "@/lib/utils";
import { usePreferences } from "@/lib/store/preferences";
import { useT } from "@/lib/i18n/use-locale";

interface IndexEntry {
  surah: number;
  ayah: number;
  arabic: string;
  arabicNorm: string;
  translation: string;
}

export default function SearchPage() {
  const t = useT();
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"surah" | "ayah">("ayah");
  const [lang, setLang] = useState<"any" | "ar" | "en">("any");
  const translationEdition = usePreferences((s) => s.translation);
  const [index, setIndex] = useState<IndexEntry[]>([]);
  const [loadingPct, setLoadingPct] = useState<number | null>(null);
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const f = debounce((value: unknown) => setDebouncedQ(value as string), 250);
    f(q);
  }, [q]);

  useEffect(() => {
    if (scope !== "ayah" || !debouncedQ.trim() || index.length > 0 || loadingPct !== null) return;
    let cancelled = false;
    (async () => {
      setLoadingPct(0);
      const out: IndexEntry[] = [];
      for (let i = 0; i < SURAHS.length; i++) {
        if (cancelled) return;
        try {
          const [arabic, translation] = await Promise.all([
            fetchSurah(SURAHS[i].id, "quran-uthmani"),
            fetchSurah(SURAHS[i].id, translationEdition).catch(() => null),
          ]);
          arabic.ayahs.forEach((a, ai) => {
            out.push({
              surah: SURAHS[i].id,
              ayah: a.numberInSurah,
              arabic: a.text,
              arabicNorm: normalizeArabic(a.text),
              translation: (translation as SurahData | null)?.ayahs[ai]?.text ?? "",
            });
          });
        } catch {
          /* ignore individual failures */
        }
        setLoadingPct(Math.round(((i + 1) / SURAHS.length) * 100));
      }
      if (!cancelled) {
        setIndex(out);
        setLoadingPct(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scope, debouncedQ, index.length, loadingPct, translationEdition]);

  const fuse = useMemo(() => {
    if (scope !== "ayah" || index.length === 0) return null;
    const keys: { name: keyof IndexEntry; weight: number }[] = [];
    if (lang !== "en") keys.push({ name: "arabicNorm", weight: 0.55 });
    if (lang !== "ar") keys.push({ name: "translation", weight: 0.45 });
    return new Fuse(index, { keys, threshold: 0.35, ignoreLocation: true, includeMatches: true });
  }, [index, lang, scope]);

  const results = useMemo(() => {
    if (!debouncedQ.trim()) return null;
    if (scope === "surah") {
      const term = debouncedQ.toLowerCase();
      return SURAHS.filter(
        (s) =>
          s.transliteration.toLowerCase().includes(term) ||
          s.english.toLowerCase().includes(term) ||
          s.name.includes(term) ||
          String(s.id) === term
      ).map((s) => ({ kind: "surah" as const, surah: s }));
    }
    if (!fuse) return [];
    const norm = normalizeArabic(debouncedQ);
    const hits = fuse.search(norm.length >= 2 ? norm : debouncedQ).slice(0, 60);
    return hits.map((h) => ({ kind: "ayah" as const, entry: h.item }));
  }, [debouncedQ, fuse, scope]);

  return (
    <div>
      <PageHeader
        title={t("search.title")}
        arabicTitle={t("search.arabicTitle")}
        description={t("search.description")}
      />

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="ps-10"
          />
        </div>
        <Tabs
          value={scope}
          onChange={(v) => setScope(v as "surah" | "ayah")}
          options={[
            { value: "surah", label: t("search.scope.surah") },
            { value: "ayah", label: t("search.scope.ayah") },
          ]}
        />
        {scope === "ayah" && (
          <Tabs
            value={lang}
            onChange={(v) => setLang(v as "any" | "ar" | "en")}
            options={[
              { value: "any", label: t("search.lang.both") },
              { value: "ar", label: t("search.lang.ar") },
              { value: "en", label: t("search.lang.en") },
            ]}
          />
        )}
      </div>

      {scope === "ayah" && loadingPct !== null && (
        <div className="mb-4">
          <p className="text-xs text-ink-400 mb-1.5">
            {t("search.building", { n: loadingPct })}
          </p>
          <div className="h-1 rounded-full bg-black/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-400 to-gold-500"
              style={{ width: `${loadingPct}%` }}
            />
          </div>
        </div>
      )}

      {!debouncedQ.trim() && (
        <div className="glass rounded-2xl p-8 text-center">
          <SearchIcon className="h-8 w-8 text-gold-400 mx-auto mb-3" />
          <p className="text-ink-200">{t("search.empty.title")}</p>
          <p className="text-xs text-ink-400 mt-1">{t("search.empty.hint")}</p>
        </div>
      )}

      {results && results.length === 0 && debouncedQ && loadingPct === null && (
        <p className="text-center text-ink-400 py-10">{t("search.noMatches")}</p>
      )}

      {results && results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, i) => {
            if (r.kind === "surah") {
              return (
                <Link
                  key={`s-${r.surah.id}`}
                  href={`/surah/${r.surah.id}`}
                  className="block glass rounded-2xl p-4 hover:bg-black/[0.06] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-lg text-ink-50">{r.surah.transliteration}</p>
                      <p className="text-xs text-ink-400">
                        {t("search.surahMeta", { english: r.surah.english, n: r.surah.ayahs })}
                      </p>
                    </div>
                    <span dir="rtl" lang="ar" className="font-arabic text-2xl gold-text">
                      {r.surah.name}
                    </span>
                  </div>
                </Link>
              );
            }
            const surah = getSurah(r.entry.surah);
            return (
              <Link
                key={`a-${r.entry.surah}-${r.entry.ayah}-${i}`}
                href={`/surah/${r.entry.surah}#ayah-${r.entry.ayah}`}
                className="block glass rounded-2xl p-5 hover:bg-black/[0.05] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="font-medium text-gold-400">{surah?.transliteration}</span>
                  <span className="text-ink-400">{r.entry.surah}:{r.entry.ayah}</span>
                  <BookOpen className="h-3 w-3 text-ink-500 ms-auto" />
                </div>
                <p dir="rtl" lang="ar" className="font-arabic text-2xl leading-loose text-ink-50 text-balance">
                  {r.entry.arabic}
                </p>
                {r.entry.translation && (
                  <p className="text-sm text-ink-300 mt-2 leading-relaxed">{r.entry.translation}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {scope === "ayah" && loadingPct !== null && (
        <div className="space-y-3 mt-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}
    </div>
  );
}
