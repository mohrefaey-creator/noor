import { normalizeWord, tokenize } from "./normalize";

export interface MatchResult {
  matched: boolean;
  confidence: number;
  recognizedText: string;
  distance: number;
  expected: string;
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

export function thresholdFor(word: string, strict: boolean): number {
  const len = word.length;
  if (strict) {
    if (len <= 4) return 1;
    if (len <= 7) return 2;
    return 3;
  }
  // Lenient mode is the default and is now noticeably more forgiving so that the
  // engine's mis-hears (dropped hamzah, swapped ت/ط, missing ال, partial interim) still match.
  if (len <= 3) return 1;
  if (len <= 5) return 2;
  if (len <= 7) return 3;
  if (len <= 10) return 4;
  return 5;
}

export interface MatchOptions {
  strict?: boolean;
}

/**
 * True if `a` shares at least `minRatio` of its first characters with `b` from the start.
 * Used so that a partial / interim recognition like "بسم" matches the early portion of
 * "بسم" without requiring the full word to land in the transcript first.
 */
export function prefixSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const len = Math.min(a.length, b.length);
  let same = 0;
  for (let i = 0; i < len; i++) if (a[i] === b[i]) same++;
  return same / Math.max(a.length, b.length);
}

export function matchWord(expected: string, recognized: string, opts: MatchOptions = {}): MatchResult {
  const exp = normalizeWord(expected);
  const recTokens = tokenize(recognized);
  if (!exp || recTokens.length === 0) {
    return { matched: false, confidence: 0, recognizedText: recognized, distance: 9999, expected: exp };
  }
  let best: MatchResult = {
    matched: false,
    confidence: 0,
    recognizedText: recognized,
    distance: 9999,
    expected: exp,
  };
  const threshold = thresholdFor(exp, !!opts.strict);
  for (const token of recTokens) {
    // Exact hit — fast path.
    if (token === exp) {
      return { matched: true, confidence: 1, recognizedText: token, distance: 0, expected: exp };
    }
    // Containment (one is a substring of the other) — engines often drop or add ال / و / ف prefixes.
    if (token.includes(exp) || exp.includes(token)) {
      const ratio = Math.min(token.length, exp.length) / Math.max(token.length, exp.length);
      // Lowered from 0.7 → 0.55 so cases like "الرحمن" vs "رحمن" ratio≈0.66 still match.
      if (ratio >= 0.55) {
        return { matched: true, confidence: 0.85, recognizedText: token, distance: Math.abs(token.length - exp.length), expected: exp };
      }
    }
    // Prefix similarity — useful for live interim where the engine commits a leading slice
    // of the word before the rest. e.g. transcript "بس" while expected is "بسم".
    // Lenient: accept 2-char prefix; strict: require 3+ chars.
    const prefixRatio = prefixSimilarity(token, exp);
    const prefixMinLen = opts.strict ? 3 : 2;
    if (prefixRatio >= (opts.strict ? 0.75 : 0.65) && Math.min(token.length, exp.length) >= prefixMinLen) {
      return {
        matched: true,
        confidence: prefixRatio,
        recognizedText: token,
        distance: Math.abs(token.length - exp.length),
        expected: exp,
      };
    }
    const dist = levenshtein(token, exp);
    if (dist < best.distance) {
      const conf = 1 - dist / Math.max(exp.length, token.length, 1);
      best = {
        matched: dist <= threshold,
        confidence: conf,
        recognizedText: token,
        distance: dist,
        expected: exp,
      };
    }
  }
  return best;
}

/**
 * Find the index of the expected word in a stream of recognized tokens with sliding-window
 * tolerance. Allows a small look-ahead so the user can skip a word and still get the next match.
 */
export function findInStream(
  expected: string,
  recognizedTokens: string[],
  opts: MatchOptions & { lookahead?: number } = {}
): { index: number; result: MatchResult } | null {
  const lookahead = opts.lookahead ?? 2;
  const exp = normalizeWord(expected);
  const limit = Math.min(recognizedTokens.length, lookahead + 1);
  let bestIdx = -1;
  let best: MatchResult | null = null;
  const threshold = thresholdFor(exp, !!opts.strict);
  for (let i = 0; i < limit; i++) {
    const tok = recognizedTokens[i];
    if (tok === exp) return { index: i, result: { matched: true, confidence: 1, recognizedText: tok, distance: 0, expected: exp } };
    const dist = levenshtein(tok, exp);
    if (dist <= threshold && (!best || dist < best.distance)) {
      best = { matched: true, confidence: 1 - dist / Math.max(exp.length, tok.length, 1), recognizedText: tok, distance: dist, expected: exp };
      bestIdx = i;
    }
  }
  if (best && bestIdx >= 0) return { index: bestIdx, result: best };
  return null;
}
