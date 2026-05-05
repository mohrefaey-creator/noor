"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Headphones, Sparkles, Mic, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { LanguageToggle } from "@/components/common/language-toggle";
import { useT } from "@/lib/i18n/use-locale";

const NAV = [
  { href: "/", labelKey: "nav.surahs", icon: BookOpen },
  { href: "/mushaf", labelKey: "nav.mushaf", icon: BookOpen },
  { href: "/listen", labelKey: "nav.listen", icon: Headphones },
  { href: "/hifz", labelKey: "nav.hifz", icon: Sparkles },
  { href: "/hifz/trainer", labelKey: "nav.trainer", icon: Mic, accent: true },
  { href: "/qiraat", labelKey: "nav.qiraat", icon: GraduationCap },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useT();
  return (
    <aside className="hidden lg:flex fixed inset-y-0 start-0 w-64 flex-col border-e border-black/[0.05] bg-ink-950/60 backdrop-blur-xl z-30">
      <div className="px-6 pt-7 pb-5">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all",
                active
                  ? "bg-black/[0.06] text-ink-50"
                  : "text-ink-300 hover:text-ink-50 hover:bg-black/[0.03]"
              )}
            >
              {active && (
                <span className="absolute start-0 top-1/2 h-6 -translate-y-1/2 w-[3px] rounded-e-full bg-gradient-to-b from-gold-400 to-gold-600" />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  active ? "text-gold-400" : item.accent ? "text-emerald-glow" : "text-ink-400"
                )}
              />
              <span>{t(item.labelKey)}</span>
              {item.accent && (
                <span className="ms-auto text-[9px] uppercase tracking-wider text-emerald-glow/80">
                  {t("nav.live")}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 pb-6 pt-4 text-xs text-ink-500 border-t border-black/[0.05] space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <ThemeToggle className="w-full justify-center" />
          <LanguageToggle className="w-full justify-center" />
        </div>
        <p className="text-balance leading-relaxed">
          {t("nav.tagline")}
          <br />
          <span className="text-ink-400">{t("nav.builtWithReverence")}</span>
        </p>
      </div>
    </aside>
  );
}
