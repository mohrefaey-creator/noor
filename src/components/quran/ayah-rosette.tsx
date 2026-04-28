import { toArabicDigits } from "@/lib/api/quran";

interface AyahRosetteProps {
  number: number;
  size?: number;
}

export function AyahRosette({ number, size = 36 }: AyahRosetteProps) {
  const display = toArabicDigits(number);
  return (
    <span
      className="inline-flex items-center justify-center align-middle mx-1.5 select-none"
      style={{ width: size, height: size }}
      aria-label={`Ayah ${number}`}
    >
      <svg viewBox="0 0 40 40" width={size} height={size} className="block">
        <defs>
          <radialGradient id="rosetteGrad" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(232,200,120,0.20)" />
            <stop offset="100%" stopColor="rgba(180,135,64,0.05)" />
          </radialGradient>
        </defs>
        <g>
          <circle cx="20" cy="20" r="17" fill="url(#rosetteGrad)" stroke="rgba(234, 88, 12,0.55)" strokeWidth="0.8" />
          <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(234, 88, 12,0.35)" strokeWidth="0.6" />
          {/* eight-point star outline */}
          <g stroke="rgba(234, 88, 12,0.45)" strokeWidth="0.6" fill="none">
            <polygon points="20,4 23,15 36,17 26,24 30,36 20,28 10,36 14,24 4,17 17,15" opacity="0.55" />
          </g>
          <text
            x="20"
            y="24"
            textAnchor="middle"
            fontSize={display.length > 2 ? "11" : "13"}
            fill="#fb923c"
            style={{ fontFamily: "var(--font-amiri), serif", fontWeight: 600 }}
          >
            {display}
          </text>
        </g>
      </svg>
    </span>
  );
}
