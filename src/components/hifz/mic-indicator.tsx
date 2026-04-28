"use client";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MicIndicatorProps {
  active: boolean;
  level: number;
  className?: string;
}

export function MicIndicator({ active, level, className }: MicIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-strong", className)}>
      <div className="relative flex-shrink-0">
        {active ? (
          <>
            <Mic className="h-5 w-5 text-emerald-glow" />
            <motion.span
              className="absolute inset-0 rounded-full bg-emerald-glow/40"
              animate={{ scale: [1, 1.6 + level * 1.2], opacity: [0.4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          </>
        ) : (
          <MicOff className="h-5 w-5 text-ink-400" />
        )}
      </div>
      <div className="flex items-end gap-0.5 h-6 flex-1">
        {Array.from({ length: 22 }).map((_, i) => {
          const center = 11;
          const dist = Math.abs(i - center) / center;
          const targetH = active ? Math.max(0.12, level * (1 - dist * 0.6)) : 0.12;
          return (
            <motion.span
              key={i}
              className={cn(
                "w-1 rounded-full",
                active ? "bg-emerald-glow" : "bg-ink-700"
              )}
              animate={{ scaleY: targetH * (1 + Math.sin(Date.now() / 200 + i) * 0.15) }}
              style={{ height: "100%", originY: 1 }}
              transition={{ duration: 0.1 }}
            />
          );
        })}
      </div>
      <p className="text-xs text-ink-400 hidden sm:block min-w-[64px] text-right">
        {active ? "Listening…" : "Idle"}
      </p>
    </div>
  );
}
