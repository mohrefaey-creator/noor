import data from "./word-coords.json";
import { type RiwayahId, getDiffsForSurah, getRiwayah } from "./metadata";

export interface WordCoord {
  page: number;
  line: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const COORDS_REFERENCE_WIDTH: number = data.width;
export const WORD_COORDS: Record<string, WordCoord> = data.coords as Record<string, WordCoord>;

export function getCoord(surah: number, ayah: number, wordIndex: number): WordCoord | undefined {
  return WORD_COORDS[`${surah}:${ayah}:${wordIndex}`];
}

export interface PageDiffOverlay {
  surah: number;
  ayah: number;
  wordIndex: number;
  coord: WordCoord;
  hafs: string;
  variant: string;
  type: string;
  note?: { ar: string; en: string };
}

/**
 * For a given Riwāyah and mushaf page, return all word-level diffs that have known
 * pixel coordinates on that page. Used by the mushaf-page overlay to paint
 * faint-red highlights on top of the scanned image.
 */
export function getPageOverlays(riwayah: RiwayahId, page: number, surahsOnPage: number[]): PageDiffOverlay[] {
  if (riwayah === "hafs") return [];
  if (!getRiwayah(riwayah)) return [];
  const out: PageDiffOverlay[] = [];
  for (const surah of surahsOnPage) {
    const entries = getDiffsForSurah(riwayah, surah);
    for (const entry of entries) {
      for (const d of entry.diffs) {
        const coord = getCoord(entry.surah, entry.ayah, d.wordIndex);
        if (!coord || coord.page !== page) continue;
        out.push({
          surah: entry.surah,
          ayah: entry.ayah,
          wordIndex: d.wordIndex,
          coord,
          hafs: d.hafs,
          variant: d.variant,
          type: d.type,
          note: d.note,
        });
      }
    }
  }
  return out;
}
