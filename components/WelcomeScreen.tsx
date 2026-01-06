"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Snowfall } from "@/components/effects/Snowfall";
import Ballpit from "@/components/Ballpit";

const KrutkaIcon = ({ size = 24 }: { size?: number }) => (
  <Image src="/krutka.png" alt="Крутка" width={size} height={size} className="inline-block" />
);

interface WelcomeScreenProps {
  playerName: string;
  spinsCount: number;
  onContinue: () => void;
}

export function WelcomeScreen({ playerName, spinsCount, onContinue }: WelcomeScreenProps) {
  const [phase, setPhase] = useState<"greeting" | "spins" | "question" | "ready">("greeting");
  const [mounted, setMounted] = useState(false);

  // Отложенный рендеринг тяжёлых компонентов
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Phase 1: Greeting
    const timer1 = setTimeout(() => setPhase("spins"), 1500);
    // Phase 2: Spins count
    const timer2 = setTimeout(() => setPhase("question"), 3500);
    // Phase 3: Question
    const timer3 = setTimeout(() => setPhase("ready"), 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    if (phase === "greeting") {
      gsap.fromTo(
        ".welcome-text",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
    if (phase === "spins") {
      gsap.fromTo(
        ".spins-text",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      // Number animation
      gsap.fromTo(
        ".spins-number",
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: "elastic.out(1, 0.5)" }
      );
    }
    if (phase === "question") {
      gsap.fromTo(
        ".question-text",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
    if (phase === "ready") {
      gsap.fromTo(
        ".ready-button",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Ballpit - шарики падают на игрока (отложенный рендеринг) */}
      {mounted && (
        <div className="absolute inset-0 z-0">
          <Ballpit
            count={150}
            colors={[0xff6b6b, 0x4ecdc4, 0xffeaa7, 0xa29bfe, 0x55efc4, 0xfd79a8]}
            gravity={0.3}
            minSize={0.3}
            maxSize={0.8}
            followCursor={false}
          />
        </div>
      )}

      <Snowfall intensity="heavy" />

      {/* Christmas lights */}
      <div className="absolute top-0 left-0 right-0 flex justify-center gap-4 py-4">
        {["🔴", "🟡", "🟢", "🔵", "🟣", "🔴", "🟡", "🟢", "🔵", "🟣"].map((light, i) => (
          <motion.span
            key={i}
            className="text-3xl"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.1,
            }}
          >
            {light}
          </motion.span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Phase 1: Greeting */}
        <AnimatePresence>
          {phase === "greeting" && (
            <motion.div
              className="welcome-text"
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
            >
              <motion.div
                className="text-6xl md:text-8xl mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                🎅
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                С НОВЫМ ГОДОМ,
              </h1>
              <motion.h2
                className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-amber-400"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                style={{ backgroundSize: "200% 200%" }}
              >
                {playerName}!
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Spins count */}
        <AnimatePresence>
          {phase === "spins" && (
            <motion.div
              className="spins-text"
              exit={{ opacity: 0, y: -50, transition: { duration: 0.3 } }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                ВАМ НАЧИСЛЕНО
              </h2>
              <motion.div
                className="spins-number relative inline-block"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(251, 191, 36, 0.5)",
                    "0 0 60px rgba(251, 191, 36, 0.8)",
                    "0 0 20px rgba(251, 191, 36, 0.5)",
                  ],
                }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                <span className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600">
                  {spinsCount}
                </span>
                <motion.span
                  className="absolute -top-4 -right-8 text-4xl"
                  animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  ✨
                </motion.span>
              </motion.div>
              <h3 className="text-4xl md:text-6xl font-black text-white mt-4 flex items-center justify-center gap-4">
                КРУТОК! <KrutkaIcon size={48} />
              </h3>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3: Question */}
        <AnimatePresence>
          {(phase === "question" || phase === "ready") && (
            <motion.div
              className="question-text"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.div
                className="text-7xl md:text-9xl mb-8"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                🎄
              </motion.div>
              <motion.h1
                className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-green-400 mb-4"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                style={{ backgroundSize: "200% 200%" }}
              >
                РИСКНЁМ?
              </motion.h1>
              <motion.p
                className="text-2xl md:text-3xl text-amber-200/80 mb-8"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Дед Мороз приготовил для вас сюрпризы...
              </motion.p>

              {/* Ready button */}
              {phase === "ready" && (
                <motion.div className="ready-button">
                  <Button
                    size="xl"
                    onClick={onContinue}
                    className="text-2xl md:text-3xl px-12 py-8 bg-gradient-to-r from-red-600 via-red-500 to-green-600 hover:from-red-500 hover:via-amber-500 hover:to-green-500 text-white font-black shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 hover:scale-110 active:scale-100 transition-all duration-300"
                  >
                    <motion.span
                      className="flex items-center gap-4"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <KrutkaIcon size={32} /> ПОЕХАЛИ! <KrutkaIcon size={32} />
                    </motion.span>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corner decorations */}
      <motion.div
        className="absolute bottom-10 left-10 text-6xl"
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        🎁
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-6xl"
        animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
      >
        🎁
      </motion.div>
      <motion.div
        className="absolute top-20 left-10 text-5xl"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute top-20 right-10 text-5xl"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
      >
        ⭐
      </motion.div>

    </div>
  );
}
