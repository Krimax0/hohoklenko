"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { FastForward } from "lucide-react";
import { SpinItemCard } from "./SpinItem";
import { Button } from "@/components/ui/button";
import { useTickSound } from "@/hooks/useTickSound";
import type { ScriptedSpin, SpinResult } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";

interface SpinWheelProps {
  spin: ScriptedSpin;
  isSpinning: boolean;
  onSpinComplete: (result: SpinResult) => void;
  fastMode?: boolean; // Ускоренный режим для авто-крутки
  hellMode?: boolean; // Адский режим для Klenkozarashi
}

const ITEM_WIDTH = 124; // Width of each item (112px w-28) + gap (12px gap-3)
const VISIBLE_ITEMS = 7; // Number of visible items

export function SpinWheel({ spin, isSpinning, onSpinComplete, fastMode = false, hellMode = false }: SpinWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickPositionRef = useRef(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [winnerRevealed, setWinnerRevealed] = useState(false);
  const { playTick } = useTickSound({ volume: 0.4 });

  // Функция для мгновенного завершения
  const skipToEnd = useCallback(() => {
    if (!stripRef.current || winnerRevealed) return;

    // Останавливаем текущую анимацию
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
    }

    // Рассчитываем финальную позицию
    const centerOffset = (VISIBLE_ITEMS / 2) * ITEM_WIDTH - ITEM_WIDTH / 2;
    const winningPosition = spin.winningIndex * ITEM_WIDTH;
    const finalX = -(winningPosition - centerOffset);

    // Мгновенно перемещаем к результату
    gsap.set(stripRef.current, { x: finalX });
    setWinnerRevealed(true);

    // Вызываем завершение
    const winningItem = spin.items[spin.winningIndex];
    onSpinComplete({
      item: winningItem,
      spinIndex: spin.winningIndex,
      timestamp: Date.now(),
    });
  }, [spin, winnerRevealed, onSpinComplete]);

  const startSpin = useCallback(() => {
    if (!stripRef.current || hasSpun) return;

    setHasSpun(true);
    setWinnerRevealed(false);

    const winningItem = spin.items[spin.winningIndex];
    const isEpicDrop = winningItem.rarity === "legendary" || winningItem.rarity === "mythic";

    // Calculate the final position
    const centerOffset = (VISIBLE_ITEMS / 2) * ITEM_WIDTH - ITEM_WIDTH / 2;
    const winningPosition = spin.winningIndex * ITEM_WIDTH;
    const finalX = -(winningPosition - centerOffset);

    // Add some randomness to the final position within the item
    const randomOffset = Math.random() * 40 - 20;

    // Animate using GSAP for more control
    const tl = gsap.timeline({
      onComplete: () => {
        setWinnerRevealed(true);
        timelineRef.current = null;

        onSpinComplete({
          item: winningItem,
          spinIndex: spin.winningIndex,
          timestamp: Date.now(),
        });
      },
    });

    timelineRef.current = tl;

    let totalDuration: number;

    if (fastMode) {
      // Fast mode - simple animation
      totalDuration = 0.8;
      tl.to(stripRef.current, {
        x: finalX + randomOffset,
        duration: totalDuration,
        ease: "power1.out",
      });
    } else if (isEpicDrop) {
      // EPIC animation for legendary/mythic!
      // With 200 items on the strip, we have plenty of room
      const totalDistance = Math.abs(finalX + randomOffset);

      totalDuration = 9; // 9 seconds total

      // Phase 1: VERY FAST spinning with acceleration (7.5 sec)
      tl.to(stripRef.current, {
        x: -totalDistance * 0.85,
        duration: 7.5,
        ease: "power1.in", // Accelerating - gets faster toward the end
      })
      // Phase 2: Dramatic sudden stop (1.5 sec)
      .to(stripRef.current, {
        x: finalX + randomOffset,
        duration: 1.5,
        ease: "power4.out",
      });
    } else {
      // Normal animation
      totalDuration = spin.duration / 1000;
      tl.to(stripRef.current, {
        x: finalX + randomOffset,
        duration: totalDuration,
        ease: "power2.out",
      });
    }

    // Tick sound effect - play when passing each item
    lastTickPositionRef.current = 0;

    const tickInterval = setInterval(() => {
      if (stripRef.current) {
        const currentX = Math.abs(gsap.getProperty(stripRef.current, "x") as number);
        const itemsPassed = Math.floor(currentX / ITEM_WIDTH);

        if (itemsPassed > lastTickPositionRef.current) {
          playTick();
          lastTickPositionRef.current = itemsPassed;
        }
      }
    }, 16); // ~60fps check

    tickIntervalRef.current = tickInterval;
    setTimeout(() => {
      clearInterval(tickInterval);
      tickIntervalRef.current = null;
    }, (totalDuration * 1000) - 50);
  }, [hasSpun, spin, onSpinComplete, fastMode, playTick]);

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
      {/* Gradient overlays for fade effect - только для обычного режима */}
      {!hellMode && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none" />
        </>
      )}

      {/* Center indicator */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 z-20 pointer-events-none">
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent ${hellMode ? "border-t-red-500" : "border-t-yellow-400"}`} />
        <div
          className="h-full w-1"
          style={{
            background: hellMode
              ? `linear-gradient(to bottom, #ef4444, #ef444480, #ef4444)`
              : `linear-gradient(to bottom, ${config.color}, ${config.color}80, ${config.color})`,
            boxShadow: hellMode ? `0 0 20px #ef4444` : `0 0 20px ${config.glowColor}`,
          }}
        />
        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent ${hellMode ? "border-b-red-500" : "border-b-yellow-400"}`} />
      </div>

      {/* Main wheel container */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-2xl ${hellMode ? "bg-red-950/50" : "bg-black/50"} backdrop-blur-sm border ${hellMode ? "border-red-500/30" : "border-white/10"} p-4`}
        style={{
          boxShadow: isSpinning
            ? hellMode
              ? `inset 0 0 50px rgba(239, 68, 68, 0.4)`
              : `inset 0 0 50px ${config.glowColor}40`
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

      {/* Skip button */}
      {isSpinning && !winnerRevealed && !fastMode && (
        <motion.div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={skipToEnd}
            className="px-6 py-2.5 text-sm font-medium border-white/40 text-white/90 bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:border-white/60 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 rounded-lg shadow-lg"
          >
            <FastForward className="w-4 h-4 mr-2" />
            Пропустить
          </Button>
        </motion.div>
      )}
    </div>
  );
}
