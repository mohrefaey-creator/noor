// Build-time script: for each Qira'at diff entry, look up the actual word position
// in the Quran.com word data by MATCHING the Arabic text (since DB position numbering
// can include sub-glyphs that don't 1:1 map to whitespace-tokenized words).
// Then query the SQLite ayahinfo DB for the precise pixel box at that position
// and write a small JSON for the client overlay to consume.
//
// Run:  node scripts/extract-word-coords.mjs

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const TARGET_WIDTH = 1024;
const ZIP_URL = `https://files.quran.app/hafs/madani/databases/ayahinfo/ayahinfo_${TARGET_WIDTH}.zip`;
const TMP_DIR = path.join(ROOT, ".cache");
const ZIP_PATH = path.join(TMP_DIR, `ayahinfo_${TARGET_WIDTH}.zip`);

const DIFF_FILES = [
  "warsh.diffs.json",
  "shubah.diffs.json",
  "qalun.diffs.json",
  "duri-basri.diffs.json",
  "albazzi.diffs.json",
];

const log = (...a) => console.log("[extract-coords]", ...a);

// Strip Arabic tashkeel + tatweel + alif/ya variants for fuzzy matching.
// Handles dagger alif by converting it to a regular alif before stripping marks.
function normalize(s) {
  if (!s) return "";
  let out = s.normalize("NFC");
  out = out.replace(/ٰ/g, "ا"); // dagger alif → alif (BEFORE stripping)
  out = out.replace(/[ً-ٟۖ-ۭ﻿]/g, ""); // tashkeel + Quranic marks + BOM
  out = out.replace(/ـ/g, ""); // tatweel
  out = out.replace(/[آأإٱ]/g, "ا"); // alif variants → alif
  out = out.replace(/ى/g, "ي"); // alif maqsura → ya
  out = out.replace(/ؤ/g, "و"); // hamza on waw → waw
  out = out.replace(/ئ/g, "ي"); // hamza on ya → ya
  out = out.replace(/ة/g, "ه"); // ta marbuta → ha
  out = out.replace(/\s+/g, "").trim();
  return out;
}

function normalize_unused(s) {
  return (s || "")
    .normalize("NFC")
    .replace(/[ً-ٰٟ﻿]/g, "")
    .replace(/ـ/g, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, "")
    .trim();
}

