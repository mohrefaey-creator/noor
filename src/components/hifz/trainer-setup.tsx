"use client";
import { useState } from "react";
import { Mic, Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { SURAHS } from "@/data/surahs";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-emerald-glow/15 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-ink-400 mb-2 block">Surah</label>
            <Select
              value={String(surahId)}
              onChange={(v) => onSurahChange(Number(v))}
              options={SURAHS.map((s) => ({ value: String(s.id), label: `${s.id}. ${s.transliteration}` }))}
              className="w-full"
              ariaLabel="Surah"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-ink-400 mb-2 block">Ayah range</label>
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
            <p className="text-[11px] text-ink-500 mt-1">{surah.ayahs} ayāt available</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">Hiding style</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <ChoiceCard
            active={hideMode === "blur"}
            onClick={() => setHideMode("blur")}
            icon={<Eye className="h-4 w-4" />}
            title="Blur"
            subtitle="Easier · words visible but heavily blurred"
          />
          <ChoiceCard
            active={hideMode === "dashes"}
            onClick={() => setHideMode("dashes")}
            icon={<EyeOff className="h-4 w-4" />}
            title="Dashes"
            subtitle="Medium · placeholders sized like real words"
          />
          <ChoiceCard
            active={hideMode === "boxes"}
            onClick={() => setHideMode("boxes")}
            icon={<EyeOff className="h-4 w-4" />}
            title="Boxes"
            subtitle="Hardest · pure recall"
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">Strictness</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <ChoiceCard
            active={strictness === "lenient"}
            onClick={() => setStrictness("lenient")}
            icon={<Unlock className="h-4 w-4" />}
            title="Lenient"
            subtitle="Accepts close pronunciations"
          />
          <ChoiceCard
            active={strictness === "strict"}
            onClick={() => setStrictness("strict")}
            icon={<Lock className="h-4 w-4" />}
            title="Strict"
            subtitle="Requires near-exact match"
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">Hint policy</h3>
        <p className="text-sm text-ink-300 mb-3">
          Show first letter after <span className="text-gold-400 font-medium tabular-nums">{hintAfter}s</span> of silence on a word, full hint after <span className="text-gold-400 font-medium">{hintAfter * 2}s</span>.
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
          <span>3s</span>
          <span>15s</span>
        </div>
      </div>

      <div className="sticky bottom-3 z-10">
        <Button
          variant="emerald"
          size="lg"
          className="w-full text-lg shadow-[0_8px_28px_-6px_rgba(16,185,129,0.55)] ring-1 ring-emerald-glow/40"
          onClick={() => onStart({ surahId, fromAyah: from, toAyah: to, hideMode, strictness, hintAfterSeconds: hintAfter })}
        >
          <Mic className="h-5 w-5" /> Start Reciting
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
        "text-left p-4 rounded-xl border transition-all",
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
