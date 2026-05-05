"use client";
import { GraduationCap, Sparkles } from "lucide-react";
import { Popover } from "@/components/ui/popover";
import { RIWAYAT, type RiwayahId } from "@/data/qiraat/metadata";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/use-locale";

interface QiraatPickerProps {
  value: RiwayahId;
  onChange: (id: RiwayahId) => void;
  diffCount?: number;
}

export function QiraatPicker({ value, onChange, diffCount }: QiraatPickerProps) {
  const t = useT();
  const active = RIWAYAT.find((r) => r.id === value)!;
  const isHafs = value === "hafs";

  return (
    <Popover
      align="end"
      className="min-w-[320px] max-w-sm max-h-[28rem] overflow-y-auto scrollbar-thin"
      trigger={
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:border-gold-400/30 bg-black/[0.04] text-sm text-ink-100 transition-colors">
          <GraduationCap className="h-4 w-4 text-gold-400" />
          <span className="font-medium">{active.name}</span>
          {!isHafs && typeof diffCount === "number" && diffCount > 0 && (
            <span className="ms-1 px-1.5 py-0.5 rounded-md text-[10px] bg-red-400/15 text-red-300">
              {t("qiraatPicker.diff", { n: diffCount })}
            </span>
          )}
        </span>
      }
    >
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-ink-400 mb-1 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-gold-400" /> {t("qiraatPicker.choose")}
        </p>
        {[1, 2, 3].map((tier) => {
          const list = RIWAYAT.filter((r) => r.tier === tier);
          const heading =
            tier === 1
              ? t("qiraatPicker.tier.verified")
              : tier === 2
              ? t("qiraatPicker.tier.soon")
              : t("qiraatPicker.tier.future");
          return (
            <div key={tier}>
              <p className="text-[10px] uppercase tracking-wider text-ink-500 mt-3 mb-1.5">{heading}</p>
              <div className="space-y-1">
                {list.map((r) => {
                  const disabled = r.tier > 1 && r.id !== "hafs";
                  const isActive = r.id === value;
                  return (
                    <button
                      key={r.id}
                      disabled={disabled}
                      onClick={() => onChange(r.id)}
                      className={cn(
                        "w-full text-start px-3 py-2 rounded-lg transition-colors flex items-center justify-between gap-2",
                        isActive
                          ? "bg-gold-400/15 text-ink-50 border border-gold-400/30"
                          : disabled
                          ? "text-ink-500 cursor-not-allowed"
                          : "hover:bg-black/[0.06] text-ink-200"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{r.name}</p>
                        <p className="text-[11px] text-ink-400 truncate" dir="rtl" lang="ar">
                          {r.arabicName}
                        </p>
                      </div>
                      {disabled && <span className="text-[10px] text-ink-500">{t("action.soon")}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Popover>
  );
}