async function ensureDb() {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  if (!fs.existsSync(ZIP_PATH)) {
    log("downloading", ZIP_URL);
    const res = await fetch(ZIP_URL);
    if (!res.ok) throw new Error(`download failed: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(ZIP_PATH, buf);
    log("downloaded", buf.length, "bytes");
  }
  const dbPath = path.join(TMP_DIR, `ayahinfo_${TARGET_WIDTH}.db`);
  if (!fs.existsSync(dbPath)) {
    log("unzipping…");
    execSync(`unzip -o "${ZIP_PATH}" -d "${TMP_DIR}"`, { stdio: "inherit" });
  }
  return dbPath;
}

const apiCache = new Map();
async function fetchVerseWords(verseKey) {
  if (apiCache.has(verseKey)) return apiCache.get(verseKey);
  const url = `https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=text_uthmani,position,line_number,page_number,char_type_name`;
  const res = await fetch(url, { headers: { "User-Agent": "noor-extract/1.0" } });
  if (!res.ok) throw new Error(`Quran API ${res.status} for ${verseKey}`);
  const j = await res.json();
  // Words include verse-end markers (`char_type_name === 'end'`); keep only word entries
  const words = (j.verse?.words ?? []).filter((w) => w.char_type_name === "word");
  apiCache.set(verseKey, words);
  return words;
}

function findApiWordIndex(words, targetText) {
  const target = normalize(targetText);
  if (!target) return -1;
  // Exact normalized match first
  let idx = words.findIndex((w) => normalize(w.text_uthmani) === target);
  if (idx >= 0) return idx;
  // Substring fallback (handles cases where the diff uses a slightly different form)
  idx = words.findIndex((w) => {
    const n = normalize(w.text_uthmani);
    return n.includes(target) || target.includes(n);
  });
  return idx;
}

async function main() {
  const dbPath = await ensureDb();
  log("opening", dbPath);
  const SQL = await initSqlJs();
  const db = new SQL.Database(fs.readFileSync(dbPath));

  // Build the wanted set: every (surah, ayah, hafsText, wordIndex_inDiffJson)
  const wanted = [];
  const wantedKeys = new Set();
  for (const f of DIFF_FILES) {
    const p = path.join(ROOT, "src/data/qiraat", f);
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    for (const entry of data) {
      for (const d of entry.diffs) {
        const k = `${entry.surah}:${entry.ayah}:${normalize(d.hafs)}`;
        if (!wantedKeys.has(k)) {
          wantedKeys.add(k);
          wanted.push({
            surah: entry.surah,
            ayah: entry.ayah,
            wordIndex: d.wordIndex,
            hafs: d.hafs,
          });
        }
      }
    }
  }
  log("looking up", wanted.length, "unique entries");

  const out = {};
  const corrections = [];
  for (const w of wanted) {
    const verseKey = `${w.surah}:${w.ayah}`;
    let apiWords;
    try {
      apiWords = await fetchVerseWords(verseKey);
    } catch (e) {
      log(`SKIP ${verseKey}: API error`, e.message);
      continue;
    }
    if (!apiWords || apiWords.length === 0) {
      log(`SKIP ${verseKey}: no API words`);
      continue;
    }
    // Resolve the *real* word index by matching the hafs text
    const matchedApiIdx = findApiWordIndex(apiWords, w.hafs);
    if (matchedApiIdx < 0) {
      log(
        `WARN ${verseKey}: could not match hafs "${w.hafs}" against [${apiWords.map((x) => x.text_uthmani).join(" | ")}]`
      );
      continue;
    }
    const dbPosition = apiWords[matchedApiIdx].position; // Quran.com positions are 1-based, matches DB
    if (matchedApiIdx !== w.wordIndex) {
      corrections.push({
        verse: verseKey,
        hafs: w.hafs,
        was: w.wordIndex,
        now: matchedApiIdx,
        dbPosition,
      });
    }

    // Query the DB for that exact position
    const stmt = db.prepare(
      `SELECT page_number, line_number, min_x, min_y, max_x, max_y FROM glyphs WHERE sura_number=? AND ayah_number=? AND position=?`
    );
    stmt.bind([w.surah, w.ayah, dbPosition]);
    if (!stmt.step()) {
      stmt.free();
      log(`MISS ${verseKey} pos ${dbPosition}: no DB row`);
      continue;
    }
    const row = stmt.getAsObject();
    stmt.free();

    // Key the output by the ORIGINAL wordIndex from the diff JSON so the client
    // doesn't need to know about DB position numbering.
    const outKey = `${w.surah}:${w.ayah}:${w.wordIndex}`;
    out[outKey] = {
      page: row.page_number,
      line: row.line_number,
      x: row.min_x,
      y: row.min_y,
      w: row.max_x - row.min_x,
      h: row.max_y - row.min_y,
      apiPosition: dbPosition,
      hafs: w.hafs,
    };
  }

  log("extracted", Object.keys(out).length, "entries");
  if (corrections.length > 0) {
    log("\n=== Word-index corrections (diff JSON had wrong wordIndex) ===");
    for (const c of corrections) {
      log(`  ${c.verse} hafs="${c.hafs}":  wordIndex ${c.was} → ${c.now}  (DB position ${c.dbPosition})`);
    }
    log("");
  }

  const outPath = path.join(ROOT, "src/data/qiraat/word-coords.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify({ width: TARGET_WIDTH, coords: out }, null, 2) + "\n"
  );
  log("wrote", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
