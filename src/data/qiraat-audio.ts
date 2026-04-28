import { pad } from "@/lib/utils";
import type { RiwayahId } from "@/data/qiraat/metadata";

export interface QiraaReciter {
  id: string;
  name: string;
  arabicName: string;
  riwayah: RiwayahId;
  /** "everyayah" → ayah-level mp3; "quranicaudio" → surah-level mp3 */
  source: "everyayah" | "quranicaudio";
  /** path component used to build the URL */
  folder: string;
  ayahLevel: boolean;
  notable?: string;
}

/**
 * All reciters known to have published recordings in non-Hafs Qira'at
 * with publicly downloadable audio. Curated from EveryAyah and QuranicAudio.com.
 *
 * Note: Mishary Alafasy, As-Sudais, Al-Husary's & Al-Minshawy's main recordings
 * are all in Hafs ʿan ʿĀṣim. Of the famous reciters, only AbdulBaset (Warsh)
 * and Al-Husary (ad-Dūrī) have published widely-circulated non-Hafs recordings.
 */
export const QIRAA_RECITERS: QiraaReciter[] = [
  // ── Warsh ʿan Nāfiʿ ──────────────────────────────────────────
  {
    id: "abdulbasit-warsh",
    name: "Abdul Basit Abdus-Samad",
    arabicName: "عبد الباسط عبد الصمد",
    riwayah: "warsh",
    source: "everyayah",
    folder: "warsh/warsh_Abdul_Basit_128kbps",
    ayahLevel: true,
    notable: "The legendary Egyptian voice in Warsh — ayah-by-ayah",
  },
  {
    id: "aldosary-warsh",
    name: "Ibrahim Al-Dosary",
    arabicName: "إبراهيم الدوسري",
    riwayah: "warsh",
    source: "everyayah",
    folder: "warsh/warsh_ibrahim_aldosary_128kbps",
    ayahLevel: true,
  },
  {
    id: "aljazaery-warsh",
    name: "Yassin Al-Jazaery",
    arabicName: "ياسين الجزائري",
    riwayah: "warsh",
    source: "everyayah",
    folder: "warsh/warsh_yassin_al_jazaery_64kbps",
    ayahLevel: true,
  },

  // ── Qālūn ʿan Nāfiʿ ──────────────────────────────────────────
  {
    id: "huthayfi-qalun",
    name: "Ali Al-Huthayfi",
    arabicName: "علي الحذيفي",
    riwayah: "qalun",
    source: "quranicaudio",
    folder: "huthayfi_qaloon",
    ayahLevel: false,
    notable: "Imam of the Prophet's Mosque, in Qālūn",
  },

  // ── Ad-Dūrī ʿan Abī ʿAmr (Basrī) ─────────────────────────────
  {
    id: "husary-doori",
    name: "Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
    riwayah: "duri-basri",
    source: "quranicaudio",
    folder: "mahmood_khaleel_al-husaree_doori",
    ayahLevel: false,
    notable: "Sheikh Al-Husary's celebrated recording in ad-Dūrī",
  },
  {
    id: "sufi-doori",
    name: "Abdur-Rashid Sufi",
    arabicName: "عبد الرشيد صوفي",
    riwayah: "duri-basri",
    source: "quranicaudio",
    folder: "abdurrashid_sufi_doori",
    ayahLevel: false,
  },

  // ── Shuʿbah ʿan ʿĀṣim ────────────────────────────────────────
  {
    id: "sufi-shubah",
    name: "Abdur-Rashid Sufi",
    arabicName: "عبد الرشيد صوفي",
    riwayah: "shubah",
    source: "quranicaudio",
    folder: "abdurrashid_sufi_shu3ba",
    ayahLevel: false,
    notable: "One of few full-Qur'an recordings in Shuʿbah",
  },

  // ── Sūsī ʿan Abī ʿAmr ────────────────────────────────────────
  {
    id: "sufi-susi",
    name: "Abdur-Rashid Sufi",
    arabicName: "عبد الرشيد صوفي",
    riwayah: "susi",
    source: "quranicaudio",
    folder: "abdurrashid_sufi_soosi_2020",
    ayahLevel: false,
  },

  // ── Khalaf ʿan Ḥamzah ────────────────────────────────────────
  {
    id: "sufi-khalaf",
    name: "Abdur-Rashid Sufi",
    arabicName: "عبد الرشيد صوفي",
    riwayah: "khalaf-7",
    source: "quranicaudio",
    folder: "abdurrashid_sufi_-_khalaf_3an_7amza_recitation",
    ayahLevel: false,
  },
];

export function getRecitersForRiwayah(riwayah: RiwayahId): QiraaReciter[] {
  return QIRAA_RECITERS.filter((r) => r.riwayah === riwayah);
}

export function getQiraaAyahUrl(reciter: QiraaReciter, surah: number, ayah: number): string | null {
  if (reciter.source === "everyayah" && reciter.ayahLevel) {
    return `https://everyayah.com/data/${reciter.folder}/${pad(surah)}${pad(ayah)}.mp3`;
  }
  return null;
}

export function getQiraaSurahUrl(reciter: QiraaReciter, surah: number): string {
  if (reciter.source === "quranicaudio") {
    return `https://download.quranicaudio.com/quran/${reciter.folder}/${pad(surah)}.mp3`;
  }
  // For ayah-level reciters, surah-level URL doesn't exist; caller should iterate ayahs
  return `https://everyayah.com/data/${reciter.folder}/${pad(surah)}001.mp3`;
}

/** EveryAyah ayah URL for Hafs reciters (used for the ▶ Hafs comparison button) */
export function getHafsAyahUrl(folder: string, surah: number, ayah: number): string {
  return `https://everyayah.com/data/${folder}/${pad(surah)}${pad(ayah)}.mp3`;
}
