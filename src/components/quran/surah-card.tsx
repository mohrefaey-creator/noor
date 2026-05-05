"use client";
import Link from "next/link";
import type { SurahMeta } from "@/data/surahs";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/use-locale";

interface SurahCardProps {
  surah: SurahMeta;
  index: number;
  memorizedAyahs?: number;
}

export function SurahCard({ surah, memorizedAyahs = 0 }: SurahCardProps) {
  const t = useT();
  const pct = Math.min(100, Math.round((memorizedAyahs / surah.ayahs) * 100));
  return (
    <div>
      <Link
        href={`/mushaf/${surah.page}#surah-${surah.id}`}
        className="group relative block rounded-2xl border border-black/[0.06] bg-black/[0.02] hover:border-gold-400/30 hover:bg-black/[0.05] transition-all p-4 overflow-hidden"
      >
        {/* hover glow */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-gold-400/10 via-transparent to-transparent" />

        <div className="relative flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <svg viewBox="0 0 40 40" className="h-11 w-11">
              <polygon
                points="20,2 36,11 36,29 20,38 4,29 4,11"
                fill="none"
                stroke="rgba(234, 88, 12,0.35)"
                strokeWidth="1"
              />
              <polygon
                points="20,2 36,11 36,29 20,38 4,29 4,11"
                fill="rgba(234, 88, 12,0.06)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gold-400">
              {surah.id}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display text-base text-ink-50 leading-tight truncate">
                  {surah.transliteration}
                </h3>
                <p className="text-[11px] text-ink-400 mt-0.5 truncate">{surah.english}</p>
              </div>
              <span dir="rtl" lang="ar" className="font-arabic text-xl text-gold-500 leading-[1.6] py-0.5 whitespace-nowrap">
                {surah.name}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2.5 text-[10px] uppercase tracking-wider text-ink-500">
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-md",
                  surah.type === "meccan" ? "bg-amber-400/10 text-amber-300" : "bg-emerald-glow/15 text-emerald-glow"
                )}
              >
                {surah.type === "meccan" ? t("surah.type.meccan") : t("surah.type.medinan")}
              </span>
              <span>{t("surah.ayahs", { n: surah.ayahs })}</span>
            </div>

            {pct > 0 && (
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-black/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-glow to-emerald rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-emerald-glow font-medium">{pct}%</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
