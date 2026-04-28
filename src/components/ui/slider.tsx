"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function Slider({ value, min = 0, max = 100, step = 1, onChange, className, ariaLabel }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("relative w-full h-5 flex items-center", className)}>
      <div className="absolute inset-x-0 h-1 rounded-full bg-white/10" />
      <div
        className="absolute h-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
        style={{ width: `${pct}%` }}
      />
      <input
        aria-label={ariaLabel}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer slider-input"
      />
      <style jsx>{`
        .slider-input::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: linear-gradient(180deg, #fb923c, #c2410c);
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.18);
          cursor: pointer;
        }
        .slider-input::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border: none;
          border-radius: 9999px;
          background: linear-gradient(180deg, #fb923c, #c2410c);
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.18);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
