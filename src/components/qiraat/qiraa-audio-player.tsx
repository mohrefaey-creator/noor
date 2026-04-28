"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Play, Pause, X, SkipForward, SkipBack, Volume2, BadgeInfo } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import {
  getRecitersForRiwayah,
  getQiraaAyahUrl,
  getQiraaSurahUrl,
  type QiraaReciter,
} from "@/data/qiraat-audio";
import { type RiwayahId, getRiwayah } from "@/data/qiraat/metadata";
import type { PageAyah } from "@/lib/api/quran";
import { formatDuration, pad } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface QiraaAudioPlayerProps {
  open: boolean;
  riwayah: RiwayahId;
  ayahs: PageAyah[];
  onClose: () => void;
}

export function QiraaAudioPlayer({ open, riwayah, ayahs, onClose }: QiraaAudioPlayerProps) {
  const reciters = useMemo(() => getRecitersForRiwayah(riwayah), [riwayah]);
  const meta = getRiwayah(riwayah);
  const [reciterId, setReciterId] = useState(reciters[0]?.id ?? "");
  const reciter = reciters.find((r) => r.id === reciterId) ?? reciters[0];

  const [ayahIdx, setAyahIdx] = useState(0); // index into the current page's ayahs (only used for ayah-level audio)
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);
  const [vol, setVol] = useState(0.85);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Surahs on the current page (groups in display order)
  const surahsOnPage = useMemo(
    () => Array.from(new Set(ayahs.map((a) => a.surah.number))),
    [ayahs]
  );
  const [currentSurah, setCurrentSurah] = useState<number>(surahsOnPage[0] ?? 1);

  useEffect(() => {
    if (surahsOnPage.length > 0) {
      setCurrentSurah(surahsOnPage[0]);
      setAyahIdx(0);
    }
  }, [surahsOnPage.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset when reciter or page changes
  useEffect(() => {
    if (reciters.length > 0 && !reciters.find((r) => r.id === reciterId)) {
      setReciterId(reciters[0].id);
    }
  }, [reciters, reciterId]);

  // Resolve the URL for the current source
  const currentUrl = useMemo(() => {
    if (!reciter) return null;
    if (reciter.ayahLevel) {
      const a = ayahs[ayahIdx];
      if (!a) return null;
      return getQiraaAyahUrl(reciter, a.surah.number, a.numberInSurah);
    }
    return getQiraaSurahUrl(reciter, currentSurah);
  }, [reciter, ayahIdx, ayahs, currentSurah]);

  // Wire up the <audio> element on URL changes
  useEffect(() => {
    if (!open) return;
    if (!currentUrl) return;
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    a.src = currentUrl;
    a.volume = vol;
    setError(null);
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    const onTime = () => setT(a.currentTime);
    const onMeta = () => setD(a.duration || 0);
    const onEnd = () => {
      // For ayah-level reciters, advance through page ayahs automatically
      if (reciter?.ayahLevel && ayahIdx + 1 < ayahs.length) {
        setAyahIdx((i) => i + 1);
      } else {
        setPlaying(false);
      }
    };
    const onErr = () => {
      setError("Audio could not load. The CDN may be slow or this Riwāyah may not have this surah recorded.");
      setPlaying(false);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    a.addEventListener("error", onErr);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("error", onErr);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl, open]);

  // Adjust volume live
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = vol;
  }, [vol]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    []
  );

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

  const next = () => {
    if (!reciter) return;
    if (reciter.ayahLevel) {
      if (ayahIdx + 1 < ayahs.length) setAyahIdx((i) => i + 1);
    } else {
      // surah-level: jump to next surah on this page if any
      const nextIdx = surahsOnPage.indexOf(currentSurah) + 1;
      if (nextIdx < surahsOnPage.length) setCurrentSurah(surahsOnPage[nextIdx]);
    }
  };
  const prev = () => {
    if (!reciter) return;
    if (reciter.ayahLevel) {
      if (ayahIdx > 0) setAyahIdx((i) => i - 1);
    } else {
      const prevIdx = surahsOnPage.indexOf(currentSurah) - 1;
      if (prevIdx >= 0) setCurrentSurah(surahsOnPage[prevIdx]);
    }
  };

  if (!meta) return null;

  const currentAyah = reciter?.ayahLevel ? ayahs[ayahIdx] : undefined;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 240 }}
          className="fixed left-1/2 -translate-x-1/2 z-40 w-[min(640px,calc(100vw-1rem))] bottom-24 lg:bottom-6"
        >
          <div className="glass-strong rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.05]">
              <div className="h-9 w-9 rounded-xl bg-red-400/15 border border-red-400/30 flex items-center justify-center flex-shrink-0">
                <Headphones className="h-4 w-4 text-red-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-red-300/80">
                  Listening · {meta.name}
                </p>
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-base text-ink-100 leading-tight"
                  style={{ lineHeight: 1.4 }}
                >
                  {meta.arabicName}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-300 hover:bg-black/[0.06]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-3 space-y-3">
              {reciters.length === 0 ? (
                <p className="text-sm text-ink-300 py-4 text-center">
                  No public recording is yet available for this Qirā’ah. Coming soon.
                </p>
              ) : (
                <>
                  {/* Reciter selection */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ink-400 mb-1.5 block">
                      Reciter
                    </label>
                    <Select
                      value={reciterId}
                      onChange={setReciterId}
                      options={reciters.map((r) => ({
                        value: r.id,
                        label: `${r.name}${r.notable ? " — " + r.notable : ""}`,
                      }))}
                      className="w-full"
                      ariaLabel="Reciter"
                    />
                  </div>

                  {/* Now-playing strip */}
                  <div className="flex items-center justify-between text-xs gap-2">
                    {reciter?.ayahLevel ? (
                      <span className="text-ink-300">
                        Ayah on this page{" "}
                        <span className="text-gold-400 font-medium">
                          {currentAyah?.surah.number}:{currentAyah?.numberInSurah}
                        </span>{" "}
                        <span className="text-ink-500">({ayahIdx + 1} / {ayahs.length})</span>
                      </span>
                    ) : (
                      <span className="text-ink-300">
                        Surah <span className="text-gold-400 font-medium">{currentSurah}</span>{" "}
                        <span className="text-ink-500">(plays from start of surah)</span>
                      </span>
                    )}
                    <span className="text-ink-400 tabular-nums">
                      {formatDuration(t)} / {formatDuration(d)}
                    </span>
                  </div>

                  <Slider
                    value={t}
                    min={0}
                    max={d || 1}
                    step={0.01}
                    onChange={(v) => audioRef.current && (audioRef.current.currentTime = v)}
                    ariaLabel="Audio progress"
                  />

                  {/* Transport */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={prev}
                      className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-ink-200 hover:bg-black/[0.06]"
                      aria-label="Previous"
                    >
                      <SkipBack className="h-4 w-4" />
                    </button>
                    <button
                      onClick={toggle}
                      className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-gold-400 to-gold-600 text-ink-950 shadow-[0_4px_20px_-4px_rgba(234, 88, 12,0.5)]"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </button>
                    <button
                      onClick={next}
                      className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-ink-200 hover:bg-black/[0.06]"
                      aria-label="Next"
                    >
                      <SkipForward className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2 ml-2 flex-1 max-w-[140px]">
                      <Volume2 className="h-3.5 w-3.5 text-ink-400 flex-shrink-0" />
                      <Slider
                        value={vol * 100}
                        min={0}
                        max={100}
                        onChange={(v) => setVol(v / 100)}
                        ariaLabel="Volume"
                      />
                    </div>
                  </div>

                  {/* Notable / hint */}
                  {reciter?.notable && (
                    <p className="text-[11px] text-ink-400 flex items-start gap-1.5 leading-relaxed">
                      <BadgeInfo className="h-3 w-3 text-gold-400 mt-0.5 flex-shrink-0" />
                      {reciter.notable}
                    </p>
                  )}

                  {error && <p className="text-xs text-amber-300">{error}</p>}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ESLint helper: 'pad' is referenced in the data layer; keep the import alive here if tree-shaken
void pad;
void cn;
