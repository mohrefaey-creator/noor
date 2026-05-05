"use client";
import { Globe } from "lucide-react";
import { useLocaleStore } from "@/lib/i18n/use-locale";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
  variant?: "compact" | "pill";
}

export function LanguageToggle({ className, variant = "compact" }: LanguageToggleProps) {
  const locale = useLocaleStore((s) => s.locale);
  const toggle = useLocaleStore((s) => s.toggleLocale);

  // The label is intentionally the *target* language (what you'll switch to).
  const targetLabel = locale === "ar" ? "English" : "العربية";
  const targetLang = locale === "ar" ? "en" : "ar";
  const ariaLabel = locale === "ar" ? "Switch to English" : "التبديل إلى العربية";

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium",
          "bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30",
          "text-gold-300 hover:text-gold-200 transition-colors",
          className
        )}
      >
        <Globe className="h-4 w-4" />
        <span lang={targetLang}>{targetLabel}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs",
        "bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.06]",
        "text-ink-300 hover:text-ink-50 transition-colors",
        className
      )}
    >
      <Globe className="h-3.5 w-3.5 text-gold-400" />
      <span lang={targetLang}>{targetLabel}</span>
    </button>
  );
}
