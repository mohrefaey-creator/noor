"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type Toast = { id: number; message: string; tone: "info" | "success" | "error" };

let pushFn: ((t: Omit<Toast, "id">) => void) | null = null;

export function toast(message: string, tone: Toast["tone"] = "info") {
  pushFn?.({ message, tone });
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    pushFn = (t) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { ...t, id }]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 3500);
    };
    return () => {
      pushFn = null;
    };
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-24 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {items.map((t) => {
          const Icon = t.tone === "success" ? CheckCircle2 : t.tone === "error" ? AlertCircle : Info;
          const tint =
            t.tone === "success" ? "text-emerald-glow" : t.tone === "error" ? "text-red-400" : "text-gold-400";
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              className="pointer-events-auto glass-strong rounded-xl px-4 py-3 flex items-start gap-3 shadow-2xl"
            >
              <Icon className={`h-5 w-5 mt-0.5 ${tint}`} />
              <p className="text-sm text-ink-100">{t.message}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
