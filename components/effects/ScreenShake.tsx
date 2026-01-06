"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ScreenShakeProps {
  trigger: boolean;
  intensity?: "light" | "medium" | "heavy" | "extreme";
  duration?: number;
}

export function ScreenShake({
  trigger,
  intensity = "medium",
  duration = 0.5,
}: ScreenShakeProps) {
  const hasShaken = useRef(false);

  useEffect(() => {
    if (trigger && !hasShaken.current) {
      hasShaken.current = true;

      const intensityMap = {
        light: 3,
        medium: 8,
        heavy: 15,
        extreme: 25,
      };

      const shakeAmount = intensityMap[intensity];

      gsap.to("body", {
        x: () => gsap.utils.random(-shakeAmount, shakeAmount),
        y: () => gsap.utils.random(-shakeAmount, shakeAmount),
        duration: 0.05,
        repeat: Math.floor(duration / 0.05),
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.set("body", { x: 0, y: 0 });
        },
      });
    }
  }, [trigger, intensity, duration]);

  // Reset when trigger becomes false
  useEffect(() => {
    if (!trigger) {
      hasShaken.current = false;
    }
  }, [trigger]);

  return null;
}
