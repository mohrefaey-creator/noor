"use client";
import { Popover } from "@/components/ui/popover";
import type { DiffEntry } from "@/data/qiraat/metadata";
import { useT } from "@/lib/i18n/use-locale";

interface DiffWordProps {
  word: string;
  diff: DiffEntry["diffs"][number];
  riwayahName: string;
}

const AUDIBLE_TYPES = new Set(["madd", "hamz", "imalah", "naql", "idgham", "izhar", "harakah"]);

export function DiffWord({ word, diff, riwayahName }: DiffWordProps) {
  const t = useT();
  const audible = AUDIBLE_TYPES.has(diff.type);
  const triggerCls = audible
    ? "text-emerald-glow underline decoration-emerald-glow/45 decoration-2 underline-offset-[6px] cursor-help"
    : "text-red-500 underline decoration-red-400/45 decoration-2 underline-offset-[6px] cursor-help";
  const variantBoxCls = audible
    ? "rounded-lg bg-emerald-glow/10 border border-emerald-glow/25 p-2.5"
    : "rounded-lg bg-red-400/10 border border-red-400/25 p-2.5";
  const variantLabelCls = audible ? "text-emerald-glow" : "text-red-500";
  const variantTextCls = audible ? "text-emerald-glow" : "text-red-500";
  const variantLabel = audible ? t("diff.audio") : t("diff.variant");
  const typeLabel = t(`diffType.${diff.type}`);

  return (
    <Popover
      align="center"
      className="min-w-[260px] max-w-xs"
      trigger={<span className={triggerCls}>{word}</span>}
    >
      <div className="space-y-2 text-start">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] uppercase tracking-wider text-ink-500">{typeLabel}</span>
          <span className="text-[10px] text-gold-500">{riwayahName}</span>
        </div>
        {audible && (
          <p className="text-[10px] text-emerald-glow leading-snug">{t("diff.audibleHint")}</p>
        )}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg bg-black/[0.04] border border-black/[0.06] p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-ink-500">{t("diff.hafs")}</p>
            <p dir="rtl" lang="ar" className="font-arabic text-xl mt-1 text-ink-100">{diff.hafs}</p>
          </div>
          <div className={variantBoxCls}>
            <p className={`text-[10px] uppercase tracking-wider ${variantLabelCls}`}>{variantLabel}</p>
            <p dir="rtl" lang="ar" className={`font-arabic text-xl mt-1 ${variantTextCls}`}>{diff.variant}</p>
          </div>
        </div>
        {diff.note && (
          <div className="space-y-1.5 pt-1">
            <p dir="rtl" lang="ar" className="text-sm text-ink-200 leading-relaxed font-arabic">{diff.note.ar}</p>
            <p className="text-xs text-ink-400 leading-relaxed">{diff.note.en}</p>
          </div>
        )}
      </div>
    </Popover>
  );
}
