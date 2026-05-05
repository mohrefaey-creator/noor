// Rule-based qira'at differences. Some features (notably madd lengthening in
// Warsh) are systematic — they apply to every occurrence in the Quran, so
// hand-authoring per-word JSON entries is the wrong approach. Detect them
// from the Hafs Uthmani rasm and emit synthetic diff rows.
//
// Hand-curated JSON entries always take precedence over rule entries when
// they target the same wordIndex.

import type { RiwayahId, DiffEntry } from "@/data/qiraat/metadata";
import { findMaddHits, type MaddHit } from "./madd";

type Diff = DiffEntry["diffs"][number];

const MADD_NOTES: Record<MaddHit["kind"], { ar: string; en: string }> = {
  badal: {
    ar: "مدّ البدل: ورش (من طريق الأزرق) يطوّل المد إلى ٤ أو ٦ حركات. حفص يقصره إلى حركتين فقط — نفس الرسم، لكن الصوت أطول.",
    en: "Madd al-Badal — Warsh (via al-Azraq) lengthens to 4 or 6 ḥarakāt. Hafs reads only 2. Same letters on the page, longer recitation.",
  },
  muttasil: {
    ar: "مدّ متّصل: ورش يُشبع المد إلى ٦ حركات. حفص يقرؤه ٤ أو ٥ حركات — نفس الكلمة، لكن المد أطول.",
    en: "Madd Muttaṣil — Warsh extends to 6 ḥarakāt. Hafs reads 4 or 5. Same word, longer madd.",
  },
  munfasil: {
    ar: "مدّ منفصل: ورش يقرؤه ٤ أو ٦ حركات. حفص يقرؤه ٤ أو ٥ حركات — يبدأ المد في آخر الكلمة السابقة وينتهي عند الهمزة هنا.",
    en: "Madd Munfaṣil — Warsh reads 4 or 6 ḥarakāt across the word boundary; Hafs reads 4 or 5. The madd starts at the end of the previous word and lands on this hamza.",
  },
};

function maddDiff(hit: MaddHit, hafsToken: string): Diff {
  return {
    wordIndex: hit.wordIndex,
    hafs: hafsToken,
    variant: hafsToken,
    type: "madd",
    note: MADD_NOTES[hit.kind],
  };
}

/**
 * Returns rule-based diffs for the given riwāyah and ayah. The caller is
 * responsible for merging these with hand-curated JSON entries — see
 * `mergeAyahDiffs` below.
 */
export function computeRuleDiffs(riwayah: RiwayahId, tokens: string[]): Diff[] {
  if (riwayah !== "warsh") return [];
  // Warsh's madd lengthening (via ṭarīq al-Azraq) is the canonical systematic
  // audible difference from Hafs. Apply to every occurrence.
  return findMaddHits(tokens).map((hit) => maddDiff(hit, tokens[hit.wordIndex]));
}

/**
 * Merges hand-curated JSON diffs (DiffEntry["diffs"]) with rule-based diffs.
 * If both target the same wordIndex, the JSON entry wins — those are explicit
 * and verified scholarly notes; the rule is a generic systematic feature.
 */
export function mergeAyahDiffs(jsonDiffs: Diff[] | undefined, ruleDiffs: Diff[]): Diff[] {
  const taken = new Set<number>(jsonDiffs?.map((d) => d.wordIndex) ?? []);
  const out: Diff[] = jsonDiffs ? [...jsonDiffs] : [];
  for (const r of ruleDiffs) {
    if (!taken.has(r.wordIndex)) out.push(r);
  }
  return out.sort((a, b) => a.wordIndex - b.wordIndex);
}
