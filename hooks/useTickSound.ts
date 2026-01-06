"use client";

import { useRef, useCallback, useEffect } from "react";

interface TickSoundOptions {
  volume?: number;
  src?: string;
}

export function useTickSound(options: TickSoundOptions = {}) {
  const { volume = 0.3, src = "/sounds/tick.wav" } = options;

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const ctx = new AudioContext();
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await ctx.decodeAudioData(arrayBuffer);

        audioContextRef.current = ctx;
        audioBufferRef.current = buffer;
      } catch (err) {
        console.error("Failed to load tick sound:", err);
      }
    };

    loadAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [src]);

  const playTick = useCallback(() => {
    if (!audioContextRef.current || !audioBufferRef.current) return;

    const ctx = audioContextRef.current;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();

    source.buffer = audioBufferRef.current;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);
  }, [volume]);

  return { playTick };
}
