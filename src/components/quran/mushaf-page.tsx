"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Circle, BookOpen, Bookmark, BookmarkCheck, Play, X, ZoomIn } from "lucide-react";
import { fetchPage, type PageAyah, toArabicDigits } from "@/lib/api/quran";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreferences } from "@/lib/store/preferences";
import { useHifz } from "@/lib/store/hifz-store";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { PageDiffPanel } from "@/components/qiraat/page-diff-panel";
import { MushafDiffOverlay } from "@/components/qiraat/mushaf-diff-overlay";
import { getPageOverlays } from "@/data/qiraat/word-coords";
import { getRiwayah } from "@/data/qiraat/metadata";

interface MushafPageProps {
  page: number;
  onAyahPlay?: (surah: number, ayah: number) => void;
  onTafsir?: (surah: number, ayah: number) => void;
  playingAyah?: { surah: number; ayah: number } | null;
}

const CDN_BASE = "https://files.quran.app/hafs/madani";
const WIDTHS = [320, 480, 800, 1024, 1280, 1920] as const;

function pageImageUrl(page: number, width: (typeof WIDTHS)[number]) {
  const padded = String(page).padStart(3, "0");
  return `${CDN_BASE}/width_${width}/page${padded}.png`;
}

function buildSrcSet(page: number) {
  return WIDTHS.map((w) => `${pageImageUrl(page, w)} ${w}w`).join(", ");
}

