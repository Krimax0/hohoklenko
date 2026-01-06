"use client";

import { motion } from "framer-motion";
import type { Rarity } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";

interface GlowEffectProps {
  rarity: Rarity;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function GlowEffect({
  rarity,
  children,
  className = "",
  animate = true,
}: GlowEffectProps) {
  const config = RARITY_CONFIG[rarity];

  return (
    <motion.div
      className={`relative ${className}`}
      animate={
        animate
          ? {
              boxShadow: [
                `0 0 20px ${config.glowColor}`,
                `0 0 40px ${config.glowColor}`,
                `0 0 20px ${config.glowColor}`,
              ],
            }
          : undefined
      }
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      style={{
        borderRadius: "12px",
      }}
    >
      {/* Inner glow layer */}
      <div
        className="absolute inset-0 rounded-xl opacity-50"
        style={{
          background: `radial-gradient(circle at center, ${config.glowColor} 0%, transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
