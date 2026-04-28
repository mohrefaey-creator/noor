"use client";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, BookOpen, CheckCircle2, Circle, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Ayah } from "@/lib/api/quran";
import type { DiffEntry, RiwayahId } from "@/data/qiraat/metadata";
import { DiffWord } from "@/components/qiraat/diff-word";

interface AyahViewProps {
  ayah: Ayah;
  surah: number;
  translation?: string;
  fontSize: number;
  isMemorized: boolean;
  isBookmarked: boolean;
  isPlaying: boolean;
  diff?: DiffEntry;
  riwayah: RiwayahId;
  riwayahName: string;
  onToggleMemorize: () => void;
  onToggleBookmark: () => void;
  onTafsir: () => void;
  onPlay: () => void;
}

export function AyahView({
  ayah,
  surah,
  translation,
  fontSize,
  isMemorized,
  isBookmarked,
  isPlaying,
  diff,
  riwayah,
  riwayahName,
  onToggleMemorize,
  onToggleBookmark,
  onTafsir,
  onPlay,
}: AyahViewProps) {
  // Tokenize Arabic text by whitespace
  const words = ayah.text.split(/\s+/);
  const diffMap = new Map<number, DiffEntry["diffs"][number]>();
  diff?.diffs.forEach((d) => diffMap.set(d.wordIndex, d));

  return (
    <motion.article
      id={`ayah-${ayah.numberInSurah}`}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group relative rounded-2xl px-5 py-6 transition-colors scroll-mt-24",
        "border border-transparent hover:border-black/[0.05] hover:bg-black/[0.02]",
        isMemorized && "bg-emerald-glow/[0.025] border-emerald-glow/15 hover:border-emerald-glow/25"
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0">
          <span className="ayah-number">{ayah.numberInSurah}</span>
        </div>
        <div className="flex items-center gap-1 ml-auto opacity-60 group-hover:opacity-100 transition-opacity">
          <IconBtn onClick={onPlay} ariaLabel={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="h-4 w-4 text-gold-400" /> : <Play className="h-4 w-4" />}
          </IconBtn>
          <IconBtn onClick={onTafsir} ariaLabel="Tafsir">
            <BookOpen className="h-4 w-4" />
          </IconBtn>
          <IconBtn onClick={onToggleBookmark} ariaLabel="Bookmark">
            {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-gold-400" /> : <Bookmark className="h-4 w-4" />}
          </IconBtn>
          <IconBtn onClick={onToggleMemorize} ariaLabel="Mark memorized">
            {isMemorized ? <CheckCircle2 className="h-4 w-4 text-emerald-glow" /> : <Circle className="h-4 w-4" />}
          </IconBtn>
        </div>
      </div>

      <div
        dir="rtl"
        lang="ar"
        className="font-arabic leading-[2.2] text-balance text-ink-50"
        style={{ fontSize: `${fontSize}px` }}
      >
        {words.map((w, i) => {
          const d = diffMap.get(i);
          if (d && riwayah !== "hafs") {
            return (
              <span key={i}>
                <DiffWord word={w} diff={d} riwayahName={riwayahName} />{" "}
              </span>
            );
          }
          return <span key={i}>{w} </span>;
        })}
      </div>

      {translation && (
        <p className="mt-4 text-sm md:text-base text-ink-300 leading-relaxed">
          <span className="text-gold-400/70 font-medium mr-2">{surah}:{ayah.numberInSurah}</span>
          {translation}
        </p>
      )}
    </motion.article>
  );
}

function IconBtn({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-300 hover:text-ink-50 hover:bg-black/[0.06] transition-colors"
    >
      {children}
    </button>
  );
}
