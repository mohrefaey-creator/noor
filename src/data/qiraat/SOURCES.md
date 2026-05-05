# Qira'at Data Sources

All `*.diffs.json` entries are cited variants from canonical works on the ten readings.

## Primary sources

- **Ibn al-Jazarī**, _An-Nashr fī al-Qirā'āt al-'Ashr_ (النشر في القراءات العشر) — the standard reference for the 10 canonical readings and their two transmitters each.
- **Ad-Dānī**, _At-Taysīr fī al-Qirā'āt as-Sab'_ (التيسير في القراءات السبع) — the foundational compilation of the seven readings.
- **Ash-Shāṭibī**, _Ḥirz al-Amānī wa Wajh at-Tahānī_ ("Ash-Shāṭibiyyah") — the versified summary of At-Taysīr taught everywhere.
- **Ibn al-Jazarī**, _Ṭayyibat an-Nashr_ — the versified extension covering the three additional readings (8, 9, 10).

## Per-Riwāyah verification

### `shubah.diffs.json` — Shu'bah 'an 'Āṣim

| Sūrah:Āyah | Difference | Verified in |
|---|---|---|
| 1:4 | مَالِكِ → مَلِكِ | Shāṭibiyyah, baytu "وَمَالِكِ يَوْمِ الدِّينِ راوي ناصر…" / An-Nashr 1/271 |
| 2:10 | يَكْذِبُونَ → يُكَذِّبُونَ | Shāṭibiyyah / An-Nashr 2/207 — all Kufans except Hafs |
| 3:37 | كَفَّلَهَا → كَفَلَهَا (and زَكَرِيَّا → زَكَرِيَّاءُ) | Shāṭibiyyah / An-Nashr 2/239 |
| 15:8 | نُنَزِّلُ → تَنَزَّلُ (and الملائكةَ → الملائكةُ) | Shāṭibiyyah / An-Nashr 2/302 |
| 33:68 | كَبِيرًا → كَثِيرًا | An-Nashr 2/348 — Shu'bah anfard with the rest reading "kathīrā" |

### `warsh.diffs.json` — Warsh 'an Nāfi'
Imālah, naql, and madd entries follow Shāṭibiyyah and An-Nashr. See entries' inline notes.

### `qalun.diffs.json` — Qālūn 'an Nāfi'
Same as above.

### `duri-basri.diffs.json` — Ad-Dūrī 'an Abī 'Amr al-Baṣrī
Same as above.

### `albazzi.diffs.json` — Al-Bazzī 'an Ibn Kathīr
Same as above.

## Coverage status

The current dataset is a **starter set** — only the most well-known and unambiguous variants per riwāyah are included. Comprehensive coverage requires either:

1. Importing per-riwāyah Quranic text from [Tanzil.net](https://tanzil.net/download/) and computing diffs programmatically against the Hafs base, then human-reviewing each diff against An-Nashr, OR
2. Importing the open-data table from the [QuranEnc](https://quranenc.com/) project (King Fahd Glorious Qur'an Printing Complex), which provides per-riwāyah text and metadata.

A planned `scripts/build-qiraat-diffs.ts` will automate step 1 once a verified text source for each riwāyah is in place.

## Authenticity policy

- Every entry must trace to one of the primary sources above before being added.
- "Tier 1" riwāyāt (Hafs, Warsh, Qālūn, Ad-Dūrī Baṣrī, Shu'bah, Al-Bazzī) ship in the picker as Verified.
- Other riwāyāt remain "coming soon" until their datasets pass the same review.
- We never present any canonical reading as wrong or inferior — all ten are mutawātir.
