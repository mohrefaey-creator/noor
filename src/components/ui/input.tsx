import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border border-white/10 bg-black/[0.03] px-4 py-2 text-sm text-ink-50 placeholder:text-ink-400 focus-visible:outline-none focus-visible:border-gold-400/40 focus-visible:ring-2 focus-visible:ring-gold-400/20 transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
