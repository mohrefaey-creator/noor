import { pad } from "@/lib/utils";

const BASE = "https://api.alquran.cloud/v1";

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter?: number;
  sajda?: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
  edition: { identifier: string; language: string; name: string };
}

export type Edition = "quran-uthmani" | "en.sahih" | "en.pickthall" | "en.asad" | "ar.muyassar";

interface SurahResponse {
  code: number;
  status: string;
  data: SurahData;
}

interface MultiSurahResponse {
  code: number;
  status: string;
  data: SurahData[];
}

const cache = new Map<string, unknown>();

async function get<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } });
  if (!res.ok) throw new Error(`Quran API ${res.status}: ${url}`);
  const json = (await res.json()) as T;
  cache.set(url, json);
  return json;
}

export async function fetchSurah(id: number, edition: Edition = "quran-uthmani"): Promise<SurahData> {
  const j = await get<SurahResponse>(`${BASE}/surah/${id}/${edition}`);
  return j.data;
}

export async function fetchSurahWithTranslation(
  id: number,
  translationEdition: Edition = "en.sahih"
): Promise<{ arabic: SurahData; translation: SurahData }> {
  const j = await get<MultiSurahResponse>(`${BASE}/surah/${id}/editions/quran-uthmani,${translationEdition}`);
  const [arabic, translation] = j.data;
  return { arabic, translation };
}

export interface AudioAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  audio: string;
  audioSecondary?: string[];
}

interface AudioSurahResponse {
  code: number;
  status: string;
  data: { ayahs: AudioAyah[]; numberOfAyahs: number; englishName: string; name: string };
}

export async function fetchSurahAudio(id: number, reciterEdition = "ar.minshawi"): Promise<AudioAyah[]> {
  const j = await get<AudioSurahResponse>(`${BASE}/surah/${id}/${reciterEdition}`);
  return j.data.ayahs;
}

export function everyAyahUrl(folder: string, surah: number, ayah: number): string {
  return `https://everyayah.com/data/${folder}/${pad(surah)}${pad(ayah)}.mp3`;
}

export interface PageAyah {
  number: number;
  text: string;
  surah: { number: number; name: string; englishName: string; englishNameTranslation: string; revelationType: string; numberOfAyahs: number };
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda?: boolean | object;
}

interface PageResponse {
  code: number;
  status: string;
  data: { number: number; ayahs: PageAyah[]; surahs: Record<string, unknown>; edition: { identifier: string } };
}

export async function fetchPage(pageNumber: number, edition: Edition = "quran-uthmani"): Promise<PageAyah[]> {
  const j = await get<PageResponse>(`${BASE}/page/${pageNumber}/${edition}`);
  return j.data.ayahs;
}

export function toArabicDigits(n: number | string): string {
  const map = "٠١٢٣٤٥٦٧٨٩";
  return String(n).split("").map((d) => (d >= "0" && d <= "9" ? map[Number(d)] : d)).join("");
}
