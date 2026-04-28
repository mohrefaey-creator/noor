"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-gold-400 to-gold-600 text-ink-950 hover:brightness-110 shadow-[0_4px_20px_-4px_rgba(234, 88, 12,0.45)]",
        emerald:
          "bg-gradient-to-b from-emerald-glow to-emerald text-white hover:brightness-110 shadow-[0_4px_20px_-4px_rgba(16, 185, 129,0.45)]",
        glass: "glass hover:bg-black/[0.08] text-ink-100",
        ghost: "hover:bg-black/[0.06] text-ink-200 hover:text-ink-50",
        outline: "border border-white/10 hover:bg-black/[0.04] text-ink-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";

export { buttonVariants };
