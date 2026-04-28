"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RiwayahId } from "@/data/qiraat/metadata";
import type { TafsirEdition } from "@/lib/api/tafsir";
import type { Edition } from "@/lib/api/quran";
import { DEFAULT_RECITER_ID, getReciter } from "@/data/reciters";

export type Theme = "light" | "dark";
export type MushafView = "scanned" | "written";

interface PrefState {
  riwayah: RiwayahId;
  translation: Edition;
  tafsir: TafsirEdition;
  reciterId: string;
  fontSizeArabic: number;
  showTranslation: boolean;
  focusMode: boolean;
  theme: Theme;
  mushafView: MushafView;
  lastRead?: { surah: number; ayah: number; ts: number };
  bookmarks: { surah: number; ayah: number; addedAt: number }[];
  setRiwayah: (r: RiwayahId) => void;
  setTranslation: (e: Edition) => void;
  setTafsir: (t: TafsirEdition) => void;
  setReciter: (id: string) => void;
  setFontSize: (n: number) => void;
  setShowTranslation: (v: boolean) => void;
  setFocusMode: (v: boolean) => void;
  setTheme: (t: Theme) => void;
  setMushafView: (v: MushafView) => void;
  setLastRead: (surah: number, ayah: number) => void;
  toggleBookmark: (surah: number, ayah: number) => void;
}

export const usePreferences = create<PrefState>()(
  persist(
    (set, get) => ({
      riwayah: "hafs",
      translation: "en.sahih",
      tafsir: "ar-tafsir-muyassar",
      reciterId: DEFAULT_RECITER_ID,
      fontSizeArabic: 32,
      showTranslation: true,
      focusMode: false,
      theme: "dark",
      mushafView: "scanned",
      bookmarks: [],
      setRiwayah: (r) => set({ riwayah: r }),
      setTranslation: (e) => set({ translation: e }),
      setTafsir: (t) => set({ tafsir: t }),
      setReciter: (id) => set({ reciterId: id }),
      setFontSize: (n) => set({ fontSizeArabic: Math.max(20, Math.min(56, n)) }),
      setShowTranslation: (v) => set({ showTranslation: v }),
      setFocusMode: (v) => set({ focusMode: v }),
      setTheme: (t) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", t === "dark");
        }
        set({ theme: t });
      },
      setMushafView: (v) => set({ mushafView: v }),
      setLastRead: (surah, ayah) => set({ lastRead: { surah, ayah, ts: Date.now() } }),
      toggleBookmark: (surah, ayah) => {
        const list = get().bookmarks;
        const exists = list.find((b) => b.surah === surah && b.ayah === ayah);
        if (exists) {
          set({ bookmarks: list.filter((b) => !(b.surah === surah && b.ayah === ayah)) });
        } else {
          set({ bookmarks: [...list, { surah, ayah, addedAt: Date.now() }] });
        }
      },
    }),
    {
      name: "noor-prefs",
      onRehydrateStorage: () => (state) => {
        if (state && !getReciter(state.reciterId)) {
          state.reciterId = DEFAULT_RECITER_ID;
        }
        if (state && typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", state.theme === "dark");
        }
      },
    }
  )
);
