"use client";
import { useMemo } from "react";
import type { PageAyah } from "@/lib/api/quran";
import { toArabicDigits } from "@/lib/api/quran";
import { type RiwayahId, getDiffsForSurah, getRiwayah, type DiffEntry } from "@/data/qiraat/metadata";
import { computeRuleDiffs, mergeAyahDiffs } from "@/lib/qiraat/rules";
import { DiffWord } from "@/components/qiraat/diff-word";
import { Bismillah } from "@/components/common/bismillah";

interface MushafTextViewProps {
  page: number;
  ayahs: PageAyah[];
  riwayah: RiwayahId;
}

interface SurahGroup {
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  ayahs: PageAyah[];
}

// Build a surah → ayah → wordIndex → diff lookup so per-word rendering is O(1).
// Combines hand-curated JSON entries with rule-based systematic detections
// (Warsh madd lengthening etc).
function buildDiffIndex(riwayah: RiwayahId, ayahs: PageAyah[]) {
  const out = new Map<string, DiffEntry["diffs"][number]>();
  if (riwayah === "hafs") return out;

  // Group JSON diffs by ayah for fast lookup during merge.
  const surahsOnPage = Array.from(new Set(ayahs.map((a) => a.surah.number)));
  const jsonByAyah = new Map<string, DiffEntry["diffs"]>();
  for (const surah of surahsOnPage) {
    for (const entry of getDiffsForSurah(riwayah, surah)) {
      jsonByAyah.set(`${entry.surah}:${entry.ayah}`, entry.diffs);
    }
  }

  for (const a of ayahs) {
    const tokens = a.text.split(/\s+/);
    const json = jsonByAyah.get(`${a.surah.number}:${a.numberInSurah}`);
    const rules = computeRuleDiffs(riwayah, tokens);
    const merged = mergeAyahDiffs(json, rules);
    for (const d of merged) {
      out.set(`${a.surah.number}:${a.numberInSurah}:${d.wordIndex}`, d);
    }
  }
  return out;
}

export function MushafTextView({ page, ayahs, riwayah }: MushafTextViewProps) {
  const groups = useMemo<SurahGroup[]>(() => {
    const out: SurahGroup[] = [];
    for (const a of ayahs) {
      const last = out[out.length - 1];
      if (last && last.surahNumber === a.surah.number) {
        last.ayahs.push(a);
      } else {
        out.push({
          surahNumber: a.surah.number,
          surahNameArabic: a.surah.name,
          surahNameEnglish: a.surah.englishName,
          ayahs: [a],
        });
      }
    }
    return out;
  }, [ayahs]);

  const diffIndex = useMemo(
    () => buildDiffIndex(riwayah, ayahs),
    [riwayah, ayahs]
  );
  const riwayahName = riwayah !== "hafs" ? getRiwayah(riwayah)?.name ?? "" : "";

  if (ayahs.length === 0) return null;

  return (
    <div
      className="relative w-full mx-auto max-w-3xl rounded-3xl mushaf-image-frame px-5 py-7 sm:px-8 sm:py-10"
      lang="ar"
      dir="rtl"
    >
      <div className="space-y-7">
        {groups.map((g) => {
          // Show Bismillah header before any surah other than At-Tawbah (9), and skip
          // the duplicated Bismillah on Al-Fatihah ayah 1 (it's already part of the ayah).
          const showBismillah =
            g.surahNumber !== 9 &&
            g.ayahs[0].numberInSurah === 1 &&
            g.surahNumber !== 1;
          return (
            <section key={g.surahNumber} className="space-y-4">
              {/* Surah header — only if this surah starts on this page */}
              {g.ayahs[0].numberInSurah === 1 && (
                <header className="text-center border-b border-gold-400/15 pb-3">
                  <p
                    className="font-arabic text-3xl gold-text"
                    style={{ lineHeight: 1.6 }}
                  >
                    {g.surahNameArabic}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-ink-400 mt-1" dir="ltr">
                    Surah {g.surahNumber} · {g.surahNameEnglish}
                  </p>
                </header>
              )}

              {showBismillah && <Bismillah />}

              <p className="font-arabic text-2xl sm:text-3xl text-ink-50 leading-[2.6] text-justify text-balance">
                {g.ayahs.map((a) => {
                  const tokens = a.text.split(/\s+/);
                  return (
                    <span key={`${a.surah.number}-${a.numberInSurah}`} className="inline">
                      {tokens.map((tok, idx) => {
                        const diff = diffIndex.get(`${a.surah.number}:${a.numberInSurah}:${idx}`);
                        return (
                          <span key={idx} className="inline">
                            {diff ? (
                              <DiffWord word={tok} diff={diff} riwayahName={riwayahName} />
                            ) : (
                              <span>{tok}</span>
                            )}
                            {idx < tokens.length - 1 && " "}
                          </span>
                        );
                      })}
                      <span className="ayah-number mx-1.5">
                        {toArabicDigits(a.numberInSurah)}
                      </span>{" "}
                    </span>
                  );
                })}
              </p>
            </section>
          );
        })}
      </div>

      {/* Page number bottom-center */}
      <span
        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-ink-950/55 backdrop-blur text-[11px] text-gold-400 font-arabic"
        dir="ltr"
      >
        {toArabicDigits(page)}
      </span>
    </div>
  );
}
