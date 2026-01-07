"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { SpinItem } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";

interface ItemDetailModalProps {
  item: SpinItem | null;
  isOpen: boolean;
  onClose: () => void;
  hellMode?: boolean;
}

export function ItemDetailModal({ item, isOpen, onClose, hellMode = false }: ItemDetailModalProps) {
  if (!item) return null;

  const config = RARITY_CONFIG[item.rarity];

  // Адские названия редкостей
  const getHellRarityName = (rarity: string): string => {
    if (!hellMode) return config.name;
    const hellNames: Record<string, string> = {
      common: "Пепел",
      uncommon: "Тлен",
      rare: "Проклятие",
      epic: "Кошмар",
      legendary: "Ужас",
      mythic: "Погибель",
      divine: "Адский",
    };
    return hellNames[rarity] || config.name;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Animated glow background */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${config.glowColor} 0%, transparent 50%)`,
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center max-w-lg w-full"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              className="absolute -top-2 -right-2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ✕
            </motion.button>

            {/* Rarity badge */}
            <motion.div
              className="mb-6 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest"
              style={{
                background: config.bgGradient,
                color: "white",
                boxShadow: `0 0 30px ${config.glowColor}`,
              }}
              animate={{
                boxShadow: [
                  `0 0 20px ${config.glowColor}`,
                  `0 0 40px ${config.glowColor}`,
                  `0 0 20px ${config.glowColor}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getHellRarityName(item.rarity)}
            </motion.div>

            {/* Item image/emoji container */}
            <motion.div
              className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden mb-8"
              style={{
                background: config.bgGradient,
                border: `4px solid ${config.borderColor}`,
                boxShadow: `0 0 60px ${config.glowColor}`,
              }}
              animate={{
                boxShadow: [
                  `0 0 40px ${config.glowColor}`,
                  `0 0 80px ${config.glowColor}`,
                  `0 0 40px ${config.glowColor}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, transparent 100%)",
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Item content */}
              <div className="absolute inset-0 flex items-center justify-center">
                {item.imageUrl ? (
                  <div className="relative w-48 h-48 sm:w-60 sm:h-60">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      sizes="(max-width: 640px) 192px, 240px"
                    />
                  </div>
                ) : (
                  <motion.span
                    className="text-8xl sm:text-9xl drop-shadow-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {item.image}
                  </motion.span>
                )}
              </div>

              {/* Particles for rare+ items */}
              {["rare", "epic", "legendary", "mythic", "divine"].includes(item.rarity) && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: config.particleColor,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [-20, -60],
                        x: [0, (Math.random() - 0.5) * 40],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Item name */}
            <motion.h2
              className="text-3xl sm:text-4xl font-black text-center mb-4 px-4"
              style={{ color: config.color }}
              animate={{
                textShadow: [
                  `0 0 10px ${config.glowColor}`,
                  `0 0 20px ${config.glowColor}`,
                  `0 0 10px ${config.glowColor}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {item.name}
            </motion.h2>

            {/* Item description */}
            <motion.p
              className="text-lg sm:text-xl text-center text-gray-300 px-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {item.description}
            </motion.p>

            {/* Decorative elements */}
            <motion.div
              className="mt-8 flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {(hellMode ? ["🔥", "💀", "🔥"] : ["✨", "⭐", "✨"]).map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>

            {/* Tap to close hint */}
            <motion.p
              className="mt-6 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Нажмите в любом месте, чтобы закрыть
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
