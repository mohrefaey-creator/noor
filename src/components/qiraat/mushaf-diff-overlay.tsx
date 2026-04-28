"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square } from "lucide-react";
import { COORDS_REFERENCE_WIDTH, type PageDiffOverlay } from "@/data/qiraat/word-coords";
import { cn } from "@/lib/utils";
import {
  getRecitersForRiwayah,
  getQiraaAyahUrl,
  getHafsAyahUrl,
  type QiraaReciter,
} from "@/data/qiraat-audio";
import type { RiwayahId } from "@/data/qiraat/metadata";
import { getReciter } from "@/data/reciters";
import { usePreferences } from "@/lib/store/preferences";

// Audio-only differences (same letters/rasm, different sound). Vowel marks
// included — the printed word looks the same, just sounds different.
const AUDIBLE_TYPES = new Set(["madd", "hamz", "imalah", "naql", "idgham", "izhar", "harakah"]);

interface MushafDiffOverlayProps {
  imgRef: React.RefObject<HTMLImageElement | null>;
  overlays: PageDiffOverlay[];
  riwayahName: string;
  riwayah: RiwayahId;
  ready: boolean;
}

export function MushafDiffOverlay({ imgRef, overlays, riwayahName, riwayah, ready }: MushafDiffOverlayProps) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Audio for the â–¶ Hafs / â–¶ Variant comparison buttons
  const reciterId = usePreferences((s) => s.reciterId);
  const hafsReciter = getReciter(reciterId);
  const variantAyahReciter: QiraaReciter | undefined = (() => {
    const list = getRecitersForRiwayah(riwayah);
    return list.find((r) => r.ayahLevel) ?? list[0];
  })();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null); // key like `${i}:hafs` or `${i}:variant`

  const playClip = (key: string, url: string | null) => {
    if (!url) return;
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    if (playing === key && !a.paused) {
      a.pause();
      setPlaying(null);
      return;
    }
    a.src = url;
    a.play()
      .then(() => setPlaying(key))
      .catch(() => setPlaying(null));
    a.onended = () => setPlaying(null);
  };

  // Stop audio when popover closes
  useEffect(() => {
    if (openIndex === null) {
      audioRef.current?.pause();
      setPlaying(null);
    }
  }, [openIndex]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el || !ready) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ w: rect.width, h: rect.height });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [imgRef, ready, overlays.length]);

  if (!ready || !size || overlays.length === 0) return null;

  // The DB coordinates are at COORDS_REFERENCE_WIDTH (1024). Scale uniformly to whatever width
  // the image is currently rendered at â€” the page's aspect ratio is preserved automatically.
  const scale = size.w / COORDS_REFERENCE_WIDTH;
  const padding = 4; // a little breathing room around each highlight

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ width: size.w, height: size.h }}
    >
      {overlays.map((o, i) => {
        const x = (o.coord.x - padding) * scale;
        const y = (o.coord.y - padding) * scale;
        const w = (o.coord.w + padding * 2) * scale;
        const h = (o.coord.h + padding * 2) * scale;
        const isOpen = openIndex === i;
        const audible = AUDIBLE_TYPES.has(o.type);
        const ringCls = audible ? "ring-emerald-500/85 hover:ring-emerald-400" : "ring-red-500/85 hover:ring-red-400";
        const bgCls = audible ? "bg-emerald-500/30 hover:bg-emerald-500/45" : "bg-red-500/30 hover:bg-red-500/45";
        const shadowOpen = audible
          ? "0 0 0 3px rgba(16, 185, 129, 0.85), 0 12px 30px -6px rgba(16, 185, 129, 0.7), inset 0 0 0 1px rgba(255,255,255,0.2)"
          : "0 0 0 3px rgba(220, 38, 38, 0.85), 0 12px 30px -6px rgba(220, 38, 38, 0.7), inset 0 0 0 1px rgba(255,255,255,0.2)";
        const shadowIdle = audible
          ? "0 0 0 1px rgba(16, 185, 129, 0.6), 0 0 18px -2px rgba(16, 185, 129, 0.6), inset 0 0 0 1px rgba(255,255,255,0.15)"
          : "0 0 0 1px rgba(220, 38, 38, 0.6), 0 0 18px -2px rgba(220, 38, 38, 0.6), inset 0 0 0 1px rgba(255,255,255,0.15)";
        return (
          <div
            key={`${o.surah}-${o.ayah}-${o.wordIndex}-${i}`}
            className="absolute pointer-events-auto"
            style={{ left: x, top: y, width: w, height: h }}
          >
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex(isOpen ? null : i);
              }}
              animate={
                isOpen
                  ? { scale: 1, opacity: 1 }
                  : { scale: [1, 1.04, 1], opacity: [0.95, 1, 0.95] }
              }
              transition={
                isOpen
                  ? { duration: 0.2 }
                  : { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }
              }
              className={cn(
                "block w-full h-full rounded-md transition-colors cursor-pointer",
                "ring-[3px] mix-blend-multiply",
                ringCls,
                bgCls
              )}
              style={{ boxShadow: isOpen ? shadowOpen : shadowIdle }}
              aria-label={`Variant in ${o.surah}:${o.ayah} â€” Hafs '${o.hafs}' vs ${riwayahName} '${o.variant}'`}
              title={`${o.hafs}  â†’  ${o.variant}`}
            />

            <AnimatePresence>
              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-ink-950/40 sm:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenIndex(null);
                    }}
                    style={{ pointerEvents: "auto" }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      // Mobile: pinned bottom sheet, full-width minus margin
                      "fixed left-4 right-4 bottom-28 z-50 mx-auto max-w-md",
                      // Desktop: anchored popover beneath the highlight
                      "sm:absolute sm:left-1/2 sm:right-auto sm:top-full sm:bottom-auto sm:mt-2 sm:-translate-x-1/2 sm:min-w-[260px] sm:max-w-xs",
                      "rounded-2xl glass-strong p-4 shadow-2xl text-left"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-ink-500">
                        {o.type}
                      </span>
                      <span className="text-[10px] text-gold-400">{riwayahName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-lg bg-black/[0.04] p-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-ink-500">Hafs</p>
                        <p dir="rtl" lang="ar" className="font-arabic text-xl mt-1 text-ink-100">
                          {o.hafs}
                        </p>
                      </div>
                      <div className={cn("rounded-lg p-2.5 border", audible ? "bg-emerald-glow/10 border-emerald-glow/25" : "bg-red-400/10 border-red-400/25")}>
                        <p className={cn("text-[10px] uppercase tracking-wider", audible ? "text-emerald-glow" : "text-red-500")}>{audible ? "Audio" : "Variant"}</p>
                        <p dir="rtl" lang="ar" className={cn("font-arabic text-xl mt-1", audible ? "text-emerald-glow" : "text-red-500")}>
                          {o.variant}
                        </p>
                      </div>
                    </div>
                    {o.note && (
                      <div className="mt-3 space-y-1">
                        <p
                          dir="rtl"
                          lang="ar"
                          className="text-sm text-ink-200 leading-relaxed font-arabic"
                        >
                          {o.note.ar}
                        </p>
                        <p className="text-xs text-ink-400 leading-relaxed">{o.note.en}</p>
                      </div>
                    )}

                    {/* Compare audio: Hafs vs Variant for this exact ayah */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <PlayCompareButton
                        label="Hafs"
                        sublabel={hafsReciter?.name.split(" ")[0]}
                        playing={playing === `${i}:hafs`}
                        disabled={!hafsReciter}
                        tone="ink"
                        onClick={() =>
                          playClip(
                            `${i}:hafs`,
                            hafsReciter ? getHafsAyahUrl(hafsReciter.folder, o.surah, o.ayah) : null
                          )
                        }
                      />
                      <PlayCompareButton
                        label={riwayahName.split(" ")[0]}
                        sublabel={variantAyahReciter?.name.split(" ")[0]}
                        playing={playing === `${i}:variant`}
                        disabled={!variantAyahReciter || !variantAyahReciter.ayahLevel}
                        disabledHint={
                          !variantAyahReciter
                            ? "No audio yet"
                            : !variantAyahReciter.ayahLevel
                            ? "Use main Listen player"
                            : undefined
                        }
                        tone="red"
                        onClick={() =>
                          playClip(
                            `${i}:variant`,
                            variantAyahReciter
                              ? getQiraaAyahUrl(variantAyahReciter, o.surah, o.ayah)
                              : null
                          )
                        }
                      />
                    </div>

                    <p className="text-[10px] text-ink-500 mt-2.5">
                      Surah {o.surah} Â· Ayah {o.ayah}
                    </p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

interface PlayCompareButtonProps {
  label: string;
  sublabel?: string;
  playing: boolean;
  disabled?: boolean;
  disabledHint?: string;
  tone: "ink" | "red";
  onClick: () => void;
}

function PlayCompareButton({
  label,
  sublabel,
  playing,
  disabled,
  disabledHint,
  tone,
  onClick,
}: PlayCompareButtonProps) {
  const baseColor =
    tone === "red"
      ? "bg-red-400/[0.10] border-red-400/30 text-red-200 hover:bg-red-400/[0.18]"
      : "bg-black/[0.05] border-white/15 text-ink-100 hover:bg-black/[0.10]";
  const playingColor =
    tone === "red"
      ? "bg-red-400/30 border-red-400/55 text-red-100"
      : "bg-emerald-glow/20 border-emerald-glow/45 text-emerald-glow";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={disabled ? disabledHint : `Play in ${label}`}
      className={cn(
        "h-12 px-3 rounded-xl border text-left transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        playing ? playingColor : baseColor
      )}
    >
      <span className="h-7 w-7 rounded-full bg-black/25 flex items-center justify-center flex-shrink-0">
        {playing ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium leading-none">{label}</span>
        <span className="block text-[10px] text-ink-400 leading-tight truncate mt-0.5">
          {disabled && disabledHint ? disabledHint : sublabel ?? ""}
        </span>
      </span>
    </button>
  );
}
