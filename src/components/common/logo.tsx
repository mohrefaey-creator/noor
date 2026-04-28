"use client";
import Link from "next/link";
import { Moon, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const SIZE = {
  sm: { moon: "h-7 w-7", star: "h-3 w-3", title: "text-2xl", gap: "gap-2.5" },
  md: { moon: "h-10 w-10", star: "h-4 w-4", title: "text-3xl", gap: "gap-3" },
  lg: { moon: "h-14 w-14", star: "h-5 w-5", title: "text-5xl md:text-6xl", gap: "gap-4" },
} satisfies Record<LogoSize, Record<string, string>>;

export function Logo({
  size = "sm",
  href = "/",
  className,
}: {
  size?: LogoSize;
  href?: string | null;
  className?: string;
}) {
  const s = SIZE[size];
  const inner = (
    <span className={cn("group inline-flex items-center", s.gap, className)}>
      <span className="relative">
        <Moon className={cn(s.moon, "text-gold-500 transition-transform group-hover:rotate-12")} />
        <Star className={cn(s.star, "absolute -top-1 -right-1 text-gold-400 animate-pulse-slow")} />
      </span>
      <span className={cn("font-display font-medium tracking-tight gold-text leading-none", s.title)}>
        Noor
      </span>
    </span>
  );
  return href ? (
    <Link href={href} className="inline-flex items-center" aria-label="Noor home">
      {inner}
    </Link>
  ) : (
    inner
  );
}
