"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, Repeat } from "lucide-react";
import { SURAHS } from "@/data/surahs";
import { RECITERS, DEFAULT_RECITER_ID } from "@/data/reciters";
import { everyAyahUrl } from "@/lib/api/quran";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { usePreferences } from "@/lib/store/preferences";
import { formatDuration } from "@/lib/utils";
import { useT } from "@/lib/i18n/use-locale";

export default function ListenPage() {
  const t = useT();
  const { reciterId, setReciter } = usePreferences();
  const [surahId, setSurahId] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [autoNext, setAutoNext] = useState(true);
  const [q, setQ] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS.find((r) => r.id === DEFAULT_RECITER_ID)!;
  const surah = SURAHS.find((s) => s.id === surahId)!;

  const filtered = useMemo(() => {
    if (!q.trim()) return SURAHS;
    const term = q.toLowerCase();
    return SURAHS.filter(
      (s) => s.transliteration.toLowerCase().includes(term) || s.english.toLowerCase().includes(term)
    );
  }, [q]);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    a.src = everyAyahUrl(reciter.folder, surahId, ayah);
    a.volume = volume;
    if (playing) a.play().catch(() => setPlaying(false));
    const onTime = () => setTime(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onEnd = () => {
      if (autoNext) {
        if (ayah < surah.ayahs) setAyah((v) => v + 1);
        else if (surahId < 114) {
          setSurahId((v) => v + 1);
          setAyah(1);
        } else setPlaying(false);
      } else setPlaying(false);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [reciter, surahId, ayah, autoNext, surah.ayahs, playing, volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

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
    if (ayah < surah.ayahs) setAyah((v) => v + 1);
    else if (surahId < 114) {
      setSurahId((v) => v + 1);
      setAyah(1);
    }
  };
  const prev = () => {
    if (ayah > 1) setAyah((v) => v - 1);
    else if (surahId > 1) {
      const p = SURAHS.find((s) => s.id === surahId - 1)!;
      setSurahId(p.id);
      setAyah(p.ayahs);
    }
  };

  return (
    <div>
      <PageHeader
        title={t("listen.title")}
        arabicTitle={t("listen.arabicTitle")}
        description={t("listen.description")}
      />

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
        {/* Player panel */}
        <div className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-24 -end-24 h-64 w-64 rounded-full bg-emerald-glow/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-2 rounded-full bg-emerald-glow animate-pulse" />
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-glow/80">
                {t("listen.nowPlaying")}
              </p>
            </div>

            <p
              dir="rtl"
              lang="ar"
              className="font-arabic gold-text text-balance break-words text-4xl sm:text-5xl md:text-6xl py-2 px-1"
              style={{ lineHeight: 1.55 }}
            >
              {surah.name}
            </p>
            <h2 className="font-display text-2xl mt-3 text-ink-50">
              {surah.transliteration}{" "}
              <span className="text-ink-400 text-base">· {t("listen.ayah", { n: ayah })}</span>
            </h2>
            <p className="text-ink-400 text-sm mt-1">
              {reciter.name} · {reciter.style}
            </p>

            <div className="mt-8 flex items-end justify-center gap-1.5 h-16">
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-gold-600 to-gold-400"
                  animate={{
                    scaleY: playing ? [0.3, 0.8 + Math.sin(i) * 0.4 + 0.2, 0.3] : 0.3,
                  }}
                  transition={{
                    duration: 0.9 + (i % 5) * 0.12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.05,
                  }}
                  style={{ height: "100%", originY: 1 }}
                />
              ))}
            </div>

            <div className="mt-6">
              <Slider
                value={time}
                min={0}
                max={duration || 1}
                step={0.01}
                onChange={(v) => audioRef.current && (audioRef.current.currentTime = v)}
                ariaLabel={t("listen.progressAria")}
              />
              <div className="flex justify-between text-[11px] text-ink-400 mt-1.5 tabular-nums">
                <span dir="ltr">{formatDuration(time)}</span>
                <span dir="ltr">{formatDuration(duration)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={prev}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full text-ink-200 hover:bg-black/[0.06]"
                aria-label={t("action.previous")}
              >
                <SkipBack className="h-5 w-5 rtl:rotate-180" />
              </button>
              <button
                onClick={toggle}
                className="h-14 w-14 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-gold-400 to-gold-600 text-ink-950 shadow-[0_4px_24px_-4px_rgba(234, 88, 12,0.5)]"
                aria-label={playing ? t("action.pause") : t("action.play")}
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ms-0.5" />}
              </button>
              <button
                onClick={next}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full text-ink-200 hover:bg-black/[0.06]"
                aria-label={t("action.next")}
              >
                <SkipForward className="h-5 w-5 rtl:rotate-180" />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Volume2 className="h-4 w-4 text-ink-400" />
                <Slider
                  value={volume * 100}
                  min={0}
                  max={100}
                  onChange={(v) => setVolume(v / 100)}
                  ariaLabel={t("listen.volumeAria")}
                />
              </div>
              <button
                onClick={() => setAutoNext((v) => !v)}
                className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border transition-colors ${
                  autoNext ? "bg-emerald-glow/15 border-emerald-glow/30 text-emerald-glow" : "border-white/10 text-ink-300"
                }`}
              >
                <Repeat className="h-3.5 w-3.5" /> {t("listen.autoNext")}
              </button>
            </div>
          </div>
        </div>

        {/* Selectors */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">
              {t("listen.reciter")}
            </h3>
            <Select
              value={reciterId}
              onChange={setReciter}
              options={RECITERS.map((r) => ({ value: r.id, label: `${r.name} (${r.style})` }))}
              className="w-full"
              ariaLabel={t("listen.reciterAria")}
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {RECITERS.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReciter(r.id)}
                  className={`px-3 py-2 rounded-xl border text-start text-xs transition-colors ${
                    r.id === reciterId
                      ? "border-gold-400/40 bg-gold-400/10 text-ink-50"
                      : "border-white/10 hover:bg-black/[0.04] text-ink-300"
                  }`}
                >
                  <p className="font-medium">{r.name.split(" ")[0]}</p>
                  <p className="text-ink-500 text-[10px] mt-0.5">{r.style}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">
              {t("listen.pickSurah")}
            </h3>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("listen.filterPlaceholder")}
              className="mb-3"
            />
            <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-1 pe-1">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSurahId(s.id);
                    setAyah(1);
                  }}
                  className={`w-full text-start px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                    s.id === surahId ? "bg-gold-400/10 text-ink-50" : "hover:bg-black/[0.04] text-ink-300"
                  }`}
                >
                  <span className="text-xs text-ink-500 w-6">{s.id}</span>
                  <span className="flex-1 truncate text-sm">{s.transliteration}</span>
                  <span dir="rtl" lang="ar" className="font-arabic text-base text-gold-400/80">
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Link
            href={`/surah/${surahId}#ayah-${ayah}`}
            className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-black/[0.06] transition-colors"
          >
            <span className="text-sm text-ink-300">{t("listen.openInReading")}</span>
            <span className="text-gold-400 text-sm rtl:rotate-180">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
