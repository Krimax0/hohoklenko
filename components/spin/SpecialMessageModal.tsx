"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { SpecialMessage } from "@/stores/specialMechanics";

interface SpecialMessageModalProps {
  message: SpecialMessage | null;
  isOpen: boolean;
  onClose: () => void;
  showBonusButton?: boolean;
  onBonusClick?: () => void;
}

const typeStyles = {
  info: {
    bg: "bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900",
    border: "border-blue-400/50",
    glow: "shadow-[0_0_60px_rgba(59,130,246,0.5)]",
    titleColor: "text-blue-200",
    textColor: "text-blue-100",
    buttonBg: "bg-blue-600 hover:bg-blue-500",
  },
  success: {
    bg: "bg-gradient-to-br from-emerald-900 via-green-800 to-yellow-900",
    border: "border-yellow-400/50",
    glow: "shadow-[0_0_80px_rgba(234,179,8,0.6)]",
    titleColor: "text-yellow-300",
    textColor: "text-green-100",
    buttonBg: "bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400",
  },
  warning: {
    bg: "bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900",
    border: "border-orange-400/50",
    glow: "shadow-[0_0_60px_rgba(251,146,60,0.5)]",
    titleColor: "text-orange-200",
    textColor: "text-amber-100",
    buttonBg: "bg-orange-600 hover:bg-orange-500",
  },
  danger: {
    bg: "bg-gradient-to-br from-red-950 via-red-900 to-black",
    border: "border-red-500/70",
    glow: "shadow-[0_0_100px_rgba(239,68,68,0.7)]",
    titleColor: "text-red-400",
    textColor: "text-red-200",
    buttonBg: "bg-red-700 hover:bg-red-600",
  },
};

export function SpecialMessageModal({
  message,
  isOpen,
  onClose,
  showBonusButton = false,
  onBonusClick,
}: SpecialMessageModalProps) {
  if (!message) return null;

  const styles = typeStyles[message.type];
  const isDanger = message.type === "danger";
  const isSuccess = message.type === "success";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className={`absolute inset-0 ${isDanger ? "bg-red-950/90" : "bg-black/80"} backdrop-blur-md`}
            onClick={onClose}
            animate={isDanger ? { opacity: [0.8, 0.9, 0.8] } : {}}
            transition={isDanger ? { duration: 0.5, repeat: Infinity } : {}}
          />

          {/* Modal */}
          <motion.div
            className={`relative z-10 w-full max-w-lg rounded-2xl ${styles.bg} ${styles.border} border-2 ${styles.glow} overflow-hidden`}
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{
              scale: 1,
              y: 0,
              opacity: 1,
              ...(isDanger && {
                x: [0, -5, 5, -5, 5, 0],
                transition: { x: { duration: 0.5, repeat: Infinity, repeatDelay: 2 } },
              }),
            }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Decorative elements */}
            {isSuccess && (
              <>
                <motion.div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute top-4 left-4 text-2xl">✨</div>
                  <div className="absolute top-8 right-8 text-xl">🌟</div>
                  <div className="absolute bottom-12 left-8 text-xl">⭐</div>
                  <div className="absolute bottom-8 right-4 text-2xl">✨</div>
                </motion.div>
              </>
            )}

            {isDanger && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent pointer-events-none"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Content */}
            <div className="p-8 text-center">
              {/* Icon */}
              {message.icon && (
                <motion.div
                  className="text-6xl mb-4"
                  animate={
                    isDanger
                      ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }
                      : isSuccess
                      ? { scale: [1, 1.1, 1], y: [0, -5, 0] }
                      : { scale: [1, 1.05, 1] }
                  }
                  transition={{ duration: isDanger ? 0.5 : 1.5, repeat: Infinity }}
                >
                  {message.icon}
                </motion.div>
              )}

              {/* Title */}
              <motion.h2
                className={`text-2xl md:text-3xl font-black mb-4 ${styles.titleColor}`}
                animate={isDanger ? { scale: [1, 1.02, 1] } : {}}
                transition={isDanger ? { duration: 0.3, repeat: Infinity } : {}}
              >
                {message.title}
              </motion.h2>

              {/* Message */}
              <p className={`text-lg md:text-xl ${styles.textColor} mb-6 leading-relaxed`}>
                {message.message}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {showBonusButton && onBonusClick && (
                  <Button
                    onClick={onBonusClick}
                    className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-bold shadow-lg animate-pulse"
                  >
                    🎁 Получить бонусную крутку! 🎁
                  </Button>
                )}

                <Button
                  onClick={onClose}
                  className={`text-lg px-8 py-6 ${styles.buttonBg} text-white font-bold`}
                >
                  {isDanger ? "Продолжить... если осмелишься" : "Понятно!"}
                </Button>
              </div>
            </div>

            {/* Bottom decoration */}
            {!isDanger && (
              <div className="flex justify-center gap-2 pb-4">
                {["🎄", "⭐", "🎁", "⭐", "🎄"].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="text-xl opacity-60"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            )}

            {isDanger && (
              <div className="flex justify-center gap-2 pb-4">
                {["🔥", "💀", "👹", "💀", "🔥"].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="text-xl"
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
