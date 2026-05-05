"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, BookOpen } from "lucide-react";
import { fetchTafsir, type TafsirEdition, TAFSIR_OPTIONS } from "@/lib/api/tafsir";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { useT } from "@/lib/i18n/use-locale";

interface TafsirDrawerProps {
  open: boolean;
  surah: number;
  ayah: number;
  initialEdition: TafsirEdition;
  onClose: () => void;
}

export function TafsirDrawer({ open, surah, ayah, initialEdition, onClose }: TafsirDrawerProps) {
  const t = useT();
  const [edition, setEdition] = useState<TafsirEdition>(initialEdition);
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setEdition(initialEdition), [initialEdition]);

  useEffect(() => {
    if (!open) return;
    let cancel = false;
    setLoading(true);
    setText(null);
    fetchTafsir(edition, surah, ayah).then((entry) => {
      if (cancel) return;
      setText(entry?.text ?? t("tafsir.unavailable"));
      setLoading(false);
    });
    return () => {
      cancel = true;
    };
  }, [open, edition, surah, ayah]);

  const isAr = edition.startsWith("ar-");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-ink-950 border-l border-black/[0.06] overflow-y-auto scrollbar-thin"
          >
            <header className="sticky top-0 backdrop-blur-xl bg-ink-950/80 border-b border-black/[0.05] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gold-400" />
                <h3 className="font-display text-lg text-ink-50">
                  {t("tafsir.title")} <span className="text-ink-400 text-sm">{surah}:{ayah}</span>
                </h3>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-300 hover:bg-black/[0.06]"
                aria-label={t("action.close")}
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="px-5 pt-4">
              <Tabs
                value={edition}
                onChange={(v) => setEdition(v as TafsirEdition)}
                options={TAFSIR_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
                className="flex-wrap"
              />
            </div>
            <div className="px-5 py-5">
              {loading && (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              )}
              {!loading && text && (
                <p
                  className={isAr ? "font-arabic text-lg leading-loose text-ink-100" : "text-sm leading-relaxed text-ink-200"}
                  dir={isAr ? "rtl" : "ltr"}
                  lang={isAr ? "ar" : "en"}
                >
                  {text}
                </p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
