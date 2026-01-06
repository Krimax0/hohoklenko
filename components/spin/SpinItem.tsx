"use client";

import { motion } from "framer-motion";
import type { SpinItem as SpinItemType } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";
import { cn } from "@/lib/utils";

interface SpinItemProps {
  item: SpinItemType;
  isWinner?: boolean;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export function SpinItemCard({
  item,
  isWinner = false,
  size = "md",
  showDetails = false,
}: SpinItemProps) {
  const config = RARITY_CONFIG[item.rarity];

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36",
  };

  const emojiSizes = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-5xl",
  };

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 overflow-hidden",
        sizeClasses[size],
        isWinner && "ring-4 ring-white"
      )}
      style={{
        background: config.bgGradient,
        borderColor: config.borderColor,
        boxShadow: isWinner
          ? `0 0 30px ${config.glowColor}, 0 0 60px ${config.glowColor}`
          : `0 0 10px ${config.glowColor}`,
      }}
      animate={
        isWinner
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                `0 0 30px ${config.glowColor}`,
                `0 0 60px ${config.glowColor}`,
                `0 0 30px ${config.glowColor}`,
              ],
            }
          : undefined
      }
      transition={{
        duration: 0.8,
        repeat: isWinner ? Number.POSITIVE_INFINITY : 0,
        ease: "easeInOut",
      }}
    >
      {/* Shine effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, transparent 100%)",
        }}
      />

      {/* Emoji/Image */}
      <span className={cn(emojiSizes[size], "relative z-10 drop-shadow-lg")}>
        {item.image}
      </span>

      {/* Rarity indicator */}
      <div
        className="absolute bottom-1 left-1 right-1 text-center text-[10px] font-bold uppercase tracking-wider py-0.5 rounded bg-black/30"
        style={{ color: config.color }}
      >
        {config.name}
      </div>

      {showDetails && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-2 opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-white text-xs font-bold text-center">
            {item.name}
          </span>
          <span className="text-gray-300 text-[10px] text-center mt-1">
            {item.description}
          </span>
        </div>
      )}
    </motion.div>
  );
}
