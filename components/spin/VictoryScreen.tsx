"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SpinItemCard } from "./SpinItem";
import { ConfettiEffect } from "@/components/effects/Confetti";
import { ScreenShake } from "@/components/effects/ScreenShake";
import { FloatingEmoji } from "@/components/effects/FloatingEmoji";
import { useGlobalSound } from "@/contexts/SoundContext";
import Lightning from "@/components/Lightning";
import Iridescence from "@/components/Iridescence";
import type { SpinResult } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";

const KrutkaIcon = ({ size = 24 }: { size?: number }) => (
  <Image src="/krutka.png" alt="Крутка" width={size} height={size} className="inline-block" />
);

interface VictoryScreenProps {
  result: SpinResult;
  isVisible: boolean;
  onClose: () => void;
  hasMoreSpins: boolean;
  hellMode?: boolean;
}

export function VictoryScreen({
  result,
  isVisible,
  onClose,
  hasMoreSpins,
  hellMode = false,
}: VictoryScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = RARITY_CONFIG[result.item.rarity];
  const { playRewardSound, stopLoop, isReady } = useGlobalSound();

  // Мемоизируем снежинки чтобы рандом не менялся при ре-рендерах
  const snowflakes = useMemo(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: (i / 20) * 100 + Math.random() * 5 - 2.5,
      delay: Math.random() * 3,
      duration: 6 + Math.random() * 4,
    })),
  []);

  // Play reward sound when screen becomes visible and sounds are loaded
  useEffect(() => {
    if (isVisible && isReady) {
      // Small delay to ensure audio context is ready
      const timer = setTimeout(() => {
        playRewardSound(result.item.rarity);
      }, 50);
      return () => clearTimeout(timer);
    } else if (!isVisible) {
      stopLoop();
    }
  }, [isVisible, isReady, result.item.rarity, playRewardSound, stopLoop]);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      // Animate the victory text
      gsap.fromTo(
        ".victory-title",
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
      );

      gsap.fromTo(
        ".victory-item",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power3.out" }
      );

      gsap.fromTo(
        ".victory-name",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.5 }
      );

      gsap.fromTo(
        ".victory-button",
        { scale: 0 },
        { scale: 1, duration: 0.4, delay: 0.8, ease: "back.out(1.7)" }
      );
    }
  }, [isVisible]);

  const getShakeIntensity = () => {
    switch (result.item.rarity) {
      case "mythic":
        return "extreme";
      case "legendary":
        return "heavy";
      case "epic":
        return "medium";
      case "rare":
        return "light";
      default:
        return "light";
    }
  };

  const getRarityEmoji = () => {
    if (hellMode) {
      switch (result.item.rarity) {
        case "mythic":
          return "👹🔥💀";
        case "legendary":
          return "🔥💀🔥";
        case "epic":
          return "💀🔥💀";
        case "rare":
          return "🔥👻🔥";
        case "uncommon":
          return "👻💀👻";
        default:
          return "🔥";
      }
    }
    switch (result.item.rarity) {
      case "mythic":
        return "🎅✨🎄";
      case "legendary":
        return "⭐🎁⭐";
      case "epic":
        return "❄️🌟❄️";
      case "rare":
        return "🎄⭐🎄";
      case "uncommon":
        return "🎁🔔🎁";
      default:
        return "❄️";
    }
  };

  const getVictoryTitle = () => {
    if (hellMode) {
      switch (result.item.rarity) {
        case "mythic":
          return "ПРОКЛЯТИЕ!";
        case "legendary":
          return "КОШМАР!";
        case "epic":
          return "УЖАС!";
        case "rare":
          return "ТЬМА!";
        case "uncommon":
          return "МРАК!";
        default:
          return "ПЕПЕЛ!";
      }
    }
    switch (result.item.rarity) {
      case "mythic":
        return "ЧУДО!";
      case "legendary":
        return "ЛЕГЕНДА!";
      case "epic":
        return "ВОЛШЕБНО!";
      case "rare":
        return "ОТЛИЧНО!";
      case "uncommon":
        return "ХОРОШО!";
      default:
        return "ПОДАРОК!";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with Christmas/Hell gradient */}
          <motion.div
            className={`absolute inset-0 ${hellMode ? "bg-gradient-to-br from-red-950/95 via-black/95 to-red-950/95" : "bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95"} backdrop-blur-md`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              stopLoop();
              onClose();
            }}
          />

          {/* Falling snowflakes/embers decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {snowflakes.map((flake) => (
              <motion.span
                key={flake.id}
                className="absolute text-2xl"
                style={{ left: `${flake.left}%` }}
                initial={{
                  y: hellMode ? "100vh" : -50,
                  opacity: 0.6,
                  rotate: 0,
                }}
                animate={{
                  y: hellMode ? -50 : "100vh",
                  rotate: 360,
                }}
                transition={{
                  duration: flake.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: flake.delay,
                  ease: "linear",
                }}
              >
                {hellMode ? "🔥" : "❄️"}
              </motion.span>
            ))}
          </div>

          {/* Effects */}
          <ConfettiEffect trigger={isVisible} rarity={result.item.rarity} />
          <ScreenShake
            trigger={isVisible && config.screenShake}
            intensity={getShakeIntensity()}
            duration={0.6}
          />
          {(result.item.rarity === "legendary" || result.item.rarity === "mythic") && (
            <FloatingEmoji emoji={result.item.image} count={15} duration={4} />
          )}

          {/* Lightning effect for legendary/mythic */}
          {(result.item.rarity === "legendary" || result.item.rarity === "mythic") && (
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
              <Lightning
                hue={result.item.rarity === "mythic" ? 340 : 45}
                speed={1.5}
                intensity={1.2}
                size={1}
              />
            </div>
          )}

          {/* Iridescence effect for mythic only */}
          {result.item.rarity === "mythic" && (
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
              <Iridescence
                color={[1, 0.3, 0.5]}
                speed={1.2}
                amplitude={0.3}
                mouseReact={false}
              />
            </div>
          )}

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 p-8 max-w-lg -mt-16"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Victory title */}
            <motion.div
              className="victory-title text-center"
              animate={{
                textShadow: [
                  `0 0 20px ${config.glowColor}`,
                  `0 0 40px ${config.glowColor}`,
                  `0 0 20px ${config.glowColor}`,
                ],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <div className="text-3xl mb-2">{getRarityEmoji()}</div>
              <h1
                className="text-5xl md:text-7xl font-black uppercase"
                style={{ color: config.color }}
              >
                {getVictoryTitle()}
              </h1>
            </motion.div>

            {/* Item display */}
            <div className="victory-item">
              <SpinItemCard item={result.item} isWinner size="lg" />
            </div>

            {/* Item name and description */}
            <div className="victory-name text-center">
              <h2
                className="text-3xl font-bold"
                style={{ color: config.color }}
              >
                {result.item.name}
              </h2>
              <p className={`${hellMode ? "text-red-300/70" : "text-amber-200/70"} text-lg`}>{result.item.description}</p>
            </div>
{/*
             Rarity badge
            <motion.div
              className="px-6 py-2 rounded-full text-white font-bold uppercase tracking-wider flex items-center gap-2"
              style={{
                background: config.bgGradient,
                boxShadow: `0 0 20px ${config.glowColor}`,
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <KrutkaIcon size={20} /> {config.name} <KrutkaIcon size={20} />
            </motion.div>*/}

            {/* Continue button */}
            <motion.div className="victory-button">
              <Button
                size="xl"
                onClick={() => {
                  stopLoop();
                  onClose();
                }}
                className={hellMode
                  ? "bg-gradient-to-r from-red-700 via-red-600 to-orange-600 hover:from-red-600 hover:via-orange-500 hover:to-red-600 text-white font-bold shadow-lg"
                  : hasMoreSpins
                    ? "bg-gradient-to-r from-red-600 via-red-500 to-green-600 hover:from-red-500 hover:via-amber-500 hover:to-green-500 text-white font-bold shadow-lg"
                    : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold shadow-lg"
                }
              >
                {hellMode ? <>Принять судьбу... 💀</> : hasMoreSpins ? <>Отлично! 👍</> : "🎄 ЗАВЕРШИТЬ 🎄"}
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated rays for legendary/mythic */}
          {(result.item.rarity === "legendary" ||
            result.item.rarity === "mythic") && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: hellMode
                  ? `radial-gradient(circle at center, rgba(239, 68, 68, 0.2) 0%, transparent 70%)`
                  : `radial-gradient(circle at center, ${config.glowColor}20 0%, transparent 70%)`,
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          )}

          {/* Corner decorations */}
          <motion.div
            className="absolute top-8 left-8 text-4xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {hellMode ? "🔥" : "🎄"}
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 text-4xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {hellMode ? "🔥" : "🎄"}
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-8 text-3xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            {hellMode ? "💀" : "🎁"}
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-8 text-3xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          >
            {hellMode ? "💀" : "🎁"}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
