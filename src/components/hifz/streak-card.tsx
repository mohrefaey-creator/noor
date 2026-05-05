"use client";
import { Flame, Trophy } from "lucide-react";
import { useHifz } from "@/lib/store/hifz-store";
import { useT } from "@/lib/i18n/use-locale";

export function StreakCard() {
  const t = useT();
  const streak = useHifz((s) => s.streak);
  const goalMinutes = useHifz((s) => s.goalMinutes);
  const todaySeconds = useHifz((s) => s.todaySeconds);
  const todayPct = Math.min(100, Math.round((todaySeconds / 60 / goalMinutes) * 100));

  return (
    <div className="glass-strong rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute -top-16 -end-16 h-44 w-44 rounded-full bg-orange-400/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-orange-300/80">{t("hifz.streak.label")}</p>
            <p className="font-display text-5xl mt-1 text-ink-50">
              {streak.current}
              <span className="text-ink-400 text-2xl ms-2">
                {streak.current === 1 ? t("home.unit.day") : t("home.unit.days")}
              </span>
            </p>
            <p className="text-ink-400 text-sm mt-1 flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-gold-400" /> {t("hifz.streak.best", { n: streak.longest })}
            </p>
          </div>
          <Flame className="h-10 w-10 text-orange-300" />
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-ink-400 mb-2">
            <span>{t("hifz.streak.todayGoal")}</span>
            <span className="text-ink-200 tabular-nums">
              {t("hifz.streak.todayProgress", { m: Math.floor(todaySeconds / 60), goal: goalMinutes })}
            </span>
          </div>
          <div className="h-2 rounded-full bg-black/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-300 rounded-full transition-all"
              style={{ width: `${todayPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
