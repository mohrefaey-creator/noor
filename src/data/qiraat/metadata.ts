export type RiwayahId =
  | "hafs" | "shubah"
  | "qalun" | "warsh"
  | "albazzi" | "qunbul"
  | "duri-basri" | "susi"
  | "hisham" | "ibn-dhakwan"
  | "khalaf-7" | "khallad"
  | "abu-alharith" | "duri-kisai"
  | "ibn-wardan" | "ibn-jammaz"
  | "ruways" | "rawh"
  | "ishaq" | "idris";

export interface RiwayahMeta {
  id: RiwayahId;
  name: string;
  arabicName: string;
  qari: string;
  arabicQari: string;
  set: 7 | 10;
  tier: 1 | 2 | 3;
  description: string;
}

export const RIWAYAT: RiwayahMeta[] = [
  { id: "hafs", name: "Hafs 'an 'Asim", arabicName: "حفص عن عاصم", qari: "'Asim al-Kufi", arabicQari: "عاصم الكوفي", set: 7, tier: 1,
    description: "The most widespread reading worldwide. Default in nearly all printed Mushafs today." },
  { id: "warsh", name: "Warsh 'an Nafi'", arabicName: "ورش عن نافع", qari: "Nafi' al-Madani", arabicQari: "نافع المدني", set: 7, tier: 1,
    description: "Dominant in North & West Africa. Notable for imālah and naql features." },
  { id: "qalun", name: "Qalun 'an Nafi'", arabicName: "قالون عن نافع", qari: "Nafi' al-Madani", arabicQari: "نافع المدني", set: 7, tier: 1,
    description: "Common in Libya and parts of Tunisia. The second transmitter of Nafi'." },
  { id: "duri-basri", name: "Ad-Duri 'an Abi 'Amr", arabicName: "الدوري عن أبي عمرو", qari: "Abu 'Amr al-Basri", arabicQari: "أبو عمرو البصري", set: 7, tier: 1,
    description: "Used in parts of Sudan and the Horn of Africa." },
  { id: "shubah", name: "Shu'bah 'an 'Asim", arabicName: "شعبة عن عاصم", qari: "'Asim al-Kufi", arabicQari: "عاصم الكوفي", set: 7, tier: 1,
    description: "The other transmitter from 'Asim. Many small but well-known differences from Hafs." },
  { id: "albazzi", name: "Al-Bazzi 'an Ibn Kathir", arabicName: "البزي عن ابن كثير", qari: "Ibn Kathir al-Makki", arabicQari: "ابن كثير المكي", set: 7, tier: 1,
    description: "Mecca tradition; rich in distinctive idgham features." },
  { id: "qunbul", name: "Qunbul 'an Ibn Kathir", arabicName: "قنبل عن ابن كثير", qari: "Ibn Kathir al-Makki", arabicQari: "ابن كثير المكي", set: 7, tier: 2,
    description: "Second transmitter of Ibn Kathir." },
  { id: "susi", name: "As-Susi 'an Abi 'Amr", arabicName: "السوسي عن أبي عمرو", qari: "Abu 'Amr al-Basri", arabicQari: "أبو عمرو البصري", set: 7, tier: 2,
    description: "Second transmitter of Abu 'Amr." },
  { id: "hisham", name: "Hisham 'an Ibn 'Amir", arabicName: "هشام عن ابن عامر", qari: "Ibn 'Amir ash-Shami", arabicQari: "ابن عامر الشامي", set: 7, tier: 2, description: "Damascus tradition (coming soon)." },
  { id: "ibn-dhakwan", name: "Ibn Dhakwan 'an Ibn 'Amir", arabicName: "ابن ذكوان عن ابن عامر", qari: "Ibn 'Amir ash-Shami", arabicQari: "ابن عامر الشامي", set: 7, tier: 2, description: "Damascus tradition (coming soon)." },
  { id: "khalaf-7", name: "Khalaf 'an Hamzah", arabicName: "خلف عن حمزة", qari: "Hamzah al-Kufi", arabicQari: "حمزة الكوفي", set: 7, tier: 2, description: "Coming soon." },
  { id: "khallad", name: "Khallad 'an Hamzah", arabicName: "خلاد عن حمزة", qari: "Hamzah al-Kufi", arabicQari: "حمزة الكوفي", set: 7, tier: 2, description: "Coming soon." },
  { id: "abu-alharith", name: "Abu al-Harith 'an al-Kisa'i", arabicName: "أبو الحارث عن الكسائي", qari: "Al-Kisa'i al-Kufi", arabicQari: "الكسائي الكوفي", set: 7, tier: 3, description: "Coming soon." },
  { id: "duri-kisai", name: "Hafs ad-Duri 'an al-Kisa'i", arabicName: "الدوري عن الكسائي", qari: "Al-Kisa'i al-Kufi", arabicQari: "الكسائي الكوفي", set: 7, tier: 3, description: "Coming soon." },
  { id: "ibn-wardan", name: "Ibn Wardan 'an Abi Ja'far", arabicName: "ابن وردان عن أبي جعفر", qari: "Abu Ja'far al-Madani", arabicQari: "أبو جعفر المدني", set: 10, tier: 3, description: "Coming soon." },
  { id: "ibn-jammaz", name: "Ibn Jammaz 'an Abi Ja'far", arabicName: "ابن جماز عن أبي جعفر", qari: "Abu Ja'far al-Madani", arabicQari: "أبو جعفر المدني", set: 10, tier: 3, description: "Coming soon." },
  { id: "ruways", name: "Ruways 'an Ya'qub", arabicName: "رويس عن يعقوب", qari: "Ya'qub al-Hadrami", arabicQari: "يعقوب الحضرمي", set: 10, tier: 3, description: "Coming soon." },
  { id: "rawh", name: "Rawh 'an Ya'qub", arabicName: "روح عن يعقوب", qari: "Ya'qub al-Hadrami", arabicQari: "يعقوب الحضرمي", set: 10, tier: 3, description: "Coming soon." },
  { id: "ishaq", name: "Ishaq 'an Khalaf", arabicName: "إسحاق عن خلف", qari: "Khalaf al-'Ashir", arabicQari: "خلف العاشر", set: 10, tier: 3, description: "Coming soon." },
  { id: "idris", name: "Idris 'an Khalaf", arabicName: "إدريس عن خلف", qari: "Khalaf al-'Ashir", arabicQari: "خلف العاشر", set: 10, tier: 3, description: "Coming soon." },
];

