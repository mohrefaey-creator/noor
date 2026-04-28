export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  folder: string;
  bitrate: 64 | 128 | 192;
  style: "Murattal" | "Mujawwad" | "Mu'allim";
}

export const RECITERS: Reciter[] = [
  {
    id: "minshawi-murattal",
    name: "Mohamed Seddik Al-Minshawy",
    arabicName: "محمد صديق المنشاوي",
    folder: "Minshawy_Murattal_128kbps",
    bitrate: 128,
    style: "Murattal",
  },
  {
    id: "minshawi-mujawwad",
    name: "Mohamed Seddik Al-Minshawy",
    arabicName: "محمد صديق المنشاوي",
    folder: "Minshawy_Mujawwad_192kbps",
    bitrate: 192,
    style: "Mujawwad",
  },
  {
    id: "husary",
    name: "Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
    folder: "Husary_128kbps",
    bitrate: 128,
    style: "Murattal",
  },
  {
    id: "abdulbasit",
    name: "Abdul Basit Abdus-Samad",
    arabicName: "عبد الباسط عبد الصمد",
    folder: "Abdul_Basit_Murattal_192kbps",
    bitrate: 192,
    style: "Murattal",
  },
  {
    id: "shuraim",
    name: "Saud Ash-Shuraim",
    arabicName: "سعود الشريم",
    folder: "Saood_ash-Shuraym_128kbps",
    bitrate: 128,
    style: "Murattal",
  },
];

export function getReciter(id: string): Reciter | undefined {
  return RECITERS.find((r) => r.id === id);
}

export const DEFAULT_RECITER_ID = "minshawi-murattal";
