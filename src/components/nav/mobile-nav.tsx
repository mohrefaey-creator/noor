"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Headphones, GraduationCap, Mic, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/mushaf", label: "Read", icon: BookOpen },
  { href: "/listen", label: "Listen", icon: Headphones },
  { href: "/hifz/trainer", label: "Train", icon: Mic, accent: true },
  { href: "/qiraat", label: "Qirā'āt", icon: GraduationCap },
  { href: "/search", label: "Search", icon: Search },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3">
      <div className="glass-strong rounded-2xl flex items-center justify-around py-2 shadow-2xl">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all",
                active ? "text-gold-400" : "text-ink-300"
              )}
            >
              {item.accent ? (
                <div className="relative">
                  <Icon className={cn("h-5 w-5", active ? "text-gold-400" : "text-emerald-glow")} />
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-glow animate-pulse" />
                </div>
              ) : (
                <Icon className="h-5 w-5" />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
