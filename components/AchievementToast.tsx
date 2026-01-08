"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import type { Achievement } from "@/data/achievements";

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] cursor-pointer"
          onClick={onClose}
        >
          <motion.div
            className="relative px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-amber-500/90 backdrop-blur-md border-2 border-yellow-300/50 shadow-2xl shadow-amber-500/30"
            animate={{
              boxShadow: [
                "0 0 20px rgba(251, 191, 36, 0.3)",
                "0 0 40px rgba(251, 191, 36, 0.6)",
                "0 0 20px rgba(251, 191, 36, 0.3)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {/* Блестки */}
            <motion.div
              className="absolute -top-2 -right-2 text-2xl"
              animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -bottom-1 -left-1 text-xl"
              animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            >
              ✨
            </motion.div>

            <div className="flex items-center gap-4">
              {/* Эмодзи достижения */}
              <motion.div
                className="text-4xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                {achievement.emoji}
              </motion.div>

              <div className="text-left">
                <p className="text-xs text-amber-900/80 font-medium uppercase tracking-wider">
                  Новое достижение!
                </p>
                <h3 className="text-lg font-black text-white drop-shadow-md">
                  {achievement.name}
                </h3>
                <p className="text-sm text-amber-100/90">
                  {achievement.description}
                </p>
                <p className="text-xs text-amber-200/70 mt-1">
                  {achievement.requirement}
                </p>
              </div>

              {/* Трофей */}
              <motion.div
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🏆
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
