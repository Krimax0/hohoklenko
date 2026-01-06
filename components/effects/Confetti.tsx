"use client";

import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import type { Rarity } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";

interface ConfettiEffectProps {
  trigger: boolean;
  rarity: Rarity;
  onComplete?: () => void;
}

export function ConfettiEffect({ trigger, rarity, onComplete }: ConfettiEffectProps) {
  const config = RARITY_CONFIG[rarity];

  const fireConfetti = useCallback(() => {
    const count = config.confettiCount;
    if (count === 0) {
      onComplete?.();
      return;
    }

    const colors = getConfettiColors(rarity);

    // Different effects based on rarity - Christmas themed!
    if (rarity === "mythic") {
      // MYTHIC: Christmas Miracle - massive celebration!
      const duration = 5000;
      const animationEnd = Date.now() + duration;

      // Snow from top
      const snowFrame = () => {
        confetti({
          particleCount: 3,
          angle: 90,
          spread: 180,
          origin: { x: Math.random(), y: -0.1 },
          colors: ["#ffffff", "#e0f2fe", "#bae6fd"],
          shapes: ["circle"],
          scalar: 0.8,
          gravity: 0.5,
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(snowFrame);
        }
      };
      snowFrame();

      // Side bursts
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors,
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        } else {
          onComplete?.();
        }
      };
      frame();

      // Center explosion
      confetti({
        particleCount: 200,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        colors,
        ticks: 300,
        gravity: 0.5,
        scalar: 1.5,
        shapes: ["star", "circle"],
      });
    } else if (rarity === "legendary") {
      // LEGENDARY: Golden Star shower
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 90,
          spread: 180,
          origin: { x: Math.random(), y: -0.1 },
          colors,
          shapes: ["star"],
          scalar: 2,
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        } else {
          onComplete?.();
        }
      };
      frame();

      // Gold burst
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
        colors,
        shapes: ["star", "circle"],
      });

      // Snowflakes
      confetti({
        particleCount: 50,
        spread: 180,
        origin: { x: 0.5, y: 0.3 },
        colors: ["#ffffff"],
        shapes: ["circle"],
        scalar: 0.7,
        gravity: 0.3,
      });
    } else if (rarity === "epic") {
      // EPIC: Aurora effect with stars
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.6 },
        colors,
        shapes: ["star"],
      });

      // Snow accent
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 120,
          origin: { x: 0.5, y: 0.4 },
          colors: ["#ffffff", "#e0f2fe"],
          shapes: ["circle"],
          scalar: 0.6,
        });
      }, 150);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { x: 0.5, y: 0.5 },
          colors,
        });
        onComplete?.();
      }, 250);
    } else if (rarity === "rare") {
      // RARE: Snowflakes with blue tint
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.5, y: 0.6 },
        colors,
        shapes: ["circle"],
      });

      // Add some white snowflakes
      confetti({
        particleCount: 20,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors: ["#ffffff"],
        shapes: ["circle"],
        scalar: 0.5,
        gravity: 0.4,
      });

      setTimeout(() => onComplete?.(), 1000);
    } else {
      // UNCOMMON: Small celebration with Christmas colors
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { x: 0.5, y: 0.6 },
        colors,
      });
      setTimeout(() => onComplete?.(), 500);
    }
  }, [config.confettiCount, rarity, onComplete]);

  useEffect(() => {
    if (trigger) {
      fireConfetti();
    }
  }, [trigger, fireConfetti]);

  return null;
}

function getConfettiColors(rarity: Rarity): string[] {
  // Christmas themed colors
  switch (rarity) {
    case "mythic":
      return ["#dc2626", "#16a34a", "#fbbf24", "#ffffff", "#f43f5e", "#a855f7"];
    case "legendary":
      return ["#fbbf24", "#f59e0b", "#fcd34d", "#ffffff", "#dc2626"];
    case "epic":
      return ["#a855f7", "#c084fc", "#22d3ee", "#ffffff", "#14b8a6"];
    case "rare":
      return ["#3b82f6", "#60a5fa", "#93c5fd", "#ffffff"];
    case "uncommon":
      return ["#16a34a", "#22c55e", "#4ade80", "#ffffff", "#dc2626"];
    default:
      return ["#a8d5ba", "#ffffff"];
  }
}
