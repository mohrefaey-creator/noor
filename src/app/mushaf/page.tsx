"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/lib/store/preferences";
import { getSurah } from "@/data/surahs";

export default function MushafIndex() {
  const router = useRouter();
  const lastRead = usePreferences((s) => s.lastRead);
  useEffect(() => {
    const surah = lastRead ? getSurah(lastRead.surah) : null;
    const target = surah?.page ?? 1;
    router.replace(`/mushaf/${target}`);
  }, [lastRead, router]);
  return null;
}
