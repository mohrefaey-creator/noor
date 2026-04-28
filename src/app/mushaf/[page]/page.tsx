"use client";
// recompile-marker
import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Info, BookOpen, Headphones } from "lucide-react";
import { MushafPage } from "@/components/quran/mushaf-page";
import { TafsirDrawer } from "@/components/quran/tafsir-drawer";
import { InlineAudio } from "@/components/quran/inline-audio";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QiraatPicker } from "@/components/qiraat/qiraat-picker";
import { QiraaAudioPlayer } from "@/components/qiraat/qiraa-audio-player";
import { SURAHS } from "@/data/surahs";
import { usePreferences } from "@/lib/store/preferences";
import { fetchPage, type PageAyah } from "@/lib/api/quran";
import { getRiwayah } from "@/data/qiraat/metadata";
import { getRecitersForRiwayah } from "@/data/qiraat-audio";

interface PageProps {
  params: Promise<{ page: string }>;
}

const TOTAL_PAGES = 604;

export default function MushafRoute({ params }: PageProps) {
  const { page: pageStr } = use(params);
  const pageNumber = Number(pageStr);
  if (!Number.isFinite(pageNumber) || pageNumber < 1 || pageNumber > TOTAL_PAGES) notFound();

  const router = useRouter();
  const [audioAyah, setAudioAyah] = useState<{ surah: number; ayah: number; total: number } | null>(null);
  const [tafsirAyah, setTafsirAyah] = useState<{ surah: number; ayah: number } | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [qiraaPlayerOpen, setQiraaPlayerOpen] = useState(false);
  const [pageAyahs, setPageAyahs] = useState<PageAyah[]>([]);

  const reciterId = usePreferences((s) => s.reciterId);
  const tafsir = usePreferences((s) => s.tafsir);
  const riwayah = usePreferences((s) => s.riwayah);
  const setRiwayah = usePreferences((s) => s.setRiwayah);

  const riwayahMeta = riwayah !== "hafs" ? getRiwayah(riwayah) : null;
  const recitersForRiwayah = useMemo(
    () => (riwayah !== "hafs" ? getRecitersForRiwayah(riwayah) : []),
    [riwayah]
  );

  // Mirror MushafPage's fetch so the player has the ayah list (cached in lib/api/quran)
  useEffect(() => {
    let cancel = false;
    fetchPage(pageNumber, "quran-uthmani")
      .then((data) => !cancel && setPageAyahs(data))
      .catch(() => !cancel && setPageAyahs([]));
    return () => {
      cancel = true;
    };
  }, [pageNumber]);

  // When user picks a non-Hafs Riwāyah that has recitations available, auto-open the
  // page-level audio player so the current mushaf page starts playing in that reading.
  // Switching back to Hafs closes it.
  useEffect(() => {
    if (riwayah === "hafs") {
      setQiraaPlayerOpen(false);
      return;
    }
    if (recitersForRiwayah.length > 0) {
      setQiraaPlayerOpen(true);
    } else {
      setQiraaPlayerOpen(false);
    }
  }, [riwayah, recitersForRiwayah.length]);

  const goPage = (n: number) => {
    if (n < 1 || n > TOTAL_PAGES) return;
    setDirection(n > pageNumber ? 1 : -1);
    router.push(`/mushaf/${n}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowLeft") goPage(pageNumber + 1); // RTL: left = next
      else if (e.key === "ArrowRight") goPage(pageNumber - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-ink-400 mb-3">
        <Link href="/" className="hover:text-ink-200 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-ink-200">Mushaf · Page {pageNumber}</span>
      </nav>

      {/* Top bar — split into two rows on mobile so each control gets a comfortable target */}
      <header className="mb-4 space-y-2.5">
        {/* Row 1 — primary navigation: prev / page-of-total / next, full width on mobile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goPage(pageNumber - 1)}
            disabled={pageNumber <= 1}
            className="h-11 w-11 flex-shrink-0 inline-flex items-center justify-center rounded-xl glass hover:bg-black/[0.07] disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex-1 flex items-center justify-center gap-2 glass rounded-xl px-3 h-11 text-sm">
            <span className="text-ink-400 hidden sm:inline">Page</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={TOTAL_PAGES}
              value={pageNumber}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (n >= 1 && n <= TOTAL_PAGES) goPage(n);
              }}
              className="w-14 bg-transparent text-ink-50 text-center focus:outline-none tabular-nums text-base"
            />
            <span className="text-ink-400">/ {TOTAL_PAGES}</span>
          </div>

          <button
            onClick={() => goPage(pageNumber + 1)}
            disabled={pageNumber >= TOTAL_PAGES}
            className="h-11 w-11 flex-shrink-0 inline-flex items-center justify-center rounded-xl glass hover:bg-black/[0.07] disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Row 2 — secondary controls: jump-to-surah, qira'at, info */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value=""
            onChange={(v) => {
              const surah = SURAHS.find((s) => s.id === Number(v));
              if (surah) goPage(surah.page);
            }}
            options={[
              { value: "", label: "Jump to surah…" },
              ...SURAHS.map((s) => ({ value: String(s.id), label: `${s.id}. ${s.transliteration}` })),
            ]}
            ariaLabel="Jump to surah"
            className="flex-1 min-w-[140px]"
          />
          <QiraatPicker value={riwayah} onChange={setRiwayah} />
          {riwayah !== "hafs" && (
            <Button
              variant={recitersForRiwayah.length > 0 ? "emerald" : "glass"}
              size="sm"
              onClick={() => setQiraaPlayerOpen((v) => !v)}
              aria-label={`Listen in ${riwayahMeta?.name ?? "this Qira'ah"}`}
              disabled={recitersForRiwayah.length === 0}
              title={
                recitersForRiwayah.length === 0
                  ? "No public recording available for this Qirā'ah yet"
                  : `Listen in ${riwayahMeta?.name}`
              }
            >
              <Headphones className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {recitersForRiwayah.length === 0 ? "No audio" : "Listen in this Qirā’ah"}
              </span>
              <span className="sm:hidden">Listen</span>
            </Button>
          )}
          <Button
            variant="glass"
            size="sm"
            onClick={() => setShowControls((v) => !v)}
            aria-label="About this view"
          >
            <Info className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{showControls ? "Hide" : "About"}</span>
          </Button>
        </div>
      </header>

      {showControls && (
        <div className="glass rounded-2xl p-4 mb-5 text-sm text-ink-300">
          <p>Pages are the official scanned <span className="text-gold-400">Mushaf al-Madinah</span> from the King Fahd Quran Printing Complex. Tap the page to zoom; tap an ayah chip below to play, memorize, bookmark, or open tafsir.</p>
        </div>
      )}

      {/* The mushaf page itself */}
      <div className="relative overflow-hidden">
        <div key={pageNumber} className="animate-fade-in">
            <MushafPage
              page={pageNumber}
              playingAyah={audioAyah ? { surah: audioAyah.surah, ayah: audioAyah.ayah } : null}
              onAyahPlay={(surah, ayah) => {
                const meta = SURAHS.find((s) => s.id === surah);
                setAudioAyah({ surah, ayah, total: meta?.ayahs ?? 7 });
              }}
              onTafsir={(surah, ayah) => setTafsirAyah({ surah, ayah })}
            />
        </div>
      </div>

      {/* Bottom paging */}
      <footer className="mt-8 flex items-center justify-between gap-3">
        <button
          onClick={() => goPage(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-black/[0.07] transition-colors text-sm disabled:opacity-30"
        >
          <ArrowRight className="h-4 w-4" /> Previous
        </button>
        <Link href="/" className="text-sm text-ink-400 hover:text-ink-200">
          <BookOpen className="inline h-3.5 w-3.5 mr-1" /> All Surahs
        </Link>
        <button
          onClick={() => goPage(pageNumber + 1)}
          disabled={pageNumber >= TOTAL_PAGES}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-black/[0.07] transition-colors text-sm disabled:opacity-30"
        >
          Next <ArrowLeft className="h-4 w-4" />
        </button>
      </footer>

      {/* Tafsir + audio */}
      {tafsirAyah && (
        <TafsirDrawer
          open
          surah={tafsirAyah.surah}
          ayah={tafsirAyah.ayah}
          initialEdition={tafsir}
          onClose={() => setTafsirAyah(null)}
        />
      )}
      {audioAyah && (
        <InlineAudio
          surah={audioAyah.surah}
          ayah={audioAyah.ayah}
          totalAyahs={audioAyah.total}
          reciterId={reciterId}
          onAyahChange={(a) => setAudioAyah((prev) => (prev ? { ...prev, ayah: a } : null))}
          onClose={() => setAudioAyah(null)}
        />
      )}

      <QiraaAudioPlayer
        open={qiraaPlayerOpen}
        riwayah={riwayah}
        ayahs={pageAyahs}
        onClose={() => setQiraaPlayerOpen(false)}
      />
    </div>
  );
}
