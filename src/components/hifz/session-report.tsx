"use client";
import Link from "next/link";
import { CheckCircle2, AlertCircle, SkipForward, Eye, RotateCcw, BookOpen } from "lucide-react";
import type { HifzSession } from "@/lib/store/hifz-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { getSurah } from "@/data/surahs";

interface SessionReportProps {
  session: HifzSession;
  onRestart: () => void;
  onClose: () => void;
}

export function SessionReport({ session, onRestart, onClose }: SessionReportProps) {
  const total = session.results.length;
  const correct = session.results.filter((r) => r.status === "correct-first-try").length;
  const hinted = session.results.filter((r) => r.status === "correct-after-hint").length;
  const skipped = session.results.filter((r) => r.status === "skipped").length;
  const revealed = session.results.filter((r) => r.status === "revealed").length;
  const accuracy = total === 0 ? 0 : Math.round(((correct + hinted * 0.5) / total) * 100);

  const surah = getSurah(session.range.surah);

  // Per-ayah accuracy
  const perAyah = new Map<number, { correct: number; total: number }>();
  for (const r of session.results) {
    const cur = perAyah.get(r.ayah) ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (r.status === "correct-first-try" || r.status === "correct-after-hint") cur.correct += 1;
    perAyah.set(r.ayah, cur);
  }
  const struggle = Array.from(perAyah.entries())
    .map(([ayah, x]) => ({ ayah, pct: (x.correct / x.total) * 100 }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3)
    .filter((x) => x.pct < 100);

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-emerald-glow/15 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-glow/80 mb-2">Session Complete</p>
          <p className="font-display text-7xl text-ink-50 tabular-nums">{accuracy}%</p>
          <p className="text-ink-400 mt-1">accuracy on {surah?.transliteration} {session.range.fromAyah}–{session.range.toAyah}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            <Stat label="First try" value={correct} icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-glow" />} />
            <Stat label="After hint" value={hinted} icon={<AlertCircle className="h-3.5 w-3.5 text-gold-400" />} />
            <Stat label="Skipped" value={skipped} icon={<SkipForward className="h-3.5 w-3.5 text-ink-400" />} />
            <Stat label="Revealed" value={revealed} icon={<Eye className="h-3.5 w-3.5 text-ink-400" />} />
          </div>
        </div>
      </div>

      {struggle.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-ink-50 mb-3">Suggested next session</h3>
          <p className="text-sm text-ink-300 mb-4">Replay the {struggle.length} ayāt where you struggled most:</p>
          <div className="flex flex-wrap gap-2">
            {struggle.map((s) => (
              <span
                key={s.ayah}
                className="px-3 py-1.5 rounded-full bg-orange-400/10 border border-orange-400/30 text-orange-200 text-sm"
              >
                Ayah {s.ayah} · {Math.round(s.pct)}%
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="emerald" size="lg" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" /> Train again
        </Button>
        <Link href={`/surah/${session.range.surah}`} className={buttonVariants({ variant: "glass", size: "lg" })}>
          <BookOpen className="h-4 w-4" /> Open in reading view
        </Link>
        <Button variant="ghost" size="lg" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-black/[0.04] border border-black/[0.06] p-3">
      <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-400">
        {icon} {label}
      </div>
      <p className="mt-1 font-display text-2xl text-ink-50 tabular-nums">{value}</p>
    </div>
  );
}