export function MushafPage({ page, onAyahPlay, onTafsir, playingAyah }: MushafPageProps) {
  const [ayahs, setAyahs] = useState<PageAyah[] | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const setLastRead = usePreferences((s) => s.setLastRead);
  const bookmarks = usePreferences((s) => s.bookmarks);
  const toggleBookmark = usePreferences((s) => s.toggleBookmark);
  const riwayah = usePreferences((s) => s.riwayah);
  const { isMemorized, markMemorized, unmarkMemorized } = useHifz();

  // Fetch the metadata for this page (ayah list) so we can show action chips beneath the image.
  useEffect(() => {
    let cancel = false;
    setAyahs(null);
    setImgLoaded(false);
    setImgError(false);
    setZoom(false);
    fetchPage(page, "quran-uthmani")
      .then((data) => {
        if (cancel) return;
        setAyahs(data);
        if (data.length > 0) setLastRead(data[0].surah.number, data[0].numberInSurah);
      })
      .catch(() => {
        /* ignore — image is the source of truth */
      });
    return () => {
      cancel = true;
    };
  }, [page, setLastRead]);

  // Group ayahs by surah for the action strip
  const groups = useMemo(() => {
    if (!ayahs) return [];
    const out: { surahNumber: number; surahNameArabic: string; surahNameEnglish: string; items: PageAyah[] }[] = [];
    for (const a of ayahs) {
      const last = out[out.length - 1];
      if (last && last.surahNumber === a.surah.number) {
        last.items.push(a);
      } else {
        out.push({
          surahNumber: a.surah.number,
          surahNameArabic: a.surah.name,
          surahNameEnglish: a.surah.englishName,
          items: [a],
        });
      }
    }
    return out;
  }, [ayahs]);

  const imgSrc1024 = pageImageUrl(page, 1024);
  const imgSrc1920 = pageImageUrl(page, 1920);

  // Compute Qira'at overlays for this page when a non-Hafs riwāyah is active
  const overlays = useMemo(() => {
    if (!ayahs || riwayah === "hafs") return [];
    const surahsOnPage = Array.from(new Set(ayahs.map((a) => a.surah.number)));
    return getPageOverlays(riwayah, page, surahsOnPage);
  }, [ayahs, riwayah, page]);
  const riwayahMeta = riwayah !== "hafs" ? getRiwayah(riwayah) : null;

  return (
    <article className="space-y-5">
      {/* Qira'at diff panel — only when a non-Hafs riwāyah is active */}
      {ayahs && riwayah !== "hafs" && <PageDiffPanel riwayah={riwayah} ayahs={ayahs} />}

      {/* The scanned mushaf page itself */}
      <div className="relative">
        <div
          className="group relative block w-full mx-auto max-w-3xl rounded-3xl overflow-hidden mushaf-image-frame"
        >
          {!imgLoaded && !imgError && (
            <div className="aspect-[3/4.5] w-full">
              <Skeleton className="absolute inset-0" />
            </div>
          )}
          {!imgError && (
            // Using a plain <img> with srcSet to let the browser pick the right resolution.
            // next/image's domain config + sizing would require explicit width/height per page.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={imgSrc1024}
              srcSet={buildSrcSet(page)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
              alt={`Mushaf Madinah · Page ${page}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={cn(
                "block w-full h-auto select-none transition-opacity duration-500",
                imgLoaded ? "opacity-100" : "opacity-0"
              )}
              draggable={false}
            />
          )}
          {/* Qira'at diff overlay — faint red highlights on the page itself */}
          {imgLoaded && overlays.length > 0 && riwayahMeta && (
            <MushafDiffOverlay
              imgRef={imgRef}
              overlays={overlays}
              riwayahName={riwayahMeta.name}
              riwayah={riwayah}
              ready={imgLoaded}
            />
          )}
          {imgError && (
            <div className="aspect-[3/4.5] w-full flex flex-col items-center justify-center text-center text-ink-300 p-8 bg-black/[0.02]">
              <p>Could not load page image.</p>
              <p className="text-xs text-ink-500 mt-1">CDN may be unreachable. Try refreshing.</p>
            </div>
          )}
          {/* Riwāyah count badge */}
          {imgLoaded && overlays.length > 0 && (
            <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-400/15 border border-red-400/35 backdrop-blur text-[10px] uppercase tracking-wider text-red-200">
              {overlays.length} variant{overlays.length === 1 ? "" : "s"}
            </span>
          )}
          {/* Page number badge bottom-center */}
          {imgLoaded && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-ink-950/55 backdrop-blur text-[11px] text-gold-400 font-arabic">
              {toArabicDigits(page)}
            </span>
          )}
          {/* Zoom button — separate from container so overlay clicks aren't intercepted */}
          {imgLoaded && (
            <button
              onClick={() => setZoom(true)}
              aria-label="Zoom"
              className="absolute top-3 left-3 z-30 h-9 w-9 inline-flex items-center justify-center rounded-xl bg-ink-950/60 backdrop-blur text-ink-100 hover:bg-ink-950/80 transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Ayah action strip — clickable chips per ayah on this page */}
      {groups.length > 0 && (
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.surahNumber} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-gold-400/80">
                  {g.surahNameEnglish} <span className="text-ink-500 ml-1.5">·  Surah {g.surahNumber}</span>
                </p>
                <p dir="rtl" lang="ar" className="font-arabic text-lg gold-text">
                  {g.surahNameArabic}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((a) => {
                  const isPlaying =
                    playingAyah && playingAyah.surah === a.surah.number && playingAyah.ayah === a.numberInSurah;
                  const memorized = isMemorized(a.surah.number, a.numberInSurah);
                  const bookmarked = !!bookmarks.find(
                    (b) => b.surah === a.surah.number && b.ayah === a.numberInSurah
                  );
                  return (
                    <AyahChip
                      key={`${a.surah.number}-${a.numberInSurah}`}
                      ayahNumber={a.numberInSurah}
                      isPlaying={!!isPlaying}
                      memorized={memorized}
                      bookmarked={bookmarked}
                      onPlay={() => onAyahPlay?.(a.surah.number, a.numberInSurah)}
                      onMemorize={() => {
                        if (memorized) {
                          unmarkMemorized(a.surah.number, a.numberInSurah);
                          toast(`Unmarked ${a.surah.number}:${a.numberInSurah}`, "info");
                        } else {
                          markMemorized(a.surah.number, a.numberInSurah);
                          toast(`Memorized ${a.surah.number}:${a.numberInSurah} ✓`, "success");
                        }
                      }}
                      onBookmark={() => toggleBookmark(a.surah.number, a.numberInSurah)}
                      onTafsir={() => onTafsir?.(a.surah.number, a.numberInSurah)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zoom overlay */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-50 bg-ink-950/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out overflow-auto animate-fade-in"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoom(false);
            }}
            className="absolute top-4 right-4 h-10 w-10 inline-flex items-center justify-center rounded-xl glass-strong"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative max-w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc1920}
              alt={`Mushaf Madinah · Page ${page} (zoomed)`}
              className="max-h-[92vh] w-auto rounded-xl shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>
      )}
    </article>
  );
}

interface AyahChipProps {
  ayahNumber: number;
  isPlaying: boolean;
  memorized: boolean;
  bookmarked: boolean;
  onPlay: () => void;
  onMemorize: () => void;
  onBookmark: () => void;
  onTafsir: () => void;
}

function AyahChip({ ayahNumber, isPlaying, memorized, bookmarked, onPlay, onMemorize, onBookmark, onTafsir }: AyahChipProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm transition-all",
          isPlaying
            ? "bg-emerald-glow/15 border-emerald-glow/40 text-emerald-glow"
            : memorized
            ? "bg-emerald-glow/8 border-emerald-glow/25 text-emerald-glow/90"
            : "bg-black/[0.04] border-white/10 hover:bg-black/[0.08] text-ink-200"
        )}
      >
        <span dir="rtl" lang="ar" className="font-arabic">
          {toArabicDigits(ayahNumber)}
        </span>
        <span className="text-[10px] text-ink-400 hidden sm:inline">آية {ayahNumber}</span>
        {memorized && <CheckCircle2 className="h-3 w-3 text-emerald-glow" />}
        {bookmarked && <BookmarkCheck className="h-3 w-3 text-gold-400" />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-ink-950/30 sm:bg-transparent" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "animate-fade-in",
              // Mobile: pinned bottom sheet above the bottom nav
              "fixed left-4 right-4 bottom-28 z-40 mx-auto max-w-sm",
              // Desktop: anchored beneath the chip
              "sm:absolute sm:left-1/2 sm:right-auto sm:bottom-auto sm:top-full sm:mt-2 sm:-translate-x-1/2 sm:max-w-none"
            )}
          >
              <div className="glass-strong rounded-xl px-1.5 py-1 flex items-center justify-around sm:justify-start gap-1 shadow-2xl sm:whitespace-nowrap">
                <ChipAction
                  icon={<Play className="h-3.5 w-3.5" />}
                  label="Play"
                  onClick={() => {
                    onPlay();
                    setOpen(false);
                  }}
                />
                <ChipAction
                  icon={memorized ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-glow" /> : <Circle className="h-3.5 w-3.5" />}
                  label="Memorize"
                  onClick={() => {
                    onMemorize();
                    setOpen(false);
                  }}
                />
                <ChipAction
                  icon={bookmarked ? <BookmarkCheck className="h-3.5 w-3.5 text-gold-400" /> : <Bookmark className="h-3.5 w-3.5" />}
                  label="Bookmark"
                  onClick={() => {
                    onBookmark();
                    setOpen(false);
                  }}
                />
                <ChipAction
                  icon={<BookOpen className="h-3.5 w-3.5" />}
                  label="Tafsir"
                  onClick={() => {
                    onTafsir();
                    setOpen(false);
                  }}
                />
              </div>
          </div>
        </>
      )}
    </div>
  );
}

function ChipAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="h-8 px-2.5 inline-flex items-center gap-1 rounded-lg text-[11px] text-ink-200 hover:bg-black/[0.06] transition-colors"
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

// Mark Image as referenced for ESLint (not used at runtime — kept for potential next/image migration)
void Image;
