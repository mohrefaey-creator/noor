"use client";
import { GraduationCap, Sparkles } from "lucide-react";
import type { PageAyah } from "@/lib/api/quran";
import {
  getDiffsForSurah,
  getRiwayah,
  type RiwayahId,
  type DiffEntry,
} from "@/data/qiraat/metadata";
import { computeRuleDiffs, mergeAyahDiffs } from "@/lib/qiraat/rules";
import { DiffWord } from "@/components/qiraat/diff-word";
import { toArabicDigits } from "@/lib/api/quran";
import { useT } from "@/lib/i18n/use-locale";

const AUDIBLE_TYPES = new Set(["madd", "hamz", "imalah", "naql", "idgham", "izhar", "harakah"]);

interface PageDiffPanelProps {
  riwayah: RiwayahId;
  ayahs: PageAyah[];
}

interface DiffRow {
  surah: number;
  ayah: number;
  diff: DiffEntry["diffs"][number];
}

function diffTypeKey(type: string) {
  return `diffType.${type}`;
}

export function PageDiffPanel({ riwayah, ayahs }: PageDiffPanelProps) {
  const t = useT();
  if (riwayah === "hafs") return null;
  const meta = getRiwayah(riwayah);
  if (!meta) return null;

  const surahsOnPage = Array.from(new Set(ayahs.map((a) => a.surah.number)));
  const jsonByAyah = new Map<string, DiffEntry["diffs"]>();
  for (const surah of surahsOnPage) {
    for (const entry of getDiffsForSurah(riwayah, surah)) {
      jsonByAyah.set(`${entry.surah}:${entry.ayah}`, entry.diffs);
    }
  }

  const rows: DiffRow[] = [];
  for (const a of ayahs) {
    const tokens = a.text.split(/\s+/);
    const json = jsonByAyah.get(`${a.surah.number}:${a.numberInSurah}`);
    const rules = computeRuleDiffs(riwayah, tokens);
    const merged = mergeAyahDiffs(json, rules);
    for (const d of merged) {
      rows.push({ surah: a.surah.number, ayah: a.numberInSurah, diff: d });
    }
  }

  if (rows.length === 0) {
    return (
      <div className="glass rounded-2xl p-5 text-sm">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="h-4 w-4 text-gold-400" />
          <p className="font-display text-base text-ink-50">
            {t("diff.banner.compare")}{" "}
            <span className="text-gold-400">{t("diff.hafs")}</span> ↔{" "}
            <span className="text-red-300">{meta.name}</span>
          </p>
        </div>
        <p className="text-ink-400">{t("diff.noVariants", { name: meta.name })}</p>
      </div>
    );
  }

  const byAyah = new Map<string, DiffRow[]>();
  for (const r of rows) {
    const k = `${r.surah}:${r.ayah}`;
    const list = byAyah.get(k) ?? [];
    list.push(r);
    byAyah.set(k, list);
  }

  const audibleCount = rows.filter((r) => AUDIBLE_TYPES.has(r.diff.type)).length;
  const wordCount = rows.length - audibleCount;

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-gold-500/25 bg-gold-400/[0.06] px-4 py-3 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-gold-500 mt-0.5" />
        <div className="text-sm text-ink-200">
          {t("diff.banner.compare")}{" "}
          <span className="font-medium text-ink-50">{t("diff.hafs")}</span> ↔{" "}
          <span className="font-medium text-gold-500">{meta.name}</span>{" "}
          <span dir="rtl" lang="ar" className="font-arabic text-base text-gold-500">
            ({meta.arabicName})
          </span>
          <span className="text-ink-400 block sm:inline sm:ms-2">
            —{" "}
            {wordCount > 0 && (
              <span className="text-red-500">{t("diff.banner.words", { n: wordCount, s: wordCount === 1 ? "" : "s" })}</span>
            )}
            {wordCount > 0 && audibleCount > 0 && <span className="text-ink-500"> · </span>}
            {audibleCount > 0 && (
              <span className="text-emerald-glow">{t("diff.banner.audio", { n: audibleCount })}</span>
            )}{" "}
            {t("diff.banner.onPage")}
          </span>
        </div>
      </div>

      {Array.from(byAyah.entries()).map(([key, list]) => {
        const [s, a] = key.split(":").map(Number);
        return (
          <div key={key} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-wider text-gold-400/80">
                {t("diff.surahAyah", { s, a })}{" "}
                <span dir="rtl" lang="ar" className="text-ink-400 font-arabic ms-1">
                  ({toArabicDigits(a)})
                </span>
              </p>
              <span className="text-[10px] text-ink-500">
                {t("diff.variants", { n: list.length, s: list.length === 1 ? "" : "s" })}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {list.map((r, i) => (
                <DiffCard key={i} row={r} riwayahName={meta.name} />
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-ink-500 text-center">{t("diff.legend")}</p>
    </div>
  );
}

interface DiffCardProps {
  row: DiffRow;
  riwayahName: string;
}

function DiffCard({ row, riwayahName }: DiffCardProps) {
  const t = useT();
  const { diff } = row;
  const audible = AUDIBLE_TYPES.has(diff.type);
  const variantBoxCls = audible
    ? "rounded-lg bg-emerald-glow/[0.10] border border-emerald-glow/25 p-3"
    : "rounded-lg bg-red-400/[0.08] border border-red-400/25 p-3";
  const variantLabelCls = audible ? "text-emerald-glow" : "text-red-500";
  const variantLabel = audible ? t("diff.audio") : t("diff.variant");
  const typeLabel = t(diffTypeKey(diff.type));
  return (
    <div className="rounded-xl border border-black/[0.06] bg-black/[0.02] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-wider text-ink-500">{typeLabel}</span>
        <span className="text-[10px] text-ink-500">{t("diff.wordHash", { n: diff.wordIndex + 1 })}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg bg-black/[0.04] border border-black/[0.06] p-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-500 mb-1">{t("diff.hafs")}</p>
          <p dir="rtl" lang="ar" className="font-arabic text-2xl text-ink-100 leading-tight">
            {diff.hafs}
          </p>
        </div>
        <div className={variantBoxCls}>
          <p className={`text-[10px] uppercase tracking-wider mb-1 ${variantLabelCls}`}>{variantLabel}</p>
          <div dir="rtl" lang="ar" className="font-arabic text-2xl leading-tight">
            <DiffWord word={diff.variant} diff={diff} riwayahName={riwayahName} />
          </div>
        </div>
      </div>
      {diff.note && (
        <div className="mt-3 space-y-1">
          <p
            dir="rtl"
            lang="ar"
            className="text-sm text-ink-200 leading-relaxed font-arabic text-right"
          >
            {diff.note.ar}
          </p>
          <p className="text-xs text-ink-400 leading-relaxed">{diff.note.en}</p>
        </div>
      )}
    </div>
  );
}
