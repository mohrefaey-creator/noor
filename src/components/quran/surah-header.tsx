import { toArabicDigits } from "@/lib/api/quran";

interface SurahHeaderProps {
  arabicName: string;
  ayahs: number;
  type: "meccan" | "medinan";
}

export function SurahHeader({ arabicName, ayahs, type }: SurahHeaderProps) {
  const arabicAyahs = toArabicDigits(ayahs);
  const arabicType = type === "meccan" ? "مَكِّيَّة" : "مَدَنِيَّة";
  return (
    <div className="my-5 flex justify-center select-none" dir="rtl" lang="ar">
      <div className="relative w-full max-w-2xl">
        {/* Decorative outer frame */}
        <div className="rounded-xl border border-gold-400/40 bg-gradient-to-b from-gold-400/[0.08] to-gold-400/[0.02] px-4 py-3 shadow-[inset_0_0_0_2px_rgba(234, 88, 12,0.15)]">
          {/* Inner ornamental line */}
          <div className="rounded-md border border-gold-400/25 px-3 py-2">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <span className="text-xs text-gold-400/80 font-arabic whitespace-nowrap">آياتها {arabicAyahs}</span>
              <h2 className="text-center font-arabic text-2xl md:text-3xl gold-text leading-[1.6] py-1 px-2 break-words">
                {arabicName}
              </h2>
              <span className="text-xs text-gold-400/80 font-arabic whitespace-nowrap">{arabicType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
