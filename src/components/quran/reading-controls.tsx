"use client";
import { Type, Eye, EyeOff, Headphones } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TAFSIR_OPTIONS } from "@/lib/api/tafsir";
import { RECITERS } from "@/data/reciters";
import { usePreferences } from "@/lib/store/preferences";
import { useT } from "@/lib/i18n/use-locale";

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
  const t = useT();
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
            <Type className="h-3.5 w-3.5" /> {t("reading.arabicSize")}{" "}
            <span className="ms-auto text-gold-400">{fontSizeArabic}px</span>
          </label>
          <Slider value={fontSizeArabic} min={20} max={56} step={2} onChange={setFontSize} ariaLabel={t("reading.fontSizeAria")} />
        </div>
        <div className="flex items-end gap-2 flex-wrap">
          <div className="flex-1 min-w-[160px]">
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400 mb-2">
              {showTranslation ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}{" "}
              {t("reading.translation")}
            </label>
            <Select
              value={translation}
              onChange={(v) => setTranslation(v as typeof translation)}
              options={TRANSLATIONS}
              className="w-full"
              ariaLabel={t("reading.translation")}
            />
          </div>
          <Button
            variant={showTranslation ? "glass" : "outline"}
            size="default"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? t("action.hide") : t("action.show")}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-ink-400 mb-2 block">
            {t("reading.reciter")}
          </label>
          <Select
            value={reciterId}
            onChange={setReciter}
            options={RECITERS.map((r) => ({ value: r.id, label: r.name }))}
            className="w-full"
            ariaLabel={t("reading.reciter")}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-ink-400 mb-2 block">
            {t("reading.tafsir")}
          </label>
          <Select
            value={tafsir}
            onChange={(v) => setTafsir(v as typeof tafsir)}
            options={TAFSIR_OPTIONS.map((tt) => ({ value: tt.value, label: tt.label }))}
            className="w-full"
            ariaLabel={t("reading.tafsir")}
          />
        </div>
      </div>

      {onPlayAll && (
        <Button variant="emerald" size="default" onClick={onPlayAll} className="w-full md:w-auto md:self-start">
          <Headphones className="h-4 w-4" /> {t("reading.playWhole")}
        </Button>
      )}
    </div>
  );
}
