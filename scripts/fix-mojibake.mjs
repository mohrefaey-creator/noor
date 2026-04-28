import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const files = [
  "src/components/hifz/trainer-setup.tsx",
  "src/components/quran/surah-card.tsx",
  "src/components/quran/surah-header.tsx",
  "src/components/qiraat/qiraa-audio-player.tsx",
  "src/app/listen/page.tsx",
  "src/components/quran/mushaf-page.tsx",
  "src/components/qiraat/page-diff-panel.tsx",
  "src/components/hifz/session-report.tsx",
  "src/app/search/page.tsx",
  "src/app/qiraat/page.tsx",
  "src/app/mushaf/[page]/page.tsx",
  "src/app/hifz/page.tsx",
  "src/app/hifz/trainer/page.tsx",
];

// Reverse the "UTF-8 bytes → cp1252-decoded → re-encoded UTF-8" corruption:
// 1. Read file as UTF-8 string.
// 2. For each char, take its lower byte (cp1252 / latin-1 single-byte).
// 3. Treat the resulting byte stream as UTF-8 → recover original characters.
//
// We use Buffer 'latin1' (a strict 0-255 mapping). If a char's codepoint
// is > 0xFF it is NOT recoverable this way → we keep it untouched by
// falling back per-character.

// Map cp1252-only codepoints (0x80–0x9F slots in cp1252) back to their byte values.
const cp1252Extras = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
  [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);

function fixMojibake(text) {
  const bytes = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp <= 0xff) {
      bytes.push(cp);
    } else if (cp1252Extras.has(cp)) {
      bytes.push(cp1252Extras.get(cp));
    } else {
      // codepoint not from the cp1252 corruption → emit as-is (UTF-8 bytes)
      const buf = Buffer.from(ch, "utf8");
      for (const b of buf) bytes.push(b);
    }
  }
  return Buffer.from(bytes).toString("utf8");
}

const root = "C:/Users/malrefaey/Desktop/Quran";
let changed = 0;
for (const rel of files) {
  const abs = resolve(root, rel);
  let raw = readFileSync(abs);
  // strip BOM if present
  if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) raw = raw.subarray(3);
  const text = raw.toString("utf8");
  const fixed = fixMojibake(text);
  if (fixed !== text) {
    writeFileSync(abs, fixed, "utf8");
    console.log("fixed:", rel);
    changed++;
  } else {
    console.log("clean:", rel);
  }
}
console.log(`\nTotal files updated: ${changed}`);
