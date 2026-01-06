"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { getSpinCount } from "@/data/players";
import { LoginScreen } from "./LoginScreen";
import { GameScreen } from "./GameScreen";
import { WelcomeScreen } from "./WelcomeScreen";
import { motion, AnimatePresence } from "framer-motion";

type AppScreen = "login" | "welcome" | "game";

export function App() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("login");
  const [showWelcome, setShowWelcome] = useState(false);

  const isAuthenticated = useGameStore((state) => state.isAuthenticated);
  const currentPlayer = useGameStore((state) => state.currentPlayer);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    if (isAuthenticated && currentPlayer) {
      // Check if this is a fresh login (player has all spins remaining)
      const isNewSession = currentPlayer.currentSpinIndex === 0;

      if (isNewSession && !showWelcome) {
        setShowWelcome(true);
        setCurrentScreen("welcome");
      } else if (!showWelcome) {
        setCurrentScreen("game");
      }
    } else {
      setCurrentScreen("login");
      setShowWelcome(false);
    }
  }, [isAuthenticated, currentPlayer, showWelcome]);

  const handleWelcomeContinue = () => {
    setCurrentScreen("game");
  };

  // Loading state
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <motion.div
          className="text-7xl"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 1, repeat: Number.POSITIVE_INFINITY }
          }}
        >
          🎄
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {currentScreen === "login" && (
        <motion.div
          key="login"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <LoginScreen />
        </motion.div>
      )}

      {currentScreen === "welcome" && currentPlayer && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <WelcomeScreen
            playerName={currentPlayer.nickname}
            spinsCount={getSpinCount(currentPlayer.nickname)}
            onContinue={handleWelcomeContinue}
          />
        </motion.div>
      )}

      {currentScreen === "game" && (
        <motion.div
          key="game"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <GameScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
