"use client";
import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { getSurah } from "@/data/surahs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SurahRedirect({ params }: PageProps) {
  const { id } = use(params);
  const surahId = Number(id);
  const meta = getSurah(surahId);
  if (!meta) notFound();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/mushaf/${meta.page}#surah-${meta.id}`);
  }, [router, meta.page, meta.id]);
  return null;
}
