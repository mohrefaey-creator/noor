"use client";
import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Sparkles, Eye } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Tabs } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { RIWAYAT, type RiwayahId } from "@/data/qiraat/metadata";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/store/preferences";
import { MaddComparison } from "@/components/qiraat/madd-comparison";
import { useT } from "@/lib/i18n/use-locale";

const QARIS = [
  { name: "Nāfi' al-Madanī", ar: "نافع المدني", region: "Madinah", regionAr: "المدينة", riwayat: ["qalun", "warsh"] as RiwayahId[] },
  { name: "Ibn Kathīr al-Makkī", ar: "ابن كثير المكي", region: "Makkah", regionAr: "مكة", riwayat: ["albazzi", "qunbul"] as RiwayahId[] },
  { name: "Abū 'Amr al-Baṣrī", ar: "أبو عمرو البصري", region: "Basra", regionAr: "البصرة", riwayat: ["duri-basri", "susi"] as RiwayahId[] },
  { name: "Ibn 'Āmir ash-Shāmī", ar: "ابن عامر الشامي", region: "Damascus", regionAr: "دمشق", riwayat: ["hisham", "ibn-dhakwan"] as RiwayahId[] },
  { name: "'Āṣim al-Kūfī", ar: "عاصم الكوفي", region: "Kufa", regionAr: "الكوفة", riwayat: ["hafs", "shubah"] as RiwayahId[] },
  { name: "Ḥamzah al-Kūfī", ar: "حمزة الكوفي", region: "Kufa", regionAr: "الكوفة", riwayat: ["khalaf-7", "khallad"] as RiwayahId[] },
  { name: "Al-Kisā'ī al-Kūfī", ar: "الكسائي الكوفي", region: "Kufa", regionAr: "الكوفة", riwayat: ["abu-alharith", "duri-kisai"] as RiwayahId[] },
  { name: "Abū Ja'far al-Madanī", ar: "أبو جعفر المدني", region: "Madinah", regionAr: "المدينة", riwayat: ["ibn-wardan", "ibn-jammaz"] as RiwayahId[], set: 10 },
  { name: "Ya'qūb al-Ḥaḍramī", ar: "يعقوب الحضرمي", region: "Basra", regionAr: "البصرة", riwayat: ["ruways", "rawh"] as RiwayahId[], set: 10 },
  { name: "Khalaf al-'Āshir", ar: "خلف العاشر", region: "Kufa", regionAr: "الكوفة", riwayat: ["ishaq", "idris"] as RiwayahId[], set: 10 },
];

export default function QiraatPage() {
  const t = useT();
  const setRiwayah = usePreferences((s) => s.setRiwayah);
  const [tab, setTab] = useState<"about" | "imams" | "madd" | "differences">("about");

  return (
    <div>
      <PageHeader
        title={t("qiraat.title")}
        arabicTitle={t("qiraat.arabicTitle")}
        description={t("qiraat.description")}
      />

      <Tabs
        value={tab}
        onChange={(v) => setTab(v as typeof tab)}
        options={[
          { value: "about", label: t("qiraat.tabs.about") },
          { value: "imams", label: t("qiraat.tabs.imams") },
          { value: "madd", label: t("qiraat.tabs.madd") },
          { value: "differences", label: t("qiraat.tabs.differences") },
        ]}
        className="mb-6"
      />

      {tab === "about" && (
        <div className="space-y-5">
          <div className="glass-strong rounded-3xl p-7 md:p-9 relative overflow-hidden">
            <div className="absolute -top-24 -end-24 h-56 w-56 rounded-full bg-gold-400/10 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-2xl md:text-3xl text-ink-50 mb-3">
                {t("qiraat.about.heading")}
              </h2>
              <p className="text-ink-300 leading-relaxed">{t("qiraat.about.body1")}</p>
              <p className="text-ink-300 leading-relaxed mt-3">{t("qiraat.about.body2")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <InfoCard
              icon={<GraduationCap className="h-5 w-5 text-gold-400" />}
              title={t("qiraat.about.qarisCount.title")}
              body={t("qiraat.about.qarisCount.body")}
            />
            <InfoCard
              icon={<Sparkles className="h-5 w-5 text-emerald-glow" />}
              title={t("qiraat.about.ruwah.title")}
              body={t("qiraat.about.ruwah.body")}
            />
            <InfoCard
              icon={<Eye className="h-5 w-5 text-orange-300" />}
              title={t("qiraat.about.subtle.title")}
              body={t("qiraat.about.subtle.body")}
            />
          </div>
        </div>
      )}

      {tab === "imams" && (
        <div className="space-y-3">
          {QARIS.map((q) => (
            <div key={q.name} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-500">{q.region}</p>
                  <h3 className="font-display text-xl text-ink-50 mt-0.5">{q.name}</h3>
                  <p dir="rtl" lang="ar" className="font-arabic text-lg gold-text mt-1 leading-[1.7] py-0.5">
                    {q.ar}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-w-[160px]">
                  {q.riwayat.map((rid) => {
                    const r = RIWAYAT.find((x) => x.id === rid)!;
                    const tier = r.tier;
                    return (
                      <Link
                        key={rid}
                        href="/surah/1"
                        onClick={() => tier === 1 && setRiwayah(rid)}
                        className={cn(
                          "flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors",
                          tier === 1
                            ? "bg-gold-400/10 text-gold-300 hover:bg-gold-400/15 border border-gold-400/25"
                            : "bg-black/[0.03] text-ink-400 cursor-default border border-black/[0.06]"
                        )}
                      >
                        <span className="font-medium">{r.name}</span>
                        <span className="text-[10px]">{tier === 1 ? t("action.try") : t("action.soon")}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "madd" && <MaddComparison />}

      {tab === "differences" && (
        <div className="space-y-4">
          <p className="text-ink-300">{t("qiraat.diff.intro")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RIWAYAT.filter((r) => r.tier === 1).map((r) => (
              <div key={r.id} className="glass rounded-2xl p-5">
                <p dir="rtl" lang="ar" className="font-arabic text-2xl gold-text leading-[1.7] py-1 break-words">
                  {r.arabicName}
                </p>
                <h3 className="font-display text-lg text-ink-50 mt-1">{r.name}</h3>
                <p className="text-xs text-ink-400 mt-2 leading-relaxed">{r.description}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href="/surah/1"
                    onClick={() => setRiwayah(r.id)}
                    className={buttonVariants({ variant: "default", size: "sm" })}
                  >
                    {t("action.tryInAlFatihah")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RIWAYAT.filter((r) => r.tier !== 1).map((r) => (
              <div key={r.id} className="glass rounded-2xl p-5 opacity-60">
                <p dir="rtl" lang="ar" className="font-arabic text-2xl text-ink-300 leading-[1.7] py-1 break-words">
                  {r.arabicName}
                </p>
                <h3 className="font-display text-lg text-ink-200 mt-1">{r.name}</h3>
                <p className="text-xs text-ink-500 mt-2">{t("action.soon")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-display text-lg text-ink-50">{title}</p>
      </div>
      <p className="text-sm text-ink-300 mt-2">{body}</p>
    </div>
  );
}
