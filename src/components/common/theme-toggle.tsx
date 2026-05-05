"use client";
import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { usePreferences } from "@/lib/store/preferences";
import { useT } from "@/lib/i18n/use-locale";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = usePreferences((s) => s.theme);
  const setTheme = usePreferences((s) => s.setTheme);
  const t = useT();

  // Re-sync the html class on mount in case rehydration set state
  // after the bootstrap script ran.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? t("theme.toLight") : t("theme.toDark")}
      title={isDark ? t("theme.light") : t("theme.dark")}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs",
        "bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.06]",
        "text-ink-300 hover:text-ink-50 transition-colors",
        className
      )}
    >
      {isDark ? <Sun className="h-3.5 w-3.5 text-gold-400" /> : <Moon className="h-3.5 w-3.5 text-ink-400" />}
      <span>{isDark ? t("theme.light") : t("theme.dark")}</span>
    </button>
  );
}
