"use client";
import { useEffect, useMemo, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Pause, Play, RotateCcw, SkipForward, Square, Eye, Mic } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { TrainerSetup, type TrainerConfig } from "@/components/hifz/trainer-setup";
import { HiddenWord } from "@/components/hifz/hidden-word";
import { MicIndicator } from "@/components/hifz/mic-indicator";
import { SessionReport } from "@/components/hifz/session-report";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSurah, type Ayah } from "@/lib/api/quran";
import { getSurah } from "@/data/surahs";
import { tokenize, normalizeWord } from "@/lib/hifz/normalize";
import { matchWord } from "@/lib/hifz/matcher";
import { useSpeech, useMicLevel } from "@/lib/hifz/useSpeech";
import { useHifz, type SessionWordResult, type HifzSession } from "@/lib/store/hifz-store";
import { toast } from "@/components/ui/toaster";
import { Bismillah } from "@/components/common/bismillah";
import { useT } from "@/lib/i18n/use-locale";

interface FlatWord {
  surah: number;
  ayah: number;
  wordIndex: number;
  text: string;
  normalized: string;
}

type WordStatus = "hidden" | "current" | "revealed" | "hinted";

export default function TrainerPage() {
  return (
    <Suspense fallback={<div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>}>
      <TrainerPageInner />
    </Suspense>
  );
}

function TrainerPageInner() {
  const t = useT();
  const sp = useSearchParams();
  const initial = useMemo<Partial<TrainerConfig>>(() => ({
    surahId: Number(sp.get("surah") ?? 1),
    fromAyah: Number(sp.get("from") ?? 1),
    toAyah: sp.get("to") ? Number(sp.get("to")) : undefined,
  }), [sp]);

  const [phase, setPhase] = useState<"setup" | "loading" | "training" | "report">("setup");
  const [config, setConfig] = useState<TrainerConfig | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [completedSession, setCompletedSession] = useState<HifzSession | null>(null);

  const startSession = (cfg: TrainerConfig) => {
    setConfig(cfg);
    setPhase("loading");
    setError(null);
    fetchSurah(cfg.surahId, "quran-uthmani")
      .then((data) => {
        const range = data.ayahs.filter(
          (a) => a.numberInSurah >= cfg.fromAyah && a.numberInSurah <= cfg.toAyah
        );
        setAyahs(range);
        setPhase("training");
      })
      .catch((e: Error) => {
        setError(e.message);
        setPhase("setup");
        toast(t("trainer.couldNotLoad", { msg: e.message }), "error");
      });
  };

  const onSessionEnd = (s: HifzSession) => {
    setCompletedSession(s);
    setPhase("report");
  };

  const restart = () => {
    setCompletedSession(null);
    if (config) startSession(config);
  };

  const close = () => {
    setCompletedSession(null);
    setAyahs([]);
    setPhase("setup");
  };

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-ink-400 mb-4">
        <Link href="/hifz" className="hover:text-ink-200 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> {t("trainer.crumb.hifz")}
        </Link>
      </nav>

      <PageHeader
        title={t("trainer.title")}
        arabicTitle={t("trainer.arabicTitle")}
        description={t("trainer.description")}
      />

      {phase === "setup" && (
        <>
          <SupportNotice />
          <TrainerSetup initial={initial} onStart={startSession} />
        </>
      )}

      {phase === "loading" && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {phase === "training" && config && ayahs.length > 0 && (
        <TrainerSession config={config} ayahs={ayahs} onEnd={onSessionEnd} />
      )}

      {phase === "report" && completedSession && (
        <SessionReport session={completedSession} onRestart={restart} onClose={close} />
      )}

      {error && phase === "setup" && (
        <p className="mt-4 text-sm text-red-300">{error}</p>
      )}
    </div>
  );
}

function SupportNotice() {
  const t = useT();
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);
  if (supported === null) return null;
  if (supported) {
    return (
      <div className="mb-6 rounded-2xl border border-emerald-glow/20 bg-emerald-glow/5 px-4 py-3 text-sm text-emerald-glow/90">
        {t("trainer.support.ok")}
      </div>
    );
  }
  return (
    <div className="mb-6 rounded-2xl border border-amber-400/25 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">
      {t("trainer.support.unsupported")}
    </div>
  );
}

