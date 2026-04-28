export interface TafsirEntry {
  text: string;
  ayah: number;
}

export type TafsirEdition =
  | "ar-tafsir-muyassar"
  | "ar-tafsir-ibn-kathir"
  | "ar-tafsir-al-saddi"
  | "ar-tafsir-al-tabari"
  | "en-tafsir-ibn-kathir"
  | "en-tafsir-maarif-ul-quran";

const cache = new Map<string, TafsirEntry>();

export async function fetchTafsir(
  edition: TafsirEdition,
  surah: number,
  ayah: number
): Promise<TafsirEntry | null> {
  const key = `${edition}/${surah}/${ayah}`;
  if (cache.has(key)) return cache.get(key)!;
  const url = `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${edition}/${surah}/${ayah}.json`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { text: string; ayah: number };
    const entry: TafsirEntry = { text: json.text, ayah: json.ayah };
    cache.set(key, entry);
    return entry;
  } catch {
    return null;
  }
}

export const TAFSIR_OPTIONS: { value: TafsirEdition; label: string; lang: "ar" | "en" }[] = [
  { value: "ar-tafsir-muyassar", label: "الميسر", lang: "ar" },
  { value: "ar-tafsir-ibn-kathir", label: "ابن كثير", lang: "ar" },
  { value: "ar-tafsir-al-saddi", label: "السعدي", lang: "ar" },
  { value: "en-tafsir-ibn-kathir", label: "Ibn Kathir (EN)", lang: "en" },
  { value: "en-tafsir-maarif-ul-quran", label: "Ma'arif (EN)", lang: "en" },
];
