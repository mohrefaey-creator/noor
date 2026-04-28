"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export function Select({ value, onChange, options, placeholder, className, ariaLabel }: SelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full h-11 pl-4 pr-10 rounded-xl border border-white/10 bg-black/[0.04] text-sm text-ink-50 hover:bg-black/[0.07] cursor-pointer focus:outline-none focus:border-gold-400/40"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled} className="bg-ink-900 text-ink-50">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
    </div>
  );
}
