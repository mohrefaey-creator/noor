"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Mic, ArrowRight, Flame, BookmarkCheck } from "lucide-react";
import { SURAHS } from "@/data/surahs";
import { SurahCard } from "@/components/quran/surah-card";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { usePreferences } from "@/lib/store/preferences";
import { useHifz } from "@/lib/store/hifz-store";
import { getSurah } from "@/data/surahs";

export default function Home() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const lastRead = usePreferences((s) => s.lastRead);
  const memorized = useHifz((s) => s.memorized);
  const streak = useHifz((s) => s.streak);

  const memorizedPerSurah = useMemo(() => {
    const acc = new Map<number, number>();
    Object.keys(memorized).forEach((k) => {
      const [s] = k.split(":").map(Number);
      acc.set(s, (acc.get(s) ?? 0) + 1);
    });
    return acc;
  }, [memorized]);

  const filtered = useMemo(() => {
    let list = SURAHS;
    if (tab === "meccan") list = list.filter((s) => s.type === "meccan");
    if (tab === "medinan") list = list.filter((s) => s.type === "medinan");
    if (tab === "memorizing") list = list.filter((s) => (memorizedPerSurah.get(s.id) ?? 0) > 0);
    if (q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.transliteration.toLowerCase().includes(term) ||
          s.english.toLowerCase().includes(term) ||
          s.name.includes(term) ||
          String(s.id) === term
      );
    }
    return list;
  }, [q, tab, memorizedPerSurah]);

  const lastSurah = lastRead ? getSurah(lastRead.surah) : undefined;

  return (
    <div>
      {/* Logo header */}
      <section className="pt-8 pb-10 flex flex-col items-center gap-6 text-center">
        <Image
          src="/logo.png"
          alt="Noor — Quran app"
          width={280}
          height={280}
          priority
          sizes="(min-width: 768px) 256px, 224px"
          className="h-56 w-56 md:h-64 md:w-64 rounded-2xl object-cover shadow-[0_8px_24px_-12px_rgba(31,29,24,0.20)] ring-1 ring-black/[0.06]"
        />
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={lastRead && lastSurah ? `/mushaf/${lastSurah.page}` : "/mushaf/1"}
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            {lastRead ? "Continue Reading" : "Open Mushaf"}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/hifz/trainer" className={buttonVariants({ variant: "emerald", size: "lg" })}>
            <Mic className="h-4 w-4" /> Voice Trainer
          </Link>
        </div>
      </section>

      {/* quick stats */}
      <section className="mb-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          icon={<Flame className="h-4 w-4 text-orange-300" />}
          label="Streak"
          value={`${streak.current} day${streak.current === 1 ? "" : "s"}`}
          accent="from-orange-400/20 to-orange-300/5"
        />
        <StatCard
          icon={<BookmarkCheck className="h-4 w-4 text-emerald-glow" />}
          label="Memorized"
          value={`${Object.keys(memorized).length} ayāt`}
          accent="from-emerald-glow/20 to-emerald/5"
        />
        {lastSurah ? (
          <Link
            href={`/mushaf/${lastSurah.page}#surah-${lastSurah.id}`}
            className="rounded-2xl glass p-4 hover:bg-black/[0.06] transition-colors group"
          >
            <div className="text-[10px] uppercase tracking-wider text-ink-500">Continue</div>
            <div className="mt-1 font-display text-lg text-ink-50 group-hover:text-gold-400 transition-colors">
              {lastSurah.transliteration} <span className="text-ink-400 text-sm">· {lastRead!.ayah}</span>
            </div>
          </Link>
        ) : (
          <StatCard
            icon={<Sparkles className="h-4 w-4 text-gold-400" />}
            label="Ready"
            value="Pick a surah"
            accent="from-gold-400/20 to-gold-500/5"
          />
        )}
      </section>

      {/* Surah list */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <h2 className="font-display text-2xl text-ink-50">
            Surahs <span className="text-ink-500 text-sm align-middle ml-2">114 chapters</span>
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs
              value={tab}
              onChange={setTab}
              options={[
                { value: "all", label: "All" },
                { value: "meccan", label: "Meccan" },
                { value: "medinan", label: "Medinan" },
                { value: "memorizing", label: "Memorizing" },
              ]}
            />
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, number, or English meaning…"
            className="pl-10"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((s, i) => (
            <SurahCard
              key={s.id}
              surah={s}
              index={i}
              memorizedAyahs={memorizedPerSurah.get(s.id) ?? 0}
            />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-ink-400 py-10">No surahs match that.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl glass p-4 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60 pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-ink-400">
          {icon}
          <span>{label}</span>
        </div>
        <div className="mt-1 font-display text-lg text-ink-50">{value}</div>
      </div>
    </div>
  );
}
