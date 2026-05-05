"use client";
import { Volume2, Wind, Repeat, Waves, ArrowLeftRight } from "lucide-react";
import { useT } from "@/lib/i18n/use-locale";

type MaddRow = {
  id: string;
  name: { ar: string; en: string };
  rule: string;
  hafs: string;
  warsh: string;
  examples: { ar: string; en: string }[];
  icon: React.ReactNode;
};

const MADD: MaddRow[] = [
  {
    id: "munfasil",
    name: { ar: "المد المنفصل", en: "Madd al-Munfaṣil" },
    rule: "A madd letter (ا و ي) at the end of one word followed by a hamzah at the start of the next.",
    hafs: "4 ḥarakāt",
    warsh: "6 ḥarakāt (ishbāʿ)",
    examples: [
      { ar: "بِمَا أُنزِلَ", en: "bi-mā ʾunzila" },
      { ar: "فِي أَنفُسِكُمْ", en: "fī ʾanfusikum" },
      { ar: "وَلَا أَنتُمْ", en: "wa-lā ʾantum" },
    ],
    icon: <Wind className="h-4 w-4" />,
  },
  {
    id: "muttasil",
    name: { ar: "المد المتصل", en: "Madd al-Muttaṣil" },
    rule: "A madd letter and a hamzah inside the same word.",
    hafs: "4 ḥarakāt",
    warsh: "6 ḥarakāt (ishbāʿ)",
    examples: [
      { ar: "جَآءَ", en: "jāʾa" },
      { ar: "السَّمَآءُ", en: "as-samāʾu" },
      { ar: "سُوٓءٌ", en: "sūʾun" },
    ],
    icon: <Waves className="h-4 w-4" />,
  },
  {
    id: "badal",
    name: { ar: "مد البدل", en: "Madd al-Badal" },
    rule: "A madd letter that originated from a hamzah (the second of two hamzahs is softened to a madd of its kind).",
    hafs: "2 ḥarakāt (natural)",
    warsh: "6 ḥarakāt (default ṭarīq al-Azraq)",
    examples: [
      { ar: "ءَادَمَ", en: "ʾĀdam" },
      { ar: "ءَامَنُوا۟", en: "ʾāmanū" },
      { ar: "إِيمَان", en: "ʾīmān" },
      { ar: "أُوتِيَ", en: "ʾūtiya" },
    ],
    icon: <Repeat className="h-4 w-4" />,
  },
  {
    id: "lin",
    name: { ar: "مد اللين", en: "Madd al-Līn" },
    rule: "Soft و or ي with sukūn, preceded by a fatḥah, when stopping on the next letter.",
    hafs: "2 ḥarakāt",
    warsh: "up to 6 ḥarakāt",
    examples: [
      { ar: "ٱلْبَيْت", en: "al-bayt" },
      { ar: "خَوْف", en: "khawf" },
      { ar: "قُرَيْش", en: "Quraysh" },
    ],
    icon: <Volume2 className="h-4 w-4" />,
  },
];

const OTHER_AUDIBLE = [
  {
    title: { ar: "الإمالة", en: "Imālah" },
    body: "Warsh tilts the alif toward yāʾ (and the fatḥah toward kasrah) in many words such as نَأَىٰ and ٱلْكَافِرِينَ. Hafs uses imālah in only one place: مَجْرَىٰ in 11:41.",
  },
  {
    title: { ar: "النقل", en: "Naql" },
    body: "Warsh transfers the ḥarakah of a hamzah onto the preceding sākin letter and drops the hamzah. Example: قَدْ أَفْلَحَ is read as قَدَ ٱفْلَحَ.",
  },
  {
    title: { ar: "تفخيم الراء", en: "Tafkhīm/Tarqīq of Rāʾ" },
    body: "Warsh applies different rules to the thickening or thinning of رَ depending on adjacent vowels — many words pronounced thick by Hafs are pronounced thin by Warsh.",
  },
  {
    title: { ar: "تسهيل الهمزة", en: "Tashīl al-Hamzah" },
    body: "When two hamzahs meet across or within a word, Warsh often softens (tashīl) the second one — audible as a vowel-coloured glide rather than a glottal stop.",
  },
];

export function MaddComparison() {
  const t = useT();
  return (
    <div className="space-y-5">
      <div className="glass-strong rounded-3xl p-7 md:p-9 relative overflow-hidden">
        <div className="absolute -top-24 -end-24 h-56 w-56 rounded-full bg-emerald-glow/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 text-emerald-glow mb-3">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.18em]">{t("madd.section.audible")}</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-ink-50 mb-3">{t("madd.heading")}</h2>
          <p className="text-ink-300 leading-relaxed">
            {t("madd.body1Pre")}
            <span className="text-gold-400 font-medium">Ḥafṣ</span>
            {t("madd.body1Mid")}
            <span className="text-gold-400 font-medium">Warsh</span>
            {t("madd.body1Post")}
          </p>
          <p className="text-ink-400 text-sm mt-3 leading-relaxed">{t("madd.body2")}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {MADD.map((m) => (
          <div
            key={m.id}
            className="glass rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-2xl gold-text leading-[1.6] py-0.5"
                >
                  {m.name.ar}
                </p>
                <h3 className="font-display text-lg text-ink-50 mt-1.5">{m.name.en}</h3>
              </div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400/15 text-gold-500 ring-1 ring-gold-400/25">
                {m.icon}
              </span>
            </div>
            <p className="text-sm text-ink-300 leading-relaxed">{m.rule}</p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-black/[0.04] border border-black/[0.06] p-3">
                <p className="text-[10px] uppercase tracking-wider text-ink-500">Ḥafṣ</p>
                <p className="font-display text-base text-ink-50 mt-1">{m.hafs}</p>
              </div>
              <div className="rounded-xl bg-emerald-glow/10 border border-emerald-glow/25 p-3">
                <p className="text-[10px] uppercase tracking-wider text-emerald-glow">Warsh</p>
                <p className="font-display text-base text-ink-50 mt-1">{m.warsh}</p>
              </div>
            </div>
            <div className="pt-1">
              <p className="text-[10px] uppercase tracking-wider text-ink-500 mb-2">{t("madd.examples")}</p>
              <div className="flex flex-wrap gap-1.5">
                {m.examples.map((ex) => (
                  <span
                    key={ex.ar}
                    className="inline-flex items-center gap-2 rounded-lg bg-black/[0.03] border border-black/[0.05] px-2.5 py-1.5"
                    title={ex.en}
                  >
                    <span dir="rtl" lang="ar" className="font-arabic text-base text-ink-100">
                      {ex.ar}
                    </span>
                    <span className="text-[10px] text-ink-400">{ex.en}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl p-6 md:p-7">
        <h3 className="font-display text-xl text-ink-50 mb-4">{t("madd.other")}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {OTHER_AUDIBLE.map((o) => (
            <div key={o.title.en} className="rounded-2xl bg-black/[0.03] border border-black/[0.05] p-4">
              <div className="flex items-baseline gap-2 mb-1.5">
                <h4 className="font-display text-base text-ink-50">{o.title.en}</h4>
                <span dir="rtl" lang="ar" className="font-arabic text-base text-gold-500">
                  {o.title.ar}
                </span>
              </div>
              <p className="text-sm text-ink-300 leading-relaxed">{o.body}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-500 mt-5 leading-relaxed">{t("madd.footer")}</p>
      </div>
    </div>
  );
}
