"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface LuckToastProps {
  message: string | null;
  isVisible: boolean;
  onClose: () => void;
  autoHideDelay?: number;
}

export function LuckToast({
  message,
  isVisible,
  onClose,
  autoHideDelay = 3000,
}: LuckToastProps) {
  // Автоматически скрываем toast через заданное время
  useEffect(() => {
    if (isVisible && message) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, message, onClose, autoHideDelay]);

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          className="fixed bottom-6 left-6 z-40 max-w-sm"
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <div className="relative bg-gradient-to-br from-emerald-900/90 via-green-800/90 to-teal-900/90 backdrop-blur-md rounded-xl border border-green-400/30 shadow-lg shadow-green-500/20 p-4 pr-10 overflow-hidden">
            {/* Декоративное свечение */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 pointer-events-none"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Контент */}
            <div className="flex items-center gap-3 relative z-10">
              <motion.span
                className="text-2xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🍀
              </motion.span>
              <div>
                <p className="text-green-100 font-medium text-sm leading-tight">
                  {message}
                </p>
              </div>
            </div>

            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-green-300/60 hover:text-green-100 transition-colors p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Декоративные элементы */}
            <motion.div
              className="absolute bottom-1 right-3 text-sm opacity-40"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            >
              ✨
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
