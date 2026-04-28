"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechResult {
  /** Cumulative transcript across all results (committed + current interim). Resets when restart() is called. */
  transcript: string;
  /** True if at least one final result is included in the cumulative. */
  isFinal: boolean;
  /** Monotonically-incrementing session id; resets on every recognizer restart so consumers
   *  can flush their per-session state (e.g. token cursors) when the engine recycles. */
  sessionId: number;
}

interface UseSpeechOptions {
  lang?: string;
  onResult?: (r: SpeechResult) => void;
  onError?: (err: string) => void;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    [index: number]: { transcript: string; confidence: number };
    length: number;
  }>;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export function useSpeech({ lang = "ar-SA", onResult, onError }: UseSpeechOptions = {}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interim, setInterim] = useState("");
  const [finalText, setFinalText] = useState("");
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied" | "prompt">("unknown");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const restartRef = useRef(false);
  const sessionIdRef = useRef(0);
  // Stash the latest callbacks so we can wire the recognition once and
  // not have to tear it down on every render.
  const onResultRef = useRef<UseSpeechOptions["onResult"]>(onResult);
  const onErrorRef = useRef<UseSpeechOptions["onError"]>(onError);
  onResultRef.current = onResult;
  onErrorRef.current = onError;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const r = new SR();
    r.lang = lang;
    r.continuous = true;
    r.interimResults = true;
    // Multiple alternatives let us salvage matches when the top guess is wrong —
    // very common with Arabic recognition where the first hypothesis often drops a hamzah.
    r.maxAlternatives = 3;
    r.onstart = () => {
      setListening(true);
      setError(null);
    };
    r.onresult = (e) => {
      // Build the *cumulative* transcript across the whole results array.
      // This makes the consumer (the trainer) able to dedupe and stream-match
      // tokens the moment they show up in interim results — no need to wait for `isFinal`.
      let cumulative = "";
      let hasFinal = false;
      let lastInterim = "";
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        // Pick the highest-confidence alternative; fall back to the first.
        let bestAlt = res[0];
        for (let a = 1; a < res.length; a++) {
          if ((res[a]?.confidence ?? 0) > (bestAlt?.confidence ?? 0)) bestAlt = res[a];
        }
        const piece = bestAlt?.transcript ?? "";
        cumulative += piece + " ";
        if (res.isFinal) hasFinal = true;
        else lastInterim = piece;
      }
      cumulative = cumulative.trim();
      if (cumulative) {
        onResultRef.current?.({
          transcript: cumulative,
          isFinal: hasFinal,
          sessionId: sessionIdRef.current,
        });
      }
      // Keep the local state mirrors useful for the mic indicator UI.
      setInterim(lastInterim);
      if (hasFinal) setFinalText(cumulative);
    };
    r.onerror = (e) => {
      setError(e.error);
      onErrorRef.current?.(e.error);
      // Permission errors are terminal — don't auto-restart, surface the state to the UI.
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        restartRef.current = false;
        setPermission("denied");
      }
    };
    r.onend = () => {
      setListening(false);
      if (restartRef.current) {
        // Bump session id so consumers reset stream-matching state.
        sessionIdRef.current += 1;
        // Tight restart loop — Chrome's Web Speech API rate-limits restarts
        // to ~30ms minimum; below that throws InvalidStateError.
        setTimeout(() => {
          if (!restartRef.current) return;
          try {
            r.start();
          } catch {
            setTimeout(() => {
              if (!restartRef.current) return;
              try { r.start(); } catch {
                setTimeout(() => {
                  if (!restartRef.current) return;
                  try { r.start(); } catch { /* give up; user can press start */ }
                }, 200);
              }
            }, 80);
          }
        }, 30);
      }
    };
    recognitionRef.current = r;
    return () => {
      restartRef.current = false;
      try {
        r.abort();
      } catch {
        /* ignore */
      }
    };
  }, [lang]);

  // Mobile browsers (Android Chrome, iOS Safari) require an explicit getUserMedia
  // call from a user-gesture chain to grant mic permission. SpeechRecognition.start()
  // alone often fails silently on mobile. Call this from a click/tap handler before start().
  const requestMic = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermission("denied");
      setError("audio-capture");
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      // Release the stream — SpeechRecognition will open its own internally.
      stream.getTracks().forEach((t) => t.stop());
      setPermission("granted");
      setError(null);
      return true;
    } catch (e) {
      const name = (e as { name?: string })?.name ?? "";
      setPermission(name === "NotAllowedError" ? "denied" : "denied");
      setError(name || "audio-capture");
      return false;
    }
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    restartRef.current = true;
    sessionIdRef.current += 1;
    setFinalText("");
    setInterim("");
    try {
      recognitionRef.current.start();
    } catch {
      /* already started */
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    restartRef.current = false;
    try {
      recognitionRef.current.stop();
    } catch {
      /* ignore */
    }
  }, []);

  const reset = useCallback(() => {
    setFinalText("");
    setInterim("");
    sessionIdRef.current += 1;
  }, []);

  return { supported, listening, error, interim, finalText, permission, requestMic, start, stop, reset };
}

/**
 * Lightweight microphone-volume tracker for the live waveform indicator.
 * Independent of speech recognition — uses Web Audio API analyser.
 */
export function useMicLevel(active: boolean) {
  const [level, setLevel] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      ctxRef.current?.close().catch(() => undefined);
      ctxRef.current = null;
      setLevel(0);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        ctxRef.current = ctx;
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.4;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          setLevel(Math.min(1, rms * 3));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        setLevel(0);
      }
    })();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      ctxRef.current?.close().catch(() => undefined);
      ctxRef.current = null;
    };
  }, [active]);

  return level;
}
