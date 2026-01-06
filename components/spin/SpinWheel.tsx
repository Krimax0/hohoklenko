"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { SpinItemCard } from "./SpinItem";
import type { ScriptedSpin, SpinItem, SpinResult } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";

interface SpinWheelProps {
  spin: ScriptedSpin;
  isSpinning: boolean;
  onSpinComplete: (result: SpinResult) => void;
}

const ITEM_WIDTH = 124; // Width of each item (112px w-28) + gap (12px gap-3)
const VISIBLE_ITEMS = 7; // Number of visible items

export function SpinWheel({ spin, isSpinning, onSpinComplete }: SpinWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [winnerRevealed, setWinnerRevealed] = useState(false);

  const startSpin = useCallback(() => {
    if (!stripRef.current || hasSpun) return;

    setHasSpun(true);
    setWinnerRevealed(false);

    // Calculate the final position
    // We want the winning item to be in the center
    const centerOffset = (VISIBLE_ITEMS / 2) * ITEM_WIDTH - ITEM_WIDTH / 2;
    const winningPosition = spin.winningIndex * ITEM_WIDTH;
    const finalX = -(winningPosition - centerOffset);

    // Add some randomness to the final position within the item
    const randomOffset = Math.random() * 40 - 20; // -20 to +20 pixels

    // Animate using GSAP for more control
    const tl = gsap.timeline({
      onComplete: () => {
        setWinnerRevealed(true);

        // Trigger completion with the winning item
        const winningItem = spin.items[spin.winningIndex];
        onSpinComplete({
          item: winningItem,
          spinIndex: spin.winningIndex,
          timestamp: Date.now(),
        });
      },
    });

    // Custom easing that feels like a real spin
    tl.to(stripRef.current, {
      x: finalX + randomOffset,
      duration: spin.duration / 1000,
      ease: "power2.out",
    });

    // Add tick sounds effect by pulsing opacity
    const tickInterval = setInterval(() => {
      if (stripRef.current) {
        gsap.to(stripRef.current, {
          opacity: 0.95,
          duration: 0.05,
          yoyo: true,
          repeat: 1,
        });
      }
    }, 80);

    setTimeout(() => clearInterval(tickInterval), spin.duration - 500);
  }, [hasSpun, spin, onSpinComplete]);

  useEffect(() => {
    if (isSpinning && !hasSpun) {
      // Small delay before starting
      const timer = setTimeout(startSpin, 100);
      return () => clearTimeout(timer);
    }
  }, [isSpinning, hasSpun, startSpin]);

  // Reset when isSpinning becomes false (new spin ready)
  useEffect(() => {
    if (!isSpinning) {
      setHasSpun(false);
      setWinnerRevealed(false);
      if (stripRef.current) {
        gsap.set(stripRef.current, { x: 0 });
      }
    }
  }, [isSpinning]);

  const winningItem = spin.items[spin.winningIndex];
  const config = RARITY_CONFIG[winningItem.rarity];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none" />

      {/* Center indicator */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 z-20 pointer-events-none">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-yellow-400" />
        <div
          className="h-full w-1"
          style={{
            background: `linear-gradient(to bottom, ${config.color}, ${config.color}80, ${config.color})`,
            boxShadow: `0 0 20px ${config.glowColor}`,
          }}
        />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-yellow-400" />
      </div>

      {/* Main wheel container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 p-4"
        style={{
          boxShadow: isSpinning
            ? `inset 0 0 50px ${config.glowColor}40`
            : "none",
        }}
      >
        {/* Items strip */}
        <div
          ref={stripRef}
          className="flex gap-3"
          style={{
            width: `${spin.items.length * ITEM_WIDTH}px`,
          }}
        >
          {spin.items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex-shrink-0">
              <SpinItemCard
                item={item}
                isWinner={winnerRevealed && index === spin.winningIndex}
                size="md"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Spinning indicator */}
      {isSpinning && !winnerRevealed && (
        <motion.div
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white font-bold"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
        >
          КРУТИТСЯ...
        </motion.div>
      )}
    </div>
  );
}
