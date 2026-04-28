"use client";
import { Type, Eye, EyeOff, Headphones } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TAFSIR_OPTIONS } from "@/lib/api/tafsir";
import { RECITERS } from "@/data/reciters";
import { usePreferences } from "@/lib/store/preferences";

const TRANSLATIONS = [
  { value: "en.sahih", label: "Sahih International (EN)" },
  { value: "en.pickthall", label: "Pickthall (EN)" },
  { value: "en.asad", label: "Asad (EN)" },
  { value: "ar.muyassar", label: "Al-Muyassar (AR)" },
];

interface ReadingControlsProps {
  onPlayAll?: () => void;
}

export function ReadingControls({ onPlayAll }: ReadingControlsProps) {
  const {
    fontSizeArabic,
    setFontSize,
    showTranslation,
    setShowTranslation,
    translation,
    setTranslation,
    tafsir,
    setTafsir,
    reciterId,
    setReciter,
  } = usePreferences();

  return (
    <div className="glass rounded-2xl p-4 md:p-5 mb-6 grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400 mb-2">
            <Type className="h-3.5 w-3.5" /> Arabic size <span className="ml-auto text-gold-400">{fontSizeArabic}px</span>
          </label>
          <Slider value={fontSizeArabic} min={20} max={56} step={2} onChange={setFontSize} ariaLabel="Arabic font size" />
        </div>
        <div className="flex items-end gap-2 flex-wrap">
          <div className="flex-1 min-w-[160px]">
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400 mb-2">
              {showTranslation ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />} Translation
            </label>
            <Select
              value={translation}
              onChange={(v) => setTranslation(v as typeof translation)}
              options={TRANSLATIONS}
              className="w-full"
              ariaLabel="Translation"
            />
          </div>
          <Button
            variant={showTranslation ? "glass" : "outline"}
            size="default"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-ink-400 mb-2 block">Reciter</label>
          <Select
            value={reciterId}
            onChange={setReciter}
            options={RECITERS.map((r) => ({ value: r.id, label: r.name }))}
            className="w-full"
            ariaLabel="Reciter"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-ink-400 mb-2 block">Tafsir</label>
          <Select
            value={tafsir}
            onChange={(v) => setTafsir(v as typeof tafsir)}
            options={TAFSIR_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
            className="w-full"
            ariaLabel="Tafsir"
          />
        </div>
      </div>

      {onPlayAll && (
        <Button variant="emerald" size="default" onClick={onPlayAll} className="w-full md:w-auto md:self-start">
          <Headphones className="h-4 w-4" /> Play whole surah
        </Button>
      )}
    </div>
  );
}
