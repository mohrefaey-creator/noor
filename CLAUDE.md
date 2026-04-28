# Quran Web App — with Multi-Qira'at Comparison & Voice Hifz Trainer

## WHY
A modern Quran web app for reading, listening, memorizing (Hifz), and studying tafsir.
Two distinguishing features set it apart from other Quran apps:
1. **Multi-Qira'at comparison** — see how any of the 10 canonical readings differs from Hafs.
2. **Voice-driven Hifz training** — recite from memory and watch the page reveal words as you say them correctly.

## WHAT — Core Features
1. **Read** — All 114 surahs in Arabic with selectable translations.
2. **Listen** — Audio recitation player with multiple reciters and ayah sync.
3. **Hifz Tracker** — mark ayahs memorized, daily progress, goals.
4. **Hifz Voice Trainer** ⭐ — see below.
5. **Study** — Tafsir viewer + full-text search.
6. **Qira'at Comparison Mode** ⭐ — see below.
7. **/qiraat educational page** — explains the 10 Qira'at.

---

## FEATURE: Hifz Voice Trainer (the "hidden words" mode)

### Concept
The user opens a page (or a selected range of ayat) where all words are **visually hidden / blurred / shown as dashes**. They begin reciting from memory. As the app's speech recognition detects each correctly-recited word, that word **appears** on the page in proper Quranic script. If the user gets stuck or says a wrong word, that word stays hidden and a gentle hint becomes available.

### UI / UX

**Setup screen:**
- Choose what to memorize: a full surah, a page (mushaf page 1–604), a range of ayat, or a saved Hifz "session".
- Choose hiding style:
  - **Blur** (Arabic text visible but heavily blurred — easier mode).
  - **Dashes** (each word replaced with `ـــــ` placeholders matching word length — medium).
  - **Empty boxes** (only the boxes show, hardest — pure recall).
- Choose strictness:
  - **Lenient** — accepts close pronunciations, ignores tashkeel mismatches.
  - **Strict** — requires near-exact match to the expected word (still no tajweed scoring in v1).
- Choose hint policy:
  - After **N seconds** of silence on the current word, show the first letter as a hint.
  - After **2N seconds**, reveal the full word but mark it as "assisted" in the session report.

**Trainer screen:**
- Big "Start Reciting" button → requests microphone permission.
- Live waveform / mic indicator at the bottom (so user knows audio is being heard).
- Current ayah is highlighted; current expected word has a subtle pulse.
- As each word is recognized correctly:
  - It fades from hidden → visible with a gentle animation (~200ms).
  - Move to next word as the expected target.
- If user misreads or mispronounces:
  - The word stays hidden.
  - After the configured silence window, the hint policy kicks in.
- "Pause", "Skip word", "Restart ayah", "End session" controls always visible.

**Post-session report:**
- Total words recited.
- Correct on first try / required hint / skipped.
- Per-ayah accuracy.
- Suggested next session: "Repeat the 3 ayat where you struggled most."
- Saved to localStorage (and optionally syncs to Hifz tracker).

### Technical approach

**v1 (in-browser, free, ships first):**
- Use **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`).
  - Set `lang = "ar-SA"`, `continuous = true`, `interimResults = true`.
  - Browser support: Chrome/Edge/Safari yes, Firefox limited → show a warning + recommend Chrome.
- Word-matching pipeline (this is the heart of the feature):
  1. Take the expected next word from the ayah.
  2. **Normalize both expected and recognized text**: strip tashkeel (diacritics), normalize alif variants (`أ إ آ ا` → `ا`), normalize ya/alif maqsura (`ى → ي`), strip tatweel (`ـ`), collapse whitespace.
  3. Compare with **Levenshtein distance** with a threshold (lenient: distance ≤ 2 for words ≥ 4 letters; strict: distance ≤ 1).
  4. Also accept if recognized text **contains** the normalized expected word (Web Speech often returns multi-word chunks).
  5. On match → reveal word, advance pointer.
- Implement as a **client-only** feature (`"use client"`) using a custom `useQuranSpeechMatcher` hook.
- All matching logic lives in `/lib/hifz/matcher.ts` — pure TypeScript, fully unit-tested.

**v2 (better accuracy, after v1 ships):**
- Add a **Tarteel** or **Whisper-fine-tuned-on-Quran** backend (Next.js API route or separate Python microservice).
- Stream microphone audio in chunks → backend → return word timestamps.
- Investigate `Tarteel-AI/whisper-base-ar-quran` and similar models on Hugging Face.
- Keep Web Speech API as a fallback when the backend is unavailable.

**v3 (future, ambitious):**
- Tajweed correctness scoring (madd length, ghunnah, qalqalah).
- Requires specialized models + scholarly review. **Out of scope for now.**

### Data structures

```ts
type HifzSession = {
  id: string;
  startedAt: number;
  endedAt?: number;
  range: { surah: number; fromAyah: number; toAyah: number };
  hideMode: "blur" | "dashes" | "boxes";
  strictness: "lenient" | "strict";
  results: {
    surah: number;
    ayah: number;
    word: string;          // expected word (with tashkeel)
    wordIndex: number;
    status: "correct-first-try" | "correct-after-hint" | "skipped" | "revealed";
    msToRecite?: number;
  }[];
};

