"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VOLUME = 0.07;
const CROSSFADE_DURATION = 0.04;

export function SoundButton() {
  const [isMuted, setIsMuted] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentGainRef = useRef<GainNode | null>(null);
  const nextSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const scheduledTimeRef = useRef(0);

  const scheduleNextLoop = useCallback(() => {
    if (!audioContextRef.current || !audioBufferRef.current || !isPlayingRef.current) return;

    const ctx = audioContextRef.current;
    const buffer = audioBufferRef.current;
    const duration = buffer.duration;
    const now = ctx.currentTime;
    const fadeStart = scheduledTimeRef.current + duration - CROSSFADE_DURATION;
    const nextStart = scheduledTimeRef.current + duration - CROSSFADE_DURATION;

    // Create next source and gain
    const nextSource = ctx.createBufferSource();
    const nextGain = ctx.createGain();
    nextSource.buffer = buffer;
    nextSource.connect(nextGain);
    nextGain.connect(ctx.destination);

    // Fade out current
    if (currentGainRef.current) {
      currentGainRef.current.gain.setValueAtTime(VOLUME, fadeStart);
      currentGainRef.current.gain.linearRampToValueAtTime(0, fadeStart + CROSSFADE_DURATION);
    }

    // Fade in next
    nextGain.gain.setValueAtTime(0, nextStart);
    nextGain.gain.linearRampToValueAtTime(VOLUME, nextStart + CROSSFADE_DURATION);

    nextSource.start(nextStart);
    scheduledTimeRef.current = nextStart;

    // Swap references
    nextSourceRef.current = nextSource;
    nextGainRef.current = nextGain;

    // Schedule cleanup and next iteration
    const timeUntilSwap = (nextStart + CROSSFADE_DURATION - now) * 1000;
    setTimeout(() => {
      if (!isPlayingRef.current) return;

      // Clean up old source
      if (currentSourceRef.current) {
        try {
          currentSourceRef.current.stop();
        } catch {}
      }

      // Move next to current
      currentSourceRef.current = nextSourceRef.current;
      currentGainRef.current = nextGainRef.current;
      nextSourceRef.current = null;
      nextGainRef.current = null;

      // Schedule the next one
      scheduleNextLoop();
    }, timeUntilSwap);
  }, []);

  useEffect(() => {
    // Load audio buffer
    const loadAudio = async () => {
      try {
        const response = await fetch("/music/jungle-shake-loop.wav");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const ctx = new AudioContext();
        audioBufferRef.current = await ctx.decodeAudioData(arrayBuffer);
        audioContextRef.current = ctx;
      } catch (err) {
        console.error("Failed to load music audio:", err);
      }
    };

    loadAudio();

    return () => {
      isPlayingRef.current = false;
      if (currentSourceRef.current) {
        try { currentSourceRef.current.stop(); } catch {}
      }
      if (nextSourceRef.current) {
        try { nextSourceRef.current.stop(); } catch {}
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startPlayback = useCallback(() => {
    if (!audioContextRef.current || !audioBufferRef.current) return;

    const ctx = audioContextRef.current;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    isPlayingRef.current = true;

    // Start first source
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = audioBufferRef.current;
    source.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(VOLUME, ctx.currentTime);

    source.start(0);
    scheduledTimeRef.current = ctx.currentTime;
    currentSourceRef.current = source;
    currentGainRef.current = gain;

    // Schedule crossfade to next loop
    const timeUntilCrossfade = (audioBufferRef.current.duration - CROSSFADE_DURATION) * 1000;
    setTimeout(() => {
      if (isPlayingRef.current) {
        scheduleNextLoop();
      }
    }, timeUntilCrossfade);
  }, [scheduleNextLoop]);

  const stopPlayback = useCallback(() => {
    isPlayingRef.current = false;

    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch {}
      currentSourceRef.current = null;
    }
    if (nextSourceRef.current) {
      try { nextSourceRef.current.stop(); } catch {}
      nextSourceRef.current = null;
    }
    currentGainRef.current = null;
    nextGainRef.current = null;
  }, []);

  const toggleSound = () => {
    if (isMuted) {
      startPlayback();
    } else {
      stopPlayback();
    }
    setIsMuted(!isMuted);
    setShowHint(false);
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex items-center gap-3">
      {/* Pulsing hint */}
      <AnimatePresence>
        {showHint && isMuted && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="relative"
          >
            <motion.div
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full shadow-lg whitespace-nowrap"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0 0 rgba(251, 191, 36, 0.7)",
                  "0 0 0 10px rgba(251, 191, 36, 0)",
                  "0 0 0 0 rgba(251, 191, 36, 0)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Включи музыку!
            </motion.div>
            {/* Arrow pointing to button */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-orange-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound button */}
      <motion.button
        onClick={toggleSound}
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl hover:bg-white/20 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={showHint && isMuted ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 0.8,
          repeat: showHint && isMuted ? Infinity : 0,
        }}
        title={isMuted ? "Включить звук" : "Выключить звук"}
      >
        {isMuted ? "🔇" : "🔊"}
      </motion.button>
    </div>
  );
}