interface TrainerSessionProps {
  config: TrainerConfig;
  ayahs: Ayah[];
  onEnd: (session: HifzSession) => void;
}

function TrainerSession({ config, ayahs, onEnd }: TrainerSessionProps) {
  const t = useT();
  // Build flat word list
  const words = useMemo<FlatWord[]>(() => {
    const out: FlatWord[] = [];
    for (const a of ayahs) {
      const tokens = a.text.split(/\s+/);
      tokens.forEach((tok, i) => {
        out.push({
          surah: config.surahId,
          ayah: a.numberInSurah,
          wordIndex: i,
          text: tok,
          normalized: normalizeWord(tok),
        });
      });
    }
    return out;
  }, [ayahs, config.surahId]);

  const [statuses, setStatuses] = useState<WordStatus[]>(() => words.map((_, i) => (i === 0 ? "current" : "hidden")));
  const [cursor, setCursor] = useState(0);
  const [results, setResults] = useState<SessionWordResult[]>([]);
  const [paused, setPaused] = useState(false);
  const [showHintLetter, setShowHintLetter] = useState<string | null>(null);
  const wordStartRef = useRef<number>(Date.now());
  const startedAtRef = useRef<number>(Date.now());
  const cursorRef = useRef(0);
  cursorRef.current = cursor;
  const wordsRef = useRef<FlatWord[]>(words);
  wordsRef.current = words;
  const statusesRef = useRef<WordStatus[]>(statuses);
  statusesRef.current = statuses;
  // Stream matching state — tracks how many tokens of the cumulative transcript
  // we've already consumed, plus which speech-recognition session that count belongs to.
  // Reset whenever the recognition engine restarts (new sessionId from useSpeech).
  const tokenCursorRef = useRef(0);
  const speechSessionRef = useRef(0);

  const addSession = useHifz((s) => s.addSession);
  const markMemorized = useHifz((s) => s.markMemorized);
  const bumpToday = useHifz((s) => s.bumpToday);

  // Reset when words change (restart)
  useEffect(() => {
    setStatuses(words.map((_, i) => (i === 0 ? "current" : "hidden")));
    setCursor(0);
    setResults([]);
    setShowHintLetter(null);
    tokenCursorRef.current = 0;
    wordStartRef.current = Date.now();
    startedAtRef.current = Date.now();
  }, [words]);

  // Stream-matching speech handler. Runs on EVERY interim event (not just final),
  // matches tokens that haven't been consumed yet, and advances the reveal cursor
  // word-by-word in real time. The recognition session id from useSpeech tells us
  // when the engine restarted so we flush the per-session token cursor.
  const onResult = useCallback(
    ({ transcript, sessionId }: { transcript: string; isFinal: boolean; sessionId: number }) => {
      if (paused) return;
      if (cursorRef.current >= wordsRef.current.length) return;

      // Engine recycled (e.g. no-speech timeout). Flush token cursor.
      if (sessionId !== speechSessionRef.current) {
        speechSessionRef.current = sessionId;
        tokenCursorRef.current = 0;
      }

      const allTokens = tokenize(transcript);
      let tokenIdx = tokenCursorRef.current;
      // Defensive: cumulative transcript can never shrink, but if it does (engine reset
      // mid-event), don't go off the end.
      if (tokenIdx > allTokens.length) tokenIdx = allTokens.length;

      // Greedy: while we still have unconsumed tokens AND words to match,
      // try to find the current expected word in a small window of upcoming tokens.
      const LOOKAHEAD = 6; // tokens
      const WORD_BURST_CAP = 12; // never advance more than 12 words per single event
      const advances: number[] = []; // indices into wordsRef that we revealed in this pass
      let tokensConsumedTotal = 0;

      while (
        cursorRef.current + advances.length < wordsRef.current.length &&
        tokenIdx + tokensConsumedTotal < allTokens.length &&
        advances.length < WORD_BURST_CAP
      ) {
        const slot = cursorRef.current + advances.length;
        const expected = wordsRef.current[slot].text;
        let matchedAtOffset = -1;
        for (let k = 0; k < LOOKAHEAD && tokenIdx + tokensConsumedTotal + k < allTokens.length; k++) {
          const tok = allTokens[tokenIdx + tokensConsumedTotal + k];
          const r = matchWord(expected, tok, { strict: config.strictness === "strict" });
          if (r.matched) {
            matchedAtOffset = k;
            break;
          }
        }
        if (matchedAtOffset === -1) break;
        // Consume the matched token + any tokens we skipped to get to it.
        tokensConsumedTotal += matchedAtOffset + 1;
        advances.push(slot);
      }

      if (advances.length === 0) return;

      tokenCursorRef.current = tokenIdx + tokensConsumedTotal;
      const elapsed = Date.now() - wordStartRef.current;
      const idx = cursorRef.current;
      const advanceCount = advances.length;

      setStatuses((prev) => {
        const next = [...prev];
        for (let i = 0; i < advanceCount; i++) next[idx + i] = "revealed";
        if (idx + advanceCount < next.length) next[idx + advanceCount] = "current";
        return next;
      });
      setResults((prev) => {
        const out = [...prev];
        for (let i = 0; i < advanceCount; i++) {
          const w = wordsRef.current[idx + i];
          out.push({
            surah: w.surah,
            ayah: w.ayah,
            word: w.text,
            wordIndex: w.wordIndex,
            status:
              i === 0 && statusesRef.current[idx + i] === "hinted"
                ? "correct-after-hint"
                : "correct-first-try",
            msToRecite: i === 0 ? elapsed : undefined,
          });
        }
        return out;
      });
      setCursor((c) => Math.min(c + advanceCount, wordsRef.current.length));
      setShowHintLetter(null);
      wordStartRef.current = Date.now();
    },
    [paused, config.strictness]
  );

  const { supported, listening, start, stop, requestMic, permission, interim, resultCount, error: speechError } = useSpeech({ lang: "ar-SA", onResult });
  const micLevel = useMicLevel(listening && !paused);
  const [hasStarted, setHasStarted] = useState(false);
  const [requesting, setRequesting] = useState(false);

  // Mobile-critical sequence: start() must run *synchronously* inside the click
  // handler so the user-gesture chain isn't broken by an `await`. We kick off
  // the mic-permission request in parallel — the browser shows its native prompt
  // either way, and on Android Chrome `recognition.start()` itself triggers it.
  const handleBegin = useCallback(() => {
    if (requesting) return;
    setRequesting(true);
    setHasStarted(true);
    start();
    requestMic().finally(() => setRequesting(false));
  }, [requestMic, start, requesting]);

  // Stop the recognizer on unmount (no auto-start — mobile browsers require a user gesture).
  useEffect(() => {
    return () => stop();
  }, [stop]);

  // Hint policy timer — polled at 100ms (was 250ms) so the cursor / hint cue
  // doesn't lag behind a fast reciter.
  useEffect(() => {
    if (paused || !hasStarted) return;
    const id = setInterval(() => {
      const idx = cursorRef.current;
      if (idx >= wordsRef.current.length) return;
      const elapsed = (Date.now() - wordStartRef.current) / 1000;
      const word = wordsRef.current[idx];
      const norm = word.normalized;
      const firstLetter = norm[0] ?? "";
      if (elapsed >= config.hintAfterSeconds && elapsed < config.hintAfterSeconds * 2) {
        if (firstLetter && showHintLetter !== firstLetter) setShowHintLetter(firstLetter);
      } else if (elapsed >= config.hintAfterSeconds * 2) {
        // Auto-reveal as hinted
        setStatuses((prev) => {
          const next = [...prev];
          next[idx] = "hinted";
          if (idx + 1 < next.length) next[idx + 1] = "current";
          return next;
        });
        setResults((prev) => [
          ...prev,
          {
            surah: word.surah,
            ayah: word.ayah,
            word: word.text,
            wordIndex: word.wordIndex,
            status: "revealed",
          },
        ]);
        setCursor((c) => Math.min(c + 1, wordsRef.current.length));
        setShowHintLetter(null);
        wordStartRef.current = Date.now();
      }
    }, 100);
    return () => clearInterval(id);
  }, [paused, config.hintAfterSeconds, showHintLetter]);

  // End-of-session detection
  useEffect(() => {
    if (cursor >= words.length && words.length > 0) {
      finishSession("completed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, words.length]);

  const finishSession = (reason: "completed" | "stopped") => {
    stop();
    const sessionEnd = Date.now();
    const elapsedSeconds = Math.round((sessionEnd - startedAtRef.current) / 1000);
    bumpToday(elapsedSeconds);
    const session: HifzSession = {
      id: `s-${startedAtRef.current}`,
      startedAt: startedAtRef.current,
      endedAt: sessionEnd,
      range: { surah: config.surahId, fromAyah: config.fromAyah, toAyah: config.toAyah },
      hideMode: config.hideMode,
      strictness: config.strictness,
      results,
    };
    // Mark fully-correct ayahs as memorized
    const perAyah = new Map<number, { correct: number; total: number }>();
    for (const r of results) {
      const cur = perAyah.get(r.ayah) ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (r.status === "correct-first-try" || r.status === "correct-after-hint") cur.correct += 1;
      perAyah.set(r.ayah, cur);
    }
    perAyah.forEach((v, ayah) => {
      if (v.correct === v.total && v.total > 0) markMemorized(config.surahId, ayah);
    });
    addSession(session);
    if (reason === "completed") toast(t("trainer.sessionDone"), "success");
    onEnd(session);
  };

  const skip = () => {
    const idx = cursorRef.current;
    if (idx >= wordsRef.current.length) return;
    const word = wordsRef.current[idx];
    setStatuses((prev) => {
      const next = [...prev];
      next[idx] = "hinted";
      if (idx + 1 < next.length) next[idx + 1] = "current";
      return next;
    });
    setResults((prev) => [
      ...prev,
      {
        surah: word.surah,
        ayah: word.ayah,
        word: word.text,
        wordIndex: word.wordIndex,
        status: "skipped",
      },
    ]);
    setCursor((c) => Math.min(c + 1, wordsRef.current.length));
    setShowHintLetter(null);
    wordStartRef.current = Date.now();
  };

  const restartAyah = () => {
    const idx = cursorRef.current;
    if (idx === 0) return;
    // Find start of current ayah
    const curAyah = wordsRef.current[Math.min(idx, wordsRef.current.length - 1)].ayah;
    const startIdx = wordsRef.current.findIndex((w) => w.ayah === curAyah);
    if (startIdx < 0) return;
    setStatuses((prev) => {
      const next = [...prev];
      for (let i = startIdx; i < next.length; i++) next[i] = i === startIdx ? "current" : "hidden";
      return next;
    });
    setResults((prev) => prev.filter((r) => r.ayah < curAyah));
    setCursor(startIdx);
    setShowHintLetter(null);
    wordStartRef.current = Date.now();
  };

  // Render words grouped by ayah
  const ayahGroups = useMemo(() => {
    const map = new Map<number, { indices: number[] }>();
    words.forEach((w, i) => {
      const g = map.get(w.ayah) ?? { indices: [] };
      g.indices.push(i);
      map.set(w.ayah, g);
    });
    return Array.from(map.entries()).map(([ayah, g]) => ({ ayah, indices: g.indices }));
  }, [words]);

  const surah = getSurah(config.surahId);

  const progress = words.length === 0 ? 0 : (cursor / words.length) * 100;

  return (
    <div className="space-y-5">
      {/* Live status bar — mic gets its own row on mobile, controls below as a 4-button row */}
      <div className="space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:gap-3 sm:flex-wrap">
        <MicIndicator active={listening && !paused} level={micLevel} className="w-full sm:flex-1 sm:min-w-0" />
        <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-2">
          <Button
            variant={!hasStarted || paused ? "emerald" : "glass"}
            size="default"
            onClick={() => {
              if (!hasStarted) {
                handleBegin();
                return;
              }
              if (paused) {
                start();
                setPaused(false);
              } else {
                stop();
                setPaused(true);
              }
            }}
            disabled={!supported || requesting}
            aria-label={!hasStarted ? t("trainer.beginRecit") : paused ? t("action.resume") : t("action.pause")}
            className="w-full sm:w-auto px-2 sm:px-4"
          >
            {!hasStarted ? <Mic className="h-4 w-4" /> : paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            <span className="hidden sm:inline">{!hasStarted ? (requesting ? t("action.requesting") : t("action.begin")) : paused ? t("action.resume") : t("action.pause")}</span>
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={skip}
            aria-label={t("trainer.skipWord")}
            className="w-full sm:w-auto px-2 sm:px-4"
          >
            <SkipForward className="h-4 w-4 rtl:rotate-180" />
            <span className="hidden sm:inline">{t("action.skip")}</span>
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={restartAyah}
            aria-label={t("trainer.restartAyah")}
            className="w-full sm:w-auto px-2 sm:px-4"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">{t("action.restart")}</span>
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={() => finishSession("stopped")}
            aria-label={t("trainer.endSession")}
            className="w-full sm:w-auto px-2 sm:px-4"
          >
            <Square className="h-4 w-4" />
            <span className="hidden sm:inline">{t("action.end")}</span>
          </Button>
        </div>
      </div>

      {/* Progress + hint */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-glow to-emerald rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-ink-400 tabular-nums">{cursor} / {words.length}</p>
      </div>

      <AnimatePresence>
        {showHintLetter && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-400/10 border border-gold-400/30 text-sm text-gold-400"
          >
            <Eye className="h-3.5 w-3.5" /> {t("trainer.hint.label")} <span dir="rtl" lang="ar" className="font-arabic text-lg">{showHintLetter}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live recognition feedback — proves the engine is hearing you. */}
      {hasStarted && (
        <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-ink-500">
              {listening ? t("trainer.live.listening") : t("trainer.live.idle")} ·{" "}
              {t("trainer.live.recognized", {
                n: resultCount,
                label: resultCount === 1 ? t("trainer.live.phrase") : t("trainer.live.phrases"),
              })}
            </span>
            {!listening && hasStarted && (
              <button
                type="button"
                onClick={() => start()}
                className="text-[10px] uppercase tracking-wider text-emerald-glow hover:text-emerald-glow/80"
              >
                {t("action.restartMic")}
              </button>
            )}
          </div>
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-lg leading-relaxed text-ink-100 min-h-[1.6em] text-right"
          >
            {interim || (
              <span className="text-ink-500 text-sm font-sans">
                {t("trainer.live.placeholder")}
              </span>
            )}
          </p>
        </div>
      )}

      {!supported && (
        <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">
          {t("trainer.notSupported")}
        </div>
      )}

      {supported && !hasStarted && (
        <div className="rounded-2xl border border-emerald-glow/25 bg-emerald-glow/5 px-4 py-3 text-sm text-emerald-glow/90 flex items-center gap-3">
          <Mic className="h-4 w-4 shrink-0" />
          <span>{t("trainer.beginHint")}</span>
        </div>
      )}

      {permission === "denied" && (
        <div className="rounded-2xl border border-red-400/25 bg-red-400/5 px-4 py-3 text-sm text-red-300">
          {t("trainer.permissionDenied")}
        </div>
      )}

      {speechError && hasStarted && permission !== "denied" && (
        <p className="text-xs text-amber-300">{t("trainer.speechError", { err: speechError })}</p>
      )}

      {/* Hidden ayah view */}
      <div className="glass-strong rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-[0.5] pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-gold-400/80">{surah?.transliteration}</p>
              <p className="text-ink-400 text-sm">{t("trainer.ayatRange", { from: config.fromAyah, to: config.toAyah })}</p>
            </div>
            <p dir="rtl" lang="ar" className="font-arabic text-3xl gold-text">{surah?.name}</p>
          </div>

          {config.surahId !== 1 && config.surahId !== 9 && config.fromAyah === 1 && <Bismillah />}

          <div dir="rtl" lang="ar" className="font-arabic text-3xl md:text-4xl leading-[2.4] text-balance">
            {ayahGroups.map(({ ayah, indices }) => {
              return (
                <span key={ayah} className="inline">
                  {indices.map((i) => (
                    <HiddenWord
                      key={i}
                      text={words[i].text}
                      hideMode={config.hideMode}
                      status={statuses[i]}
                    />
                  ))}
                  <span className="ayah-number mx-2">{ayah}</span>{" "}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