type WordMatchResult = {
  matched: boolean;
  confidence: number;   // 0..1
  recognizedText: string;
  distance: number;
};
```

### What NOT to do in this feature
- ❌ Do not claim the app "verifies tajweed" in v1. It only verifies *which word*, not *how it was pronounced*.
- ❌ Do not make the experience punishing. No red X's, no buzzer sounds, no scores that feel like failing a test.
- ❌ Do not store recorded audio without explicit user opt-in. Recognition should be processed and discarded.
- ❌ Do not block the feature on mobile Safari quirks — fall back gracefully.

---

## FEATURE: Qira'at Comparison Mode

### Background
Hafs 'an 'Asim is the default and most widespread recitation. There are 9 other canonical Qari (10 total = Qira'at al-'Ashr), each with two transmitters (Ruwah). Users pick a (Qira'ah, Riwayah) pair and see how it differs from Hafs.

### Canonical Qira'at and transmitters

| # | Qari (Imam) | Riwayah 1 | Riwayah 2 | Set |
|---|---|---|---|---|
| 1 | Nafi' al-Madani | Qalun | Warsh | 7 |
| 2 | Ibn Kathir al-Makki | Al-Bazzi | Qunbul | 7 |
| 3 | Abu 'Amr al-Basri | Ad-Duri | As-Susi | 7 |
| 4 | Ibn 'Amir ash-Shami | Hisham | Ibn Dhakwan | 7 |
| 5 | 'Asim al-Kufi | **Hafs** (default) | Shu'bah | 7 |
| 6 | Hamzah al-Kufi | Khalaf | Khallad | 7 |
| 7 | Al-Kisa'i al-Kufi | Abu al-Harith | Hafs ad-Duri | 7 |
| 8 | Abu Ja'far al-Madani | Ibn Wardan | Ibn Jammaz | 10 |
| 9 | Ya'qub al-Hadrami | Ruways | Rawh | 10 |
| 10 | Khalaf al-'Ashir | Ishaq | Idris | 10 |

### UI behavior
- Qira'at picker on each surah page: choose Qari → choose Riwayah.
- Default: **'Asim / Hafs** (no diff highlighting).
- Any other Riwayah selected → words/letters that differ from Hafs are highlighted in **faint red** (`text-red-400/60`).
- Tap/hover a highlighted word → popover with:
  - The variant in Arabic.
  - Type (harakah, imalah, idgham, izhar, hamz, naql, madd, different word, etc).
  - Short note in Arabic + English.
  - Optional audio of the variant.
- Status banner: "Comparing **Hafs** ↔ **Warsh 'an Nafi'** — N differences in this surah".
- Riwayat without verified data show as "coming soon" in the picker.

### Data approach
- Tier 1 (likely shippable in v1): Hafs, Warsh, Qalun, Ad-Duri (Basri), Shu'bah, Al-Bazzi.
- Tier 2: Hisham, Ibn Dhakwan, Khalaf, Khallad, As-Susi, Qunbul.
- Tier 3 (mark "coming soon"): Al-Kisa'i transmitters, Abu Ja'far transmitters, Ya'qub transmitters, Khalaf al-'Ashir transmitters.
- Sources to investigate: Tanzil.net, QuranEnc (King Fahd Complex), GitHub repos.
- Pre-compute word-level diffs vs Hafs and store as `/data/qiraat/<riwayah>.diffs.json`.

### Diff structure
```ts
type RiwayahId =
  | "qalun" | "warsh"
  | "albazzi" | "qunbul"
  | "duri-basri" | "susi"
  | "hisham" | "ibn-dhakwan"
  | "hafs" | "shubah"
  | "khalaf-7" | "khallad"
  | "abu-alharith" | "duri-kisai"
  | "ibn-wardan" | "ibn-jammaz"
  | "ruways" | "rawh"
  | "ishaq" | "idris";

