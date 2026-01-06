"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingEmojiProps {
  emoji: string;
  count?: number;
  duration?: number;
}

interface EmojiParticle {
  id: number;
  x: number;
  delay: number;
  scale: number;
  rotation: number;
}

export function FloatingEmoji({
  emoji,
  count = 10,
  duration = 3,
}: FloatingEmojiProps) {
  const [particles, setParticles] = useState<EmojiParticle[]>([]);

  useEffect(() => {
    const newParticles: EmojiParticle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        scale: 0.5 + Math.random() * 1,
        rotation: Math.random() * 360,
      });
    }
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-4xl"
          style={{
            left: `${particle.x}%`,
            bottom: "-50px",
          }}
          initial={{
            y: 0,
            opacity: 1,
            scale: particle.scale,
            rotate: particle.rotation,
          }}
          animate={{
            y: -window.innerHeight - 100,
            opacity: [1, 1, 0],
            rotate: particle.rotation + 180,
          }}
          transition={{
            duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}
