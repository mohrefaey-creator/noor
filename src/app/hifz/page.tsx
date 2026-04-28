"use client";
import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Mic, Sparkles, BookmarkCheck, Calendar, Target, Plus, Minus } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StreakCard } from "@/components/hifz/streak-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useHifz } from "@/lib/store/hifz-store";
import { usePreferences } from "@/lib/store/preferences";
import { SURAHS, getSurah } from "@/data/surahs";
import { Slider } from "@/components/ui/slider";

export default function HifzDashboard() {
  const memorized = useHifz((s) => s.memorized);
  const sessions = useHifz((s) => s.sessions);
  const goalMinutes = useHifz((s) => s.goalMinutes);
  const setGoal = useHifz((s) => s.setGoal);
  const bookmarks = usePreferences((s) => s.bookmarks);

  const memorizedPerSurah = useMemo(() => {
    const acc = new Map<number, number>();
    Object.keys(memorized).forEach((k) => {
      const [s] = k.split(":").map(Number);
      acc.set(s, (acc.get(s) ?? 0) + 1);
    });
    return acc;
  }, [memorized]);

  const totalAyahsMem = Object.keys(memorized).length;
  const TOTAL_AYAHS = 6236;
  const overallPct = (totalAyahsMem / TOTAL_AYAHS) * 100;

  const inProgress = useMemo(() => {
    return Array.from(memorizedPerSurah.entries())
      .map(([id, count]) => ({ surah: getSurah(id)!, count }))
      .filter((x) => x.surah && x.count < x.surah.ayahs)
      .sort((a, b) => b.count / b.surah.ayahs - a.count / a.surah.ayahs)
      .slice(0, 6);
  }, [memorizedPerSurah]);

  const completed = useMemo(() => {
    return Array.from(memorizedPerSurah.entries())
      .map(([id, count]) => ({ surah: getSurah(id)!, count }))
      .filter((x) => x.surah && x.count >= x.surah.ayahs);
  }, [memorizedPerSurah]);

  return (
    <div>
      <PageHeader
        title="Hifz"
        arabicTitle="حفظ"
        description="Track what you've memorized, review what slips, and start a voice training session."
        right={
          <Link href="/hifz/trainer" className={buttonVariants({ variant: "emerald", size: "lg" })}>
            <Mic className="h-4 w-4" /> Start Training
          </Link>
        }
      />

      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <StreakCard />
        <div className="glass-strong rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-emerald-glow/15 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-emerald-glow/80">Memorized</p>
            <p className="font-display text-5xl mt-1 text-ink-50">{totalAyahsMem}</p>
            <p className="text-ink-400 text-sm mt-1">of {TOTAL_AYAHS} ayāt · {overallPct.toFixed(2)}%</p>
            <div className="mt-6 h-2 rounded-full bg-black/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(overallPct, 0.5)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-glow to-emerald rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="glass-strong rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-gold-400/80">Daily Goal</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="font-display text-5xl text-ink-50">{goalMinutes}</p>
              <span className="text-ink-400 mt-3">min</span>
              <div className="ml-auto flex flex-col gap-1.5">
                <button
                  className="h-7 w-7 rounded-lg bg-black/[0.05] hover:bg-black/[0.1] flex items-center justify-center"
                  onClick={() => setGoal(goalMinutes + 5)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button
                  className="h-7 w-7 rounded-lg bg-black/[0.05] hover:bg-black/[0.1] flex items-center justify-center"
                  onClick={() => setGoal(goalMinutes - 5)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-6">
              <Slider value={goalMinutes} min={5} max={60} step={5} onChange={setGoal} ariaLabel="Goal minutes" />
            </div>
          </div>
        </div>
      </section>

      {/* In progress */}
      <section className="mb-10">
        <h2 className="font-display text-xl text-ink-50 mb-4 flex items-center gap-2">
          <Target className="h-4 w-4 text-gold-400" /> In progress
        </h2>
        {inProgress.length === 0 ? (
          <EmptyTip />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inProgress.map(({ surah, count }) => {
              const pct = Math.round((count / surah.ayahs) * 100);
              return (
                <Link
                  key={surah.id}
                  href={`/hifz/trainer?surah=${surah.id}&from=1&to=${surah.ayahs}`}
                  className="glass rounded-2xl p-5 hover:bg-black/[0.06] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-lg text-ink-50">{surah.transliteration}</p>
                      <p className="text-xs text-ink-400">{count}/{surah.ayahs} memorized</p>
                    </div>
                    <span dir="rtl" lang="ar" className="font-arabic text-2xl gold-text">{surah.name}</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-glow to-emerald rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-[11px] text-emerald-glow flex items-center gap-1">
                    <Mic className="h-3 w-3" /> Train this
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Completed */}
      {completed.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-xl text-ink-50 mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-400" /> Completed surahs
          </h2>
          <div className="flex flex-wrap gap-2">
            {completed.map(({ surah }) => (
              <Link
                key={surah.id}
                href={`/surah/${surah.id}`}
                className="px-3 py-1.5 rounded-full bg-emerald-glow/10 border border-emerald-glow/25 text-xs text-emerald-glow hover:bg-emerald-glow/15 transition-colors"
              >
                {surah.transliteration}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg text-ink-50 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold-400" /> Recent sessions
          </h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-ink-400">No sessions yet. Try the voice trainer.</p>
          ) : (
            <ul className="space-y-2">
              {sessions.slice(0, 5).map((s) => {
                const surah = getSurah(s.range.surah);
                const correct = s.results.filter((r) => r.status === "correct-first-try").length;
                const total = s.results.length;
                return (
                  <li key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/[0.03]">
                    <div className="h-8 w-8 rounded-lg bg-gold-400/10 flex items-center justify-center text-gold-400 text-xs">
                      {surah?.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink-100 truncate">
                        {surah?.transliteration} · {s.range.fromAyah}–{s.range.toAyah}
                      </p>
                      <p className="text-[11px] text-ink-400">
                        {new Date(s.startedAt).toLocaleString()} · {correct}/{total} clean
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg text-ink-50 mb-3 flex items-center gap-2">
            <BookmarkCheck className="h-4 w-4 text-gold-400" /> Bookmarks
          </h3>
          {bookmarks.length === 0 ? (
            <p className="text-sm text-ink-400">No bookmarks yet.</p>
          ) : (
            <ul className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin">
              {bookmarks
                .slice()
                .sort((a, b) => b.addedAt - a.addedAt)
                .map((b) => {
                  const surah = getSurah(b.surah);
                  return (
                    <li key={`${b.surah}-${b.ayah}`}>
                      <Link
                        href={`/surah/${b.surah}#ayah-${b.ayah}`}
                        className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-black/[0.04] text-sm"
                      >
                        <span className="text-ink-200">{surah?.transliteration} {b.ayah}</span>
                        <span className="text-[10px] text-ink-500">{new Date(b.addedAt).toLocaleDateString()}</span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </section>

      {/* Surah grid */}
      <section className="mt-10">
        <h2 className="font-display text-xl text-ink-50 mb-4">All surahs</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {SURAHS.map((s) => {
            const c = memorizedPerSurah.get(s.id) ?? 0;
            const pct = c === 0 ? 0 : c >= s.ayahs ? 100 : Math.round((c / s.ayahs) * 100);
            const tone =
              pct === 0 ? "bg-black/[0.03] text-ink-400" : pct === 100 ? "bg-emerald-glow/15 text-emerald-glow border-emerald-glow/30" : "bg-gold-400/10 text-gold-400 border-gold-400/25";
            return (
              <Link
                key={s.id}
                href={`/surah/${s.id}`}
                className={`relative rounded-lg border border-transparent ${tone} aspect-square flex flex-col items-center justify-center text-xs hover:scale-105 transition-transform`}
                title={`${s.transliteration} · ${pct}%`}
              >
                <span className="text-[11px] font-medium">{s.id}</span>
                {pct > 0 && pct < 100 && <span className="text-[9px]">{pct}%</span>}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );

  function EmptyTip() {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <Sparkles className="h-8 w-8 text-gold-400 mx-auto mb-3" />
        <p className="text-ink-200">No surahs in progress yet.</p>
        <p className="text-sm text-ink-400 mt-1">Tap the circle next to any ayah to mark it memorized, or jump straight into the trainer.</p>
        <Link href="/hifz/trainer" className={buttonVariants({ variant: "emerald", size: "sm" }) + " mt-4"}>
          <Mic className="h-3.5 w-3.5" /> Open Trainer
        </Link>
      </div>
    );
  }
}