type DiffEntry = {
  surah: number;
  ayah: number;
  diffs: {
    wordIndex: number;
    hafs: string;
    variant: string;
    type: "harakah" | "imalah" | "idgham" | "izhar"
        | "hamz" | "naql" | "madd" | "word" | "other";
    note?: { ar: string; en: string };
  }[];
};
```

---

## TECH STACK
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand (stores: `activeRiwayah`, `hifzSession`, `userPrefs`)
- **Data:** Al-Quran Cloud API or Tanzil for Hafs base; verified Qira'at datasets for variants.
- **Speech:** Web Speech API (v1); Tarteel/Whisper backend (v2).
- **Storage:** localStorage v1.
- **Fonts:** Amiri Quran or Scheherazade New for Arabic. Inter for UI.

## STRUCTURE
```
/app
  /(read)/surah/[id]      → reading view (with Qira'at picker)
  /listen                 → audio player
  /hifz                   → memorization dashboard
  /hifz/trainer           → voice Hifz trainer ⭐
  /search                 → search + tafsir
  /qiraat                 → educational page
/components
  /ui                     → shadcn primitives
  /quran                  → AyahView, DiffWord, AudioPlayer
  /qiraat                 → QiraatPicker, RiwayahInfoPanel, DiffPopover
  /hifz                   → HiddenWord, MicIndicator, SessionReport
/lib
  /api                    → API clients
  /qiraat                 → diff loader, riwayat metadata
  /hifz
    /matcher.ts           → word-matching logic (pure, unit-tested)
    /normalize.ts         → Arabic text normalization
    /useSpeech.ts         → Web Speech API hook
  /store                  → Zustand stores
/data
  /qiraat
    /metadata.json
    /warsh.diffs.json
    /...
    /SOURCES.md
```

## CONVENTIONS
- TypeScript strict. No `any`.
- Server Components by default; `"use client"` only when needed.
- Arabic containers MUST have `dir="rtl"` and `lang="ar"`.
- Cache aggressively — Quran text never changes.
- Active Riwayah and Hifz prefs persist in localStorage.
- All Hifz matcher logic must have unit tests with real Arabic word pairs.

## DESIGN PRINCIPLES
- Calm, reverent. Generous whitespace. Dark mode first-class.
- Arabic text is the hero — large, beautiful.
- Diff highlighting is **subtle** — faint red, never harsh.
- Hifz trainer is **encouraging**, never punitive.
- All canonical Qira'at are presented as authentic and valid.

## DO NOT
- Never modify the Arabic Quranic text from any Riwayah.
- Never present any canonical Qira'ah as wrong or inferior.
- Never ship a Riwayah without a cited, verified data source.
- Do not claim tajweed verification in v1 — only word recognition.
- Do not store user audio recordings without explicit opt-in.
- No ads, no tracking in v1.

## RESEARCH TASKS FOR CLAUDE CODE (do BEFORE writing code)
1. **Qira'at data**: for each of the 20 Riwayat, find open data sources. Sample-verify with known differences.
2. **Hafs base + audio + tafsir**: compare Al-Quran Cloud, Quran.com API, Tanzil, EveryAyah.
3. **Speech recognition**:
   - Test Web Speech API with `lang="ar-SA"` — what's its accuracy on classical Arabic?
   - Survey: Tarteel models on Hugging Face, OpenAI Whisper Arabic, `Tarteel-AI/whisper-base-ar-quran`, ElevenLabs scribe, AssemblyAI Arabic.
   - Find any open-source Quran memorization apps using voice (e.g., Tarteel itself) to study patterns.
4. Find 2–3 reference repos to learn architecture from (NOT to copy).
5. Deliver a recommendation report and wait for user approval before scaffolding.

## CURRENT STATUS
Just initialized. Build order:
1. Scaffolding + surah list homepage
2. Surah reading view (Hafs only)
3. Audio player
4. Hifz tracker (basic — mark memorized, no voice yet)
5. Bookmarks + search
6. **Qira'at picker UI** + diff rendering (Warsh first)
7. Tafsir viewer
8. **Hifz Voice Trainer v1** (Web Speech API + word matcher)
9. Expand Qira'at to more Riwayat
10. /qiraat educational page
11. (v2) Tarteel/Whisper backend for better speech accuracy