export function getRiwayah(id: RiwayahId): RiwayahMeta | undefined {
  return RIWAYAT.find((r) => r.id === id);
}

export type DiffType = "harakah" | "imalah" | "idgham" | "izhar" | "hamz" | "naql" | "madd" | "word" | "other";

export interface DiffEntry {
  surah: number;
  ayah: number;
  diffs: {
    wordIndex: number;
    hafs: string;
    variant: string;
    type: DiffType;
    note?: { ar: string; en: string };
  }[];
}

import warshDiffs from "./warsh.diffs.json";
import shubahDiffs from "./shubah.diffs.json";
import qalunDiffs from "./qalun.diffs.json";
import duriBasriDiffs from "./duri-basri.diffs.json";
import albazziDiffs from "./albazzi.diffs.json";

const DIFF_DATA: Partial<Record<RiwayahId, DiffEntry[]>> = {
  warsh: warshDiffs as DiffEntry[],
  shubah: shubahDiffs as DiffEntry[],
  qalun: qalunDiffs as DiffEntry[],
  "duri-basri": duriBasriDiffs as DiffEntry[],
  albazzi: albazziDiffs as DiffEntry[],
};

export function getDiffsForSurah(riwayah: RiwayahId, surah: number): DiffEntry[] {
  if (riwayah === "hafs") return [];
  const all = DIFF_DATA[riwayah];
  if (!all) return [];
  return all.filter((d) => d.surah === surah);
}

export function countDiffsForSurah(riwayah: RiwayahId, surah: number): number {
  return getDiffsForSurah(riwayah, surah).reduce((sum, e) => sum + e.diffs.length, 0);
}
