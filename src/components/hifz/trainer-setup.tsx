"use client";
import { useState } from "react";
import { Mic, Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { SURAHS } from "@/data/surahs";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/use-locale";

export interface TrainerConfig {
  surahId: number;
  fromAyah: number;
  toAyah: number;
  hideMode: "blur" | "dashes" | "boxes";
  strictness: "lenient" | "strict";
  hintAfterSeconds: number;
}

interface TrainerSetupProps {
  initial?: Partial<TrainerConfig>;
  onStart: (cfg: TrainerConfig) => void;
}

export function TrainerSetup({ initial, onStart }: TrainerSetupProps) {
  const t = useT();
  const [surahId, setSurahId] = useState(initial?.surahId ?? 1);
  const surah = SURAHS.find((s) => s.id === surahId)!;
  const [from, setFrom] = useState(Math.max(1, initial?.fromAyah ?? 1));
  const [to, setTo] = useState(Math.min(surah.ayahs, initial?.toAyah ?? surah.ayahs));
  const [hideMode, setHideMode] = useState<TrainerConfig["hideMode"]>(initial?.hideMode ?? "blur");
  const [strictness, setStrictness] = useState<TrainerConfig["strictness"]>(initial?.strictness ?? "lenient");
  const [hintAfter, setHintAfter] = useState(initial?.hintAfterSeconds ?? 6);

  const onSurahChange = (id: number) => {
    setSurahId(id);
    const s = SURAHS.find((x) => x.id === id)!;
    setFrom(1);
    setTo(s.ayahs);
  };

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -end-24 h-56 w-56 rounded-full bg-emerald-glow/15 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-ink-400 mb-2 block">
              {t("trainer.surah")}
            </label>
            <Select
              value={String(surahId)}
              onChange={(v) => onSurahChange(Number(v))}
              options={SURAHS.map((s) => ({ value: String(s.id), label: `${s.id}. ${s.transliteration}` }))}
              className="w-full"
              ariaLabel={t("trainer.surahAria")}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-ink-400 mb-2 block">
              {t("trainer.ayahRange")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={surah.ayahs}
                value={from}
                onChange={(e) => setFrom(Math.max(1, Math.min(surah.ayahs, Number(e.target.value))))}
                className="h-10 w-full rounded-xl border border-white/10 bg-black/[0.03] px-3 text-sm text-ink-50"
              />
              <span className="text-ink-400">→</span>
              <input
                type="number"
                min={from}
                max={surah.ayahs}
                value={to}
                onChange={(e) => setTo(Math.max(from, Math.min(surah.ayahs, Number(e.target.value))))}
                className="h-10 w-full rounded-xl border border-white/10 bg-black/[0.03] px-3 text-sm text-ink-50"
              />
            </div>
            <p className="text-[11px] text-ink-500 mt-1">{t("trainer.ayahsAvailable", { n: surah.ayahs })}</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">{t("trainer.hidingStyle")}</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <ChoiceCard
            active={hideMode === "blur"}
            onClick={() => setHideMode("blur")}
            icon={<Eye className="h-4 w-4" />}
            title={t("trainer.hide.blur")}
            subtitle={t("trainer.hide.blur.sub")}
          />
          <ChoiceCard
            active={hideMode === "dashes"}
            onClick={() => setHideMode("dashes")}
            icon={<EyeOff className="h-4 w-4" />}
            title={t("trainer.hide.dashes")}
            subtitle={t("trainer.hide.dashes.sub")}
          />
          <ChoiceCard
            active={hideMode === "boxes"}
            onClick={() => setHideMode("boxes")}
            icon={<EyeOff className="h-4 w-4" />}
            title={t("trainer.hide.boxes")}
            subtitle={t("trainer.hide.boxes.sub")}
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">{t("trainer.strictness")}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <ChoiceCard
            active={strictness === "lenient"}
            onClick={() => setStrictness("lenient")}
            icon={<Unlock className="h-4 w-4" />}
            title={t("trainer.strictness.lenient")}
            subtitle={t("trainer.strictness.lenient.sub")}
          />
          <ChoiceCard
            active={strictness === "strict"}
            onClick={() => setStrictness("strict")}
            icon={<Lock className="h-4 w-4" />}
            title={t("trainer.strictness.strict")}
            subtitle={t("trainer.strictness.strict.sub")}
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">{t("trainer.hint.title")}</h3>
        <p className="text-sm text-ink-300 mb-3">
          {t("trainer.hint.desc", {
            a: t("trainer.hint.seconds", { n: hintAfter }),
            b: t("trainer.hint.seconds", { n: hintAfter * 2 }),
          })}
        </p>
        <input
          type="range"
          min={3}
          max={15}
          step={1}
          value={hintAfter}
          onChange={(e) => setHintAfter(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-ink-500 mt-1">
          <span>{t("trainer.hint.seconds", { n: 3 })}</span>
          <span>{t("trainer.hint.seconds", { n: 15 })}</span>
        </div>
      </div>

      <div className="sticky bottom-3 z-10">
        <Button
          variant="emerald"
          size="lg"
          className="w-full text-lg shadow-[0_8px_28px_-6px_rgba(16,185,129,0.55)] ring-1 ring-emerald-glow/40"
          onClick={() => onStart({ surahId, fromAyah: from, toAyah: to, hideMode, strictness, hintAfterSeconds: hintAfter })}
        >
          <Mic className="h-5 w-5" /> {t("action.startReciting")}
        </Button>
      </div>
    </div>
  );
}

function ChoiceCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-start p-4 rounded-xl border transition-all",
        active
          ? "border-emerald-glow/40 bg-emerald-glow/10 shadow-[0_0_0_1px_rgba(16, 185, 129,0.25)]"
          : "border-black/[0.08] hover:border-black/[0.15] bg-black/[0.02]"
      )}
    >
      <div className={cn("flex items-center gap-2 mb-1", active ? "text-emerald-glow" : "text-ink-300")}>
        {icon}
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-xs text-ink-400">{subtitle}</p>
    </button>
  );
}
