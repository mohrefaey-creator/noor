"use client";
import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LOCALE, getDir, type Locale, translate } from "./dict";

interface LocaleState {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (l) => {
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("lang", l);
          document.documentElement.setAttribute("dir", getDir(l));
        }
        set({ locale: l });
      },
      toggleLocale: () => get().setLocale(get().locale === "ar" ? "en" : "ar"),
    }),
    {
      name: "noor-locale",
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          document.documentElement.setAttribute("lang", state.locale);
          document.documentElement.setAttribute("dir", getDir(state.locale));
        }
      },
    }
  )
);

export function useLocale(): Locale {
  return useLocaleStore((s) => s.locale);
}

export function useT() {
  const locale = useLocaleStore((s) => s.locale);
  return (key: string, params?: Record<string, string | number>) =>
    translate(locale, key, params);
}

export function useDir(): "rtl" | "ltr" {
  return getDir(useLocaleStore((s) => s.locale));
}

// Mounted in <body> to keep <html lang/dir> in sync if the user navigates between
// locales after first paint. The bootstrap script in <head> handles first paint.
export function LocaleSync() {
  const locale = useLocaleStore((s) => s.locale);
  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", getDir(locale));
  }, [locale]);
  return null;
}
