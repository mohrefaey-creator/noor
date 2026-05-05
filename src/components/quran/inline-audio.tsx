"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, SkipBack, SkipForward } from "lucide-react";
import { everyAyahUrl } from "@/lib/api/quran";
import { getReciter } from "@/data/reciters";
import { formatDuration } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useT } from "@/lib/i18n/use-locale";

interface InlineAudioProps {
  surah: number;
  ayah: number | null;
  totalAyahs: number;
  reciterId: string;
  onAyahChange: (ayah: number) => void;
  onClose: () => void;
}

export function InlineAudio({ surah, ayah, totalAyahs, reciterId, onAyahChange, onClose }: InlineAudioProps) {
  const t = useT();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const reciter = getReciter(reciterId);

  useEffect(() => {
    if (!ayah || !reciter) return;
    const url = everyAyahUrl(reciter.folder, surah, ayah);
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    a.src = url;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    const onTime = () => setTime(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onEnd = () => {
      if (ayah < totalAyahs) onAyahChange(ayah + 1);
      else setPlaying(false);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [ayah, surah, reciter, totalAyahs, onAyahChange]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <AnimatePresence>
      {ayah !== null && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[min(560px,calc(100vw-2rem))]"
        >
          <div className="glass-strong rounded-2xl px-4 py-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => ayah > 1 && onAyahChange(ayah - 1)}
                disabled={ayah <= 1}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-300 hover:bg-black/[0.06] disabled:opacity-30"
                aria-label={t("action.previous")}
              >
                <SkipBack className="h-4 w-4 rtl:rotate-180" />
              </button>
              <button
                onClick={toggle}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-gold-400 to-gold-600 text-ink-950"
                aria-label={playing ? t("action.pause") : t("action.play")}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ms-0.5" />}
              </button>
              <button
                onClick={() => ayah < totalAyahs && onAyahChange(ayah + 1)}
                disabled={ayah >= totalAyahs}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-300 hover:bg-black/[0.06] disabled:opacity-30"
                aria-label={t("action.next")}
              >
                <SkipForward className="h-4 w-4 rtl:rotate-180" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-ink-300">
                  <span className="text-gold-400 font-medium">{surah}:{ayah}</span>
                  <span className="truncate">{reciter?.name}</span>
                  <span className="ms-auto tabular-nums" dir="ltr">
                    {formatDuration(time)} / {formatDuration(duration)}
                  </span>
                </div>
                <div className="mt-1.5">
                  <Slider
                    value={time}
                    min={0}
                    max={duration || 1}
                    step={0.01}
                    onChange={(v) => {
                      if (audioRef.current) audioRef.current.currentTime = v;
                    }}
                    ariaLabel={t("listen.progressAria")}
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  audioRef.current?.pause();
                  onClose();
                }}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-300 hover:bg-black/[0.06]"
                aria-label={t("action.close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
