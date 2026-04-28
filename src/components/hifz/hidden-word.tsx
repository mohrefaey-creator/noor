"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HiddenWordProps {
  text: string;
  hideMode: "blur" | "dashes" | "boxes";
  status: "hidden" | "current" | "revealed" | "hinted";
}

export const HiddenWord = memo(function HiddenWord({ text, hideMode, status }: HiddenWordProps) {
  if (status === "revealed") {
    return (
      <motion.span
        initial={{ opacity: 0, filter: "blur(8px)", scale: 0.92 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-ink-50"
      >
        {text}{" "}
      </motion.span>
    );
  }
  if (status === "hinted") {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gold-400/90"
      >
        {text}{" "}
      </motion.span>
    );
  }
  if (status === "current") {
    return (
      <motion.span
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "inline-block",
          hideMode === "blur" && "hidden-blur text-emerald-glow/80",
          hideMode === "dashes" && "hidden-dashes text-emerald-glow",
          hideMode === "boxes" && "hidden-box text-emerald-glow",
        )}
      >
        {hideMode === "boxes" ? boxFor(text) : text}{" "}
      </motion.span>
    );
  }
  return (
    <span
      className={cn(
        "inline-block",
        hideMode === "blur" && "hidden-blur",
        hideMode === "dashes" && "hidden-dashes",
        hideMode === "boxes" && "hidden-box"
      )}
    >
      {hideMode === "boxes" ? boxFor(text) : text}{" "}
    </span>
  );
});

function boxFor(text: string): string {
  return "ـ".repeat(Math.max(2, text.length));
}
