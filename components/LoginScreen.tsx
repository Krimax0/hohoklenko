"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Snowfall } from "@/components/effects/Snowfall";
import { useGameStore } from "@/stores/gameStore";
import { VALID_NICKNAMES } from "@/data/players";

export function LoginScreen() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const login = useGameStore((state) => state.login);

  useEffect(() => {
    // Animate title on mount
    gsap.fromTo(
      ".login-title",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }
    );

    gsap.fromTo(
      ".login-card",
      { scale: 0, rotation: -10 },
      { scale: 1, rotation: 0, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
    );

    gsap.fromTo(
      ".login-hint",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.8 }
    );

    // Animate decorations
    gsap.fromTo(
      ".decoration",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.5, ease: "back.out(2)" }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedNick = nickname.trim().toUpperCase();

    if (!trimmedNick) {
      setError("Введите никнейм!");
      shakeInput();
      return;
    }

    if (!VALID_NICKNAMES.includes(trimmedNick)) {
      setError("Неверный никнейм! Доступны: KLENKO или HOHOYKS");
      shakeInput();
      return;
    }

    const success = login(trimmedNick);
    if (!success) {
      setError("Ошибка входа!");
      shakeInput();
    }
  };

  const shakeInput = () => {
    setIsShaking(true);
    gsap.to(".login-input", {
      keyframes: [
        { x: -10, duration: 0.08 },
        { x: 10, duration: 0.08 },
        { x: -10, duration: 0.08 },
        { x: 10, duration: 0.08 },
        { x: 0, duration: 0.08 },
      ],
      ease: "power2.out",
      onComplete: () => setIsShaking(false),
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Snowfall */}
      <Snowfall intensity="medium" />

      {/* Christmas lights at top */}
      <div className="absolute top-0 left-0 right-0 flex justify-center gap-4 py-4 z-10">
        {["🔴", "🟡", "🟢", "🔵", "🟣", "🔴", "🟡", "🟢", "🔵", "🟣", "🔴", "🟡"].map((light, i) => (
          <motion.span
            key={i}
            className="decoration text-2xl"
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.15,
            }}
          >
            {light}
          </motion.span>
        ))}
      </div>

      {/* Animated background orbs - Christmas colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ bottom: "10%", right: "10%" }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 decoration">
        <motion.span
          className="text-6xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          🎄
        </motion.span>
      </div>
      <div className="absolute top-20 right-10 decoration">
        <motion.span
          className="text-6xl"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          🎄
        </motion.span>
      </div>
      <div className="absolute bottom-20 left-20 decoration">
        <motion.span
          className="text-4xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          🎁
        </motion.span>
      </div>
      <div className="absolute bottom-20 right-20 decoration">
        <motion.span
          className="text-4xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        >
          🎁
        </motion.span>
      </div>

      {/* Title with Christmas star */}
      <div className="relative z-10">
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <span className="text-5xl">⭐</span>
        </motion.div>
        <motion.h1
          className="login-title text-5xl md:text-7xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-green-400"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          HOHOKLENKO
        </motion.h1>
        <motion.p
          className="text-center text-amber-300/80 text-xl -mt-8 mb-8"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Новогодние Крутки 2025
        </motion.p>
      </div>

      {/* Login Card */}
      <Card className="login-card w-full max-w-md bg-slate-900/70 backdrop-blur-xl border-amber-500/30 z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
            >
              🎅
            </motion.span>
            Вход в Крутки
            <motion.span
              animate={{ rotate: [0, -20, 20, 0] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
            >
              🎄
            </motion.span>
          </CardTitle>
          <CardDescription className="text-amber-200/60">
            Введите ваш никнейм для получения подарков
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                className={`login-input h-14 text-xl text-center bg-white/10 border-amber-500/50 text-white placeholder:text-gray-400 focus:border-amber-400 ${
                  isShaking ? "border-red-500" : ""
                }`}
                placeholder="KLENKO или HOHOYKS"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value.toUpperCase());
                  setError("");
                }}
                maxLength={20}
                autoFocus
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              size="xl"
              className="w-full bg-gradient-to-r from-red-600 via-red-500 to-green-600 hover:from-red-500 hover:via-red-400 hover:to-green-500 text-white font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 active:scale-100 transition-all duration-300"
            >
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎁 ОТКРЫТЬ ПОДАРКИ 🎁
              </motion.span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Hint */}
      <motion.div
        className="login-hint mt-8 text-amber-200/70 text-center z-10"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <p>Выберите получателя подарков:</p>
        <div className="flex gap-4 mt-2">
          <motion.span
            className="px-4 py-2 bg-red-500/20 rounded-full cursor-pointer hover:bg-red-500/40 transition-colors border border-red-500/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setNickname("KLENKO")}
          >
            🎅 KLENKO
          </motion.span>
          <motion.span
            className="px-4 py-2 bg-green-500/20 rounded-full cursor-pointer hover:bg-green-500/40 transition-colors border border-green-500/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setNickname("HOHOYKS")}
          >
            🎄 HOHOYKS
          </motion.span>
        </div>
      </motion.div>

      {/* Bottom decorations */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {["🎄", "⭐", "🎁", "🔔", "🎄"].map((emoji, i) => (
          <motion.span
            key={i}
            className="decoration text-xl opacity-60"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
