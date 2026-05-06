"use client";
// recompile-marker
import { useEffect, useMemo, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Info, Headphones, Image as ImageIcon, Type } from "lucide-react";
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
import { useT } from "@/lib/i18n/use-locale";

interface PageProps {
  params: Promise<{ page: string }>;
}

const TOTAL_PAGES = 604;

export default function MushafRoute({ params }: PageProps) {
  const { page: pageStr } = use(params);
  const pageNumber = Number(pageStr);
  if (!Number.isFinite(pageNumber) || pageNumber < 1 || pageNumber > TOTAL_PAGES) notFound();

  const t = useT();
  const router = useRouter();
  const [audioAyah, setAudioAyah] = useState<{ surah: number; ayah: number; total: number } | null>(null);
  const [tafsirAyah, setTafsirAyah] = useState<{ surah: number; ayah: number } | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [qiraaPlayerOpen, setQiraaPlayerOpen] = useState(false);
  const [pageAyahs, setPageAyahs] = useState<PageAyah[]>([]);
  // Set to true when a page turn while audio is active should reseat
  // InlineAudio onto the first ayah of the freshly-loaded page. We use a ref
  // (not state) because the reseat happens *inside* fetchPage's success
  // callback — at that moment we know `data` is the new page's ayahs, which
  // avoids a race where a useEffect reading `pageAyahs` would see stale data
  // from the previous page and seat audio at the wrong ayah.
  const restartAudioOnPageRef = useRef(false);

  const reciterId = usePreferences((s) => s.reciterId);
  const tafsir = usePreferences((s) => s.tafsir);
  const riwayah = usePreferences((s) => s.riwayah);
  const setRiwayah = usePreferences((s) => s.setRiwayah);
  const mushafView = usePreferences((s) => s.mushafView);
  const setMushafView = usePreferences((s) => s.setMushafView);

  const riwayahMeta = riwayah !== "hafs" ? getRiwayah(riwayah) : null;
  const recitersForRiwayah = useMemo(
    () => (riwayah !== "hafs" ? getRecitersForRiwayah(riwayah) : []),
    [riwayah]
  );

  // Mirror MushafPage's fetch so the player has the ayah list (cached in
  // lib/api/quran). When restartAudioOnPageRef is set (manual prev/next or
  // audio-driven page turn), reseat audio onto the first ayah of THIS page
  // here — inside the callback — so we read fresh ayahs and avoid a race
  // with a separate effect that'd see stale pageAyahs.
  useEffect(() => {
    let cancel = false;
    fetchPage(pageNumber, "quran-uthmani")
      .then((data) => {
        if (cancel) return;
        setPageAyahs(data);
        if (restartAudioOnPageRef.current && data.length > 0) {
          const first = data[0];
          const surahMeta = SURAHS.find((s) => s.id === first.surah.number);
          setAudioAyah({
            surah: first.surah.number,
            ayah: first.numberInSurah,
            total: surahMeta?.ayahs ?? 7,
          });
          restartAudioOnPageRef.current = false;
        }
      })
      .catch(() => !cancel && setPageAyahs([]));
    return () => {
      cancel = true;
    };
  }, [pageNumber]);

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

  // Page navigation that keeps audio playing from ayah 1 of the new page.
  // Use this for the visible prev/next buttons; bare goPage() is for actions
  // that shouldn't disturb audio (e.g. landing on a page initially).
  const goPageFollowingAudio = (n: number) => {
    if (n < 1 || n > TOTAL_PAGES) return;
    if (audioAyah) restartAudioOnPageRef.current = true;
    goPage(n);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowLeft") goPageFollowingAudio(pageNumber + 1); // RTL: left = next
      else if (e.key === "ArrowRight") goPageFollowingAudio(pageNumber - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, audioAyah]);

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-ink-400 mb-3">
        <span className="text-ink-200">{t("mushaf.crumb.page", { n: pageNumber })}</span>
      </nav>

      <header className="mb-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goPageFollowingAudio(pageNumber - 1)}
            disabled={pageNumber <= 1}
            className="h-11 w-11 flex-shrink-0 inline-flex items-center justify-center rounded-xl glass hover:bg-black/[0.07] disabled:opacity-30"
            aria-label={t("mushaf.previousPage")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex-1 flex items-center justify-center gap-2 glass rounded-xl px-3 h-11 text-sm">
            <span className="text-ink-400">{t("mushaf.page")}</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={TOTAL_PAGES}
              value={pageNumber}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (n >= 1 && n <= TOTAL_PAGES) goPageFollowingAudio(n);
              }}
              className="w-14 bg-transparent text-ink-50 text-center focus:outline-none tabular-nums text-base"
            />
            <span className="text-ink-400">/ {TOTAL_PAGES}</span>
          </div>

          <button
            onClick={() => goPageFollowingAudio(pageNumber + 1)}
            disabled={pageNumber >= TOTAL_PAGES}
            className="h-11 w-11 flex-shrink-0 inline-flex items-center justify-center rounded-xl glass hover:bg-black/[0.07] disabled:opacity-30"
            aria-label={t("mushaf.nextPage")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value=""
            onChange={(v) => {
              const surah = SURAHS.find((s) => s.id === Number(v));
              if (surah) goPage(surah.page);
            }}
            options={[
              { value: "", label: t("mushaf.jumpToSurah") },
              ...SURAHS.map((s) => ({ value: String(s.id), label: `${s.id}. ${s.transliteration}` })),
            ]}
            ariaLabel={t("mushaf.jumpToSurahAria")}
            className="flex-1 min-w-[140px]"
          />
          <QiraatPicker value={riwayah} onChange={setRiwayah} />

          <div className="inline-flex items-center rounded-xl glass p-0.5" role="group" aria-label={t("mushaf.viewMode")}>
            <button
              type="button"
              onClick={() => setMushafView("scanned")}
              aria-pressed={mushafView === "scanned"}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                mushafView === "scanned"
                  ? "bg-gold-400/15 text-gold-300"
                  : "text-ink-300 hover:text-ink-50"
              }`}
              title={t("mushaf.scannedTitle")}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>{t("mushaf.scanned")}</span>
            </button>
            <button
              type="button"
              onClick={() => setMushafView("written")}
              aria-pressed={mushafView === "written"}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                mushafView === "written"
                  ? "bg-gold-400/15 text-gold-300"
                  : "text-ink-300 hover:text-ink-50"
              }`}
              title={t("mushaf.writtenTitle")}
            >
              <Type className="h-3.5 w-3.5" />
              <span>{t("mushaf.written")}</span>
            </button>
          </div>

          {riwayah !== "hafs" && (
            <Button
              variant={recitersForRiwayah.length > 0 ? "emerald" : "glass"}
              size="sm"
              onClick={() => setQiraaPlayerOpen((v) => !v)}
              aria-label={t("mushaf.listenInQiraah")}
              disabled={recitersForRiwayah.length === 0}
              title={
                recitersForRiwayah.length === 0
                  ? t("mushaf.noAudio")
                  : t("mushaf.listenInQiraah")
              }
            >
              <Headphones className="h-3.5 w-3.5" />
              <span>
                {recitersForRiwayah.length === 0 ? t("mushaf.noAudio") : t("mushaf.listenInQiraah")}
              </span>
            </Button>
          )}
          <Button
            variant="glass"
            size="sm"
            onClick={() => setShowControls((v) => !v)}
            aria-label={t("mushaf.aboutThisView")}
          >
            <Info className="h-3.5 w-3.5" />
            <span>{showControls ? t("action.hide") : t("action.about")}</span>
          </Button>
        </div>
      </header>

      {showControls && (
        <div className="glass rounded-2xl p-4 mb-5 text-sm text-ink-300 space-y-2">
          <p>{t("mushaf.about.scannedExplain")}</p>
          <p className="text-xs text-ink-400">{t("mushaf.about.diffsExplain")}</p>
        </div>
      )}

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

      <footer className="mt-8 flex items-center justify-between gap-3">
        <button
          onClick={() => goPageFollowingAudio(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-black/[0.07] transition-colors text-sm disabled:opacity-30"
        >
          <ArrowRight className="h-4 w-4" /> {t("action.previous")}
        </button>
        <button
          onClick={() => goPageFollowingAudio(pageNumber + 1)}
          disabled={pageNumber >= TOTAL_PAGES}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-black/[0.07] transition-colors text-sm disabled:opacity-30"
        >
          {t("action.next")} <ArrowLeft className="h-4 w-4" />
        </button>
      </footer>

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
          onAyahChange={(a) => {
            if (!audioAyah) return;
            const wasOnThisPage = pageAyahs.some(
              (p) =>
                p.surah.number === audioAyah.surah && p.numberInSurah === audioAyah.ayah
            );
            const nextOnThisPage = pageAyahs.some(
              (p) => p.surah.number === audioAyah.surah && p.numberInSurah === a
            );
            // Audio was on this page and the next ayah moves to the next page:
            // turn the page; the fetchPage success callback will reseat audio
            // at the first ayah of the freshly-loaded page (no race with stale
            // pageAyahs because the reseat reads `data` from the resolved
            // fetch, not the React state).
            if (wasOnThisPage && !nextOnThisPage && pageNumber < TOTAL_PAGES) {
              restartAudioOnPageRef.current = true;
              goPage(pageNumber + 1);
              return;
            }
            // Otherwise just continue playback on the same page.
            setAudioAyah((prev) => (prev ? { ...prev, ayah: a } : null));
          }}
          onClose={() => setAudioAyah(null)}
        />
      )}

      <QiraaAudioPlayer
        open={qiraaPlayerOpen}
        riwayah={riwayah}
        ayahs={pageAyahs}
        onPageEnd={() => {
          // Ayah-level Qira'at reciter just finished the last ayah on this
          // page — turn the page so listening continues without a manual tap.
          // The player resets ayahIdx to 0 on the new pageKey so playback
          // resumes at the first ayah of the new page.
          if (pageNumber < TOTAL_PAGES) goPage(pageNumber + 1);
        }}
        onClose={() => setQiraaPlayerOpen(false)}
      />
    </div>
  );
}
