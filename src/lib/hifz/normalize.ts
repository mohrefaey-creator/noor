// Arabic text normalization for fuzzy matching against speech recognition output.
// Pure functions, fully deterministic.

const TASHKEEL_RE = /[ً-ٰٟۖ-ۭ]/g;
const TATWEEL_RE = /ـ/g;
const NON_ARABIC_RE = /[^؀-ۿ\s]/g;

export function stripTashkeel(s: string): string {
  return s.replace(TASHKEEL_RE, "");
}

export function stripTatweel(s: string): string {
  return s.replace(TATWEEL_RE, "");
}

export function unifyAlif(s: string): string {
  return s.replace(/[آأإٱ]/g, "ا");
}

export function unifyYa(s: string): string {
  return s.replace(/ى/g, "ي");
}

export function unifyTaMarbutah(s: string): string {
  return s.replace(/ة/g, "ه");
}

export function unifyHamzaOnLetters(s: string): string {
  return s.replace(/ؤ/g, "و").replace(/ئ/g, "ي");
}

export function normalizeArabic(s: string): string {
  let out = s.normalize("NFC");
  out = stripTashkeel(out);
  out = stripTatweel(out);
  out = unifyAlif(out);
  out = unifyYa(out);
  out = unifyTaMarbutah(out);
  out = unifyHamzaOnLetters(out);
  out = out.replace(NON_ARABIC_RE, " ");
  out = out.replace(/\s+/g, " ").trim();
  return out;
}

export function tokenize(s: string): string[] {
  const norm = normalizeArabic(s);
  if (!norm) return [];
  return norm.split(" ").filter(Boolean);
}

export function normalizeWord(s: string): string {
  return normalizeArabic(s);
}
