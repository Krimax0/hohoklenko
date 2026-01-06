"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { Rarity } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";

interface RarityRevealProps {
  rarity: Rarity;
  show: boolean;
  onComplete?: () => void;
}

export function RarityReveal({ rarity, show, onComplete }: RarityRevealProps) {
  const [phase, setPhase] = useState<"flash" | "reveal" | "done">("flash");
  const config = RARITY_CONFIG[rarity];

  useEffect(() => {
    if (show) {
      setPhase("flash");
      const timer1 = setTimeout(() => setPhase("reveal"), 300);
      const timer2 = setTimeout(() => {
        setPhase("done");
        onComplete?.();
      }, 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {phase === "flash" && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backgroundColor: config.color }}
          transition={{ duration: 0.15 }}
        />
      )}
      {phase === "reveal" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Radial flash */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${config.glowColor} 0%, transparent 70%)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 1, 0] }}
            transition={{ duration: 1 }}
          />

          {/* Rays */}
          {(rarity === "legendary" || rarity === "mythic") && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(from 0deg, transparent 0deg, ${config.color}40 10deg, transparent 20deg, transparent 180deg, ${config.color}40 190deg, transparent 200deg)`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
