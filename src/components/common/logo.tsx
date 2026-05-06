"use client";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const SIZE = {
  sm: { mark: "h-9 w-9", title: "text-2xl", gap: "gap-2.5" },
  md: { mark: "h-12 w-12", title: "text-3xl", gap: "gap-3" },
  lg: { mark: "h-16 w-16", title: "text-5xl md:text-6xl", gap: "gap-4" },
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
      <span
        className={cn(
          s.mark,
          "relative inline-block overflow-hidden rounded-xl ring-1 ring-gold-400/30 shadow-sm transition-transform group-hover:scale-105"
        )}
      >
        <Image
          src="/logo.png"
          alt="Noor logo"
          fill
          sizes="64px"
          className="object-cover"
          priority={size === "lg"}
        />
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
