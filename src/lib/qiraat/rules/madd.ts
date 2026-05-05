// Systematic madd detection from Hafs Uthmani rasm.
//
// We detect three families of madd that produce well-known length differences
// across riwāyāt — every occurrence in the Quran is an audible difference, so
// hand-authoring per-word entries is the wrong approach. We compute them from
// the text itself.
//
// Hamza qaṭʿ (ء أ إ ؤ ئ) — the only hamza form that triggers madd al-badal.
// Hamza waṣl (ٱ U+0671) is excluded.
const HAMZA_QAT = "\\u0621\\u0623\\u0625\\u0626\\u0624";
// "Strong" long vowel: a letter that's actually pronounced long in Hafs Uthmani.
//   - alif (0627), dagger alif (0670), alif madda (0622), alif maqṣūra (0649)
//     are always long
//   - wāw (0648) and yāʾ (064a) are long only when NOT followed by a short vowel,
//     tanwin or shadda — otherwise they are consonants (e.g. wa- in وَإِيَّاكَ)
const SHORT_VOWEL_OR_SHADDA = "\\u064b-\\u0651"; // tanwins, fatha, damma, kasra, shadda
const STRONG_LONG_VOWEL =
  `(?:[\\u0627\\u0670\\u0622\\u0649]|[\\u0648\\u064a](?![${SHORT_VOWEL_OR_SHADDA}]))`;
// Diacritics that may sit between the trigger letter and the long vowel in
// Uthmani spelling. Covers 064B-065F (harakāt, sukūn, madda, hamza marks, rare
// Quranic marks), tatweel, and the small high annotation set.
const TASHKEEL = "\\u0640\\u064b-\\u065f\\u06d6-\\u06ed";

// Madd al-Badal: hamza-qaṭʿ followed by a strong long vowel within the same
// token. Examples: ءَادَمَ, ءَامَنُوا, إِيمَٰنٌ, أُوتُوا, ءَاتَىٰ.
// The combined glyph آ (U+0622) is itself hamza+alif and therefore a complete
// Madd al-Badal in one character, so we accept it as a standalone match.
const RE_MADD_BADAL = new RegExp(
  `(?:[${HAMZA_QAT}][${TASHKEEL}]*${STRONG_LONG_VOWEL})|\\u0622`
);

// Madd Muttaṣil: strong long vowel followed by hamza-qaṭʿ within the same token.
// Examples: جَآءَ, شَآءَ, ٱلسَّمَآءِ, أُولَٰٓئِكَ, سُوٓءَ.
const RE_MADD_MUTTASIL = new RegExp(
  `${STRONG_LONG_VOWEL}[${TASHKEEL}]*[${HAMZA_QAT}]`
);

// Madd Munfaṣil applies across the boundary between two tokens — the previous
// token ends in a strong long vowel, the next begins with hamza-qaṭʿ.
const RE_ENDS_LONG_VOWEL = new RegExp(`${STRONG_LONG_VOWEL}[${TASHKEEL}]*$`);
const RE_STARTS_HAMZA_QAT = new RegExp(`^[${TASHKEEL}]*[${HAMZA_QAT}\\u0622]`);

export function hasMaddBadal(token: string): boolean {
  return RE_MADD_BADAL.test(token);
}

export function hasMaddMuttasil(token: string): boolean {
  return RE_MADD_MUTTASIL.test(token);
}

/**
 * Returns true when the gap between `prev` and `next` triggers Madd Munfaṣil:
 * prev ends with a long vowel and next starts with hamza-qaṭʿ.
 */
export function isMaddMunfasilBoundary(prev: string, next: string): boolean {
  return RE_ENDS_LONG_VOWEL.test(prev) && RE_STARTS_HAMZA_QAT.test(next);
}

export interface MaddHit {
  wordIndex: number;
  kind: "badal" | "muttasil" | "munfasil";
}

export function findMaddHits(tokens: string[]): MaddHit[] {
  const hits: MaddHit[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    // Muttaṣil takes priority over Badal when both could apply, since it
    // reflects a stronger madd (6 ḥ in Warsh vs Hafs 4-5).
    if (hasMaddMuttasil(t)) {
      hits.push({ wordIndex: i, kind: "muttasil" });
      continue;
    }
    if (hasMaddBadal(t)) {
      hits.push({ wordIndex: i, kind: "badal" });
      continue;
    }
    // Munfaṣil — the next-word hamza is the trigger; we tag the *next* token
    // (the one starting with hamza) so the green ring lands on the visible
    // hamza letter, not on the trailing long vowel of the previous word.
    if (i + 1 < tokens.length && isMaddMunfasilBoundary(t, tokens[i + 1])) {
      hits.push({ wordIndex: i + 1, kind: "munfasil" });
    }
  }
  // Deduplicate by wordIndex, keeping the highest-priority hit.
  const byIdx = new Map<number, MaddHit>();
  const priority: Record<MaddHit["kind"], number> = { muttasil: 3, badal: 2, munfasil: 1 };
  for (const h of hits) {
    const cur = byIdx.get(h.wordIndex);
    if (!cur || priority[h.kind] > priority[cur.kind]) byIdx.set(h.wordIndex, h);
  }
  return Array.from(byIdx.values()).sort((a, b) => a.wordIndex - b.wordIndex);
}
