"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import type { Rarity } from "@/types/spin";

const BASE_SOUND = "/sounds/success-jingle.wav";

interface SoundLayer {
  src: string;
  volume: number;
  delay?: number;
}

interface RaritySoundConfig {
  baseVolume: number;
  layers: SoundLayer[];
  loop?: {
    src: string;
    volume: number;
  };
}

const RARITY_SOUNDS: Record<Rarity, RaritySoundConfig> = {
  common: {
    baseVolume: 0.35,
    layers: [],
  },
  uncommon: {
    baseVolume: 0.4,
    layers: [
      { src: "/sounds/level-up.wav", volume: 0.2, delay: 100 },
    ],
  },
  rare: {
    baseVolume: 0.4,
    layers: [
      { src: "/sounds/game-reward.wav", volume: 0.3, delay: 50 },
    ],
  },
  epic: {
    baseVolume: 0.4,
    layers: [
      { src: "/sounds/game-reward.wav", volume: 0.4, delay: 50 },
      { src: "/sounds/level-up.wav", volume: 0.25, delay: 200 },
    ],
  },
  legendary: {
    baseVolume: 0.4,
    layers: [
      { src: "/sounds/legendary-loot.wav", volume: 0.5, delay: 0 },
      { src: "/sounds/game-reward.wav", volume: 0.3, delay: 100 },
    ],
    loop: {
      src: "/sounds/electric-zap-loop.wav",
      volume: 0.12,
    },
  },
  mythic: {
    baseVolume: 0.4,
    layers: [
      { src: "/sounds/legendary-loot.wav", volume: 0.6, delay: 0 },
      { src: "/sounds/game-reward.wav", volume: 0.35, delay: 100 },
      { src: "/sounds/level-up.wav", volume: 0.3, delay: 300 },
    ],
    loop: {
      src: "/sounds/electric-zap-loop.wav",
      volume: 0.15,
    },
  },
  divine: {
    baseVolume: 0.5,
    layers: [
      { src: "/sounds/legendary-loot.wav", volume: 0.7, delay: 0 },
      { src: "/sounds/game-reward.wav", volume: 0.4, delay: 100 },
      { src: "/sounds/level-up.wav", volume: 0.35, delay: 200 },
      { src: "/sounds/level-up.wav", volume: 0.3, delay: 400 },
    ],
    loop: {
      src: "/sounds/electric-zap-loop.wav",
      volume: 0.2,
    },
  },
};

export function useRewardSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const loopSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const loopGainRef = useRef<GainNode | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSounds = async () => {
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const soundPaths = new Set<string>();
      soundPaths.add(BASE_SOUND);

      Object.values(RARITY_SOUNDS).forEach((config) => {
        config.layers.forEach((layer) => soundPaths.add(layer.src));
        if (config.loop) {
          soundPaths.add(config.loop.src);
        }
      });

      for (const path of soundPaths) {
        try {
          const response = await fetch(path);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          const buffer = await ctx.decodeAudioData(arrayBuffer);
          buffersRef.current.set(path, buffer);
        } catch (err) {
          console.error(`Failed to load sound: ${path}`, err);
        }
      }

      setIsReady(true);
    };

    loadSounds();

    return () => {
      stopLoop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = useCallback(async (path: string, volume: number, delay = 0) => {
    const ctx = audioContextRef.current;
    const buffer = buffersRef.current.get(path);
    if (!ctx || !buffer) {
      console.warn(`Cannot play sound: ${path}, ctx: ${!!ctx}, buffer: ${!!buffer}`);
      return;
    }

    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const play = () => {
      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();

      source.buffer = buffer;
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start(0);
    };

    if (delay > 0) {
      setTimeout(play, delay);
    } else {
      play();
    }
  }, []);

  const startLoop = useCallback(async (path: string, volume: number) => {
    const ctx = audioContextRef.current;
    const buffer = buffersRef.current.get(path);
    if (!ctx || !buffer) {
      console.warn(`Cannot start loop: ${path}, ctx: ${!!ctx}, buffer: ${!!buffer}`);
      return;
    }

    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    // Stop existing loop immediately (no fade)
    if (loopSourceRef.current) {
      try {
        loopSourceRef.current.stop();
      } catch {}
    }

    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();

    source.buffer = buffer;
    source.loop = true;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.5);

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);

    loopSourceRef.current = source;
    loopGainRef.current = gainNode;
  }, []);

  const stopLoop = useCallback(() => {
    const ctx = audioContextRef.current;

    if (loopGainRef.current && ctx) {
      loopGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    }

    setTimeout(() => {
      if (loopSourceRef.current) {
        try {
          loopSourceRef.current.stop();
        } catch {}
        loopSourceRef.current = null;
      }
      loopGainRef.current = null;
    }, 300);
  }, []);

  const playRewardSound = useCallback(async (rarity: Rarity) => {
    const config = RARITY_SOUNDS[rarity];

    // Play base sound
    await playSound(BASE_SOUND, config.baseVolume);

    // Play additional layers
    config.layers.forEach((layer) => {
      playSound(layer.src, layer.volume, layer.delay);
    });

    // Start loop if configured
    if (config.loop) {
      await startLoop(config.loop.src, config.loop.volume);
    }
  }, [playSound, startLoop]);

  return { playRewardSound, stopLoop, isReady };
}
