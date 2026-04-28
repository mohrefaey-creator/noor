"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Headphones, Sparkles, Mic, Search, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";

const NAV = [
  { href: "/", label: "Surahs", icon: BookOpen },
  { href: "/mushaf", label: "Mushaf", icon: BookOpen },
  { href: "/listen", label: "Listen", icon: Headphones },
  { href: "/hifz", label: "Hifz", icon: Sparkles },
  { href: "/hifz/trainer", label: "Trainer", icon: Mic, accent: true },
  { href: "/search", label: "Search", icon: Search },
  { href: "/qiraat", label: "Qira'at", icon: GraduationCap },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-black/[0.05] bg-ink-950/60 backdrop-blur-xl z-30">
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
                <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-[3px] rounded-r-full bg-gradient-to-b from-gold-400 to-gold-600" />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  active ? "text-gold-400" : item.accent ? "text-emerald-glow" : "text-ink-400"
                )}
              />
              <span>{item.label}</span>
              {item.accent && (
                <span className="ml-auto text-[9px] uppercase tracking-wider text-emerald-glow/80">live</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 pb-6 pt-4 text-xs text-ink-500 border-t border-black/[0.05] space-y-3">
        <ThemeToggle className="w-full justify-center" />
        <p className="text-balance leading-relaxed">
          Recite, listen, memorize.
          <br />
          <span className="text-ink-400">Built with reverence.</span>
        </p>
      </div>
    </aside>
  );
}
