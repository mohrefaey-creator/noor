# First Prompt — Paste this into Claude Code as your very first message

Read CLAUDE.md carefully. This project has TWO unusual technical features that need real research before any code is written:
1. Multi-Qira'at comparison (10 readings, 20 transmitters).
2. Voice-driven Hifz trainer (speech recognition + word matching).

**DO NOT WRITE ANY CODE YET.** Your first job is research and a recommendation report.

---

## Research tasks

### 1. Qira'at data sources
For each of the 20 Riwayat in CLAUDE.md, search the web and GitHub for open Quranic text data. For each, report:
- Source URL, format, license, completeness, reliability.

Investigate: **Tanzil.net** downloads, **QuranEnc** (King Fahd Complex / quranenc.com), GitHub (`qiraat`, `warsh`, `qalun`, `shubah`, `quran variants`), **Quran.com** API.

Group findings into Tier 1 (ready), Tier 2 (partial), Tier 3 (mark "coming soon").

Sample-verify each Tier 1 Riwayah with these known differences:
- **Al-Fatihah 1:4** — Hafs "مَالِكِ" vs Shu'bah/Kisa'i/Ya'qub "مَلِكِ".
- **Al-Baqarah 2:10** — Hafs "يَكْذِبُونَ" vs some Kufiyyun "يُكَذِّبُونَ".
- **Al-Imran 3:81** — "لَمَا" vs "لِمَا".
- Find at least 2 well-known Warsh-specific differences (imalah, naql).

### 2. Base Hafs + audio + tafsir
Compare Al-Quran Cloud API, Quran.com API v4, EveryAyah, Tanzil. Recommend:
- Best Hafs Uthmani text source.
- Best audio source (multiple reciters).
- Best tafsir source (Ibn Kathir, Tabari, Sa'di) in Arabic + English.

### 3. Speech recognition for the Hifz Voice Trainer (CRITICAL)
This is the highest-risk feature. Research thoroughly:

**Web Speech API (v1 candidate):**
- Browser support matrix for `SpeechRecognition` with `lang="ar-SA"`.
- Known accuracy issues on Classical/Quranic Arabic.
- Latency characteristics for real-time word reveal.

**Specialized Quran ASR (v2 candidates):**
- **Tarteel** — open-source repos, models, API availability.
- **Hugging Face**: search for `whisper quran`, `tarteel`, `arabic quran asr`. Specifically check `Tarteel-AI/whisper-base-ar-quran` and similar.
- **OpenAI Whisper** — large-v3 accuracy on Quranic Arabic.
- Any other production-ready Arabic ASR (AssemblyAI, ElevenLabs Scribe, Deepgram Arabic).

**Word matching strategy:**
- Recommend a normalization approach for Arabic (tashkeel removal, alif normalization, etc.).
- Recommend a fuzzy-match algorithm (Levenshtein? phonetic?) and threshold values.
- Find any existing open-source Quran memorization apps (Tarteel mobile, Ayah, etc.) and note how they handle this.

### 4. Reference projects
Find 2–3 well-built open-source Quran apps on GitHub to study (NOT copy):
- `quran/quran` org repos
- `risan/quran-json`
- `cpfair/quran-align` (interesting for word-level audio alignment — relevant to Hifz trainer!)
- Any Tarteel open-source code
- Any others you find

### 5. Open questions to flag
List any decisions you want me to make before scaffolding (e.g., "Should we ship Hifz trainer in v1 with Web Speech API only, or wait for Tarteel backend?").

---

## Deliverable

A single report containing:
1. **Qira'at data table** — all 20 Riwayat, status (✅ / ⚠️ / ❌), recommended sources.
2. **Recommended APIs** for Hafs base, audio, tafsir.
3. **Speech recognition recommendation** — which engine for v1, which for v2, with reasoning. Include accuracy expectations honestly.
4. **Word matching strategy** — normalization rules + fuzzy match approach.
5. **Top 3 reference repos** and what to learn from each.
6. **Open questions** for me to decide.

Then **stop and wait for my approval** before writing any code or scaffolding the project.
