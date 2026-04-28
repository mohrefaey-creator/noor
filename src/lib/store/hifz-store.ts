"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { todayKey } from "@/lib/utils";

export interface SessionWordResult {
  surah: number;
  ayah: number;
  word: string;
  wordIndex: number;
  status: "correct-first-try" | "correct-after-hint" | "skipped" | "revealed";
  msToRecite?: number;
}

export interface HifzSession {
  id: string;
  startedAt: number;
  endedAt?: number;
  range: { surah: number; fromAyah: number; toAyah: number };
  hideMode: "blur" | "dashes" | "boxes";
  strictness: "lenient" | "strict";
  results: SessionWordResult[];
}

interface HifzState {
  memorized: Record<string, true>; // key = `${surah}:${ayah}`
  sessions: HifzSession[];
  streak: { current: number; longest: number; lastDate?: string };
  todaySeconds: number;
  todayDate: string;
  goalMinutes: number;
  markMemorized: (surah: number, ayah: number) => void;
  unmarkMemorized: (surah: number, ayah: number) => void;
  isMemorized: (surah: number, ayah: number) => boolean;
  addSession: (s: HifzSession) => void;
  bumpToday: (seconds: number) => void;
  setGoal: (m: number) => void;
}

export const useHifz = create<HifzState>()(
  persist(
    (set, get) => ({
      memorized: {},
      sessions: [],
      streak: { current: 0, longest: 0 },
      todaySeconds: 0,
      todayDate: todayKey(),
      goalMinutes: 10,
      markMemorized: (surah, ayah) => {
        const key = `${surah}:${ayah}`;
        set({ memorized: { ...get().memorized, [key]: true } });
      },
      unmarkMemorized: (surah, ayah) => {
        const key = `${surah}:${ayah}`;
        const next = { ...get().memorized };
        delete next[key];
        set({ memorized: next });
      },
      isMemorized: (surah, ayah) => !!get().memorized[`${surah}:${ayah}`],
      addSession: (s) => {
        const today = todayKey();
        const state = get();
        const lastDate = state.streak.lastDate;
        let current = state.streak.current;
        if (lastDate !== today) {
          if (lastDate) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            current = lastDate === yesterday ? current + 1 : 1;
          } else {
            current = 1;
          }
        } else if (current === 0) {
          current = 1;
        }
        const longest = Math.max(state.streak.longest, current);
        set({
          sessions: [s, ...state.sessions].slice(0, 50),
          streak: { current, longest, lastDate: today },
        });
      },
      bumpToday: (seconds) => {
        const today = todayKey();
        const s = get();
        if (s.todayDate !== today) {
          set({ todayDate: today, todaySeconds: seconds });
        } else {
          set({ todaySeconds: s.todaySeconds + seconds });
        }
      },
      setGoal: (m) => set({ goalMinutes: Math.max(1, Math.min(120, m)) }),
    }),
    { name: "noor-hifz" }
  )
);
