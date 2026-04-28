"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: React.ReactNode }[];
  className?: string;
}

export function Tabs({ value, onChange, options, className }: TabsProps) {
  return (
    <div
      className={cn(
        // Horizontal scroll on mobile so long tab sets don't push the layout sideways
        "max-w-full overflow-x-auto scrollbar-thin -mx-1 px-1",
        className
      )}
    >
      <div className="inline-flex p-1 rounded-xl glass gap-1 whitespace-nowrap">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "relative px-3 sm:px-4 py-1.5 text-sm rounded-lg transition-all flex-shrink-0",
                active ? "text-ink-950 font-medium" : "text-ink-300 hover:text-ink-50"
              )}
            >
              {active && (
                <span className="absolute inset-0 rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 -z-0" />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
