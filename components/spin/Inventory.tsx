"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SpinItemCard } from "./SpinItem";
import { Collection } from "./Collection";
import { ItemDetailModal } from "./ItemDetailModal";
import type { SpinResult, Rarity, SpinItem } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";
import { useState } from "react";
import { getPlayerAchievements } from "@/data/achievements";

interface InventoryProps {
  items: SpinResult[];
  isOpen: boolean;
  onClose: () => void;
  playerNickname?: string;
  hellMode?: boolean;
  lowRaritiesRemoved?: boolean;
  unlockedAchievements?: string[];
}

type TabType = "inventory" | "collection" | "achievements";

const RARITY_ORDER: Rarity[] = [
  "divine",
  "mythic",
  "legendary",
  "epic",
  "rare",
  "uncommon",
  "common",
];

export function Inventory({ items, isOpen, onClose, playerNickname = "Klenkozarashi", hellMode = false, lowRaritiesRemoved = false, unlockedAchievements = [] }: InventoryProps) {
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all");
  const [activeTab, setActiveTab] = useState<TabType>("inventory");
  const [selectedItem, setSelectedItem] = useState<SpinItem | null>(null);

  // Получить достижения для этого игрока
  const playerAchievements = getPlayerAchievements(playerNickname);
  const unlockedCount = playerAchievements.filter(a => unlockedAchievements.includes(a.id)).length;

  // Group items by rarity
  const groupedItems = items.reduce((acc, result) => {
    const rarity = result.item.rarity;
    if (!acc[rarity]) acc[rarity] = [];
    acc[rarity].push(result);
    return acc;
  }, {} as Record<Rarity, SpinResult[]>);

  // Filter items based on selection
  const filteredItems =
    selectedRarity === "all"
      ? items
      : items.filter((r) => r.item.rarity === selectedRarity);

  // Count by rarity
  const rarityCounts = RARITY_ORDER.map((rarity) => ({
    rarity,
    count: groupedItems[rarity]?.length || 0,
    config: RARITY_CONFIG[rarity],
  }));

  // Адские названия редкостей
  const getHellRarityName = (rarity: Rarity): string => {
    if (!hellMode) return RARITY_CONFIG[rarity].name;
    const hellNames: Record<Rarity, string> = {
      common: "Пепел",
      uncommon: "Тлен",
      rare: "Проклятие",
      epic: "Кошмар",
      legendary: "Ужас",
      mythic: "Погибель",
      divine: "Адский",
    };
    return hellNames[rarity];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 w-full max-w-4xl max-h-[80vh] m-4 bg-gray-900/90 rounded-2xl border border-white/10 overflow-hidden"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span>{hellMode ? (activeTab === "inventory" ? "👻" : "💀") : (activeTab === "inventory" ? "🎒" : "📚")}</span>
                  {activeTab === "inventory"
                    ? (hellMode ? "Проклятый инвентарь" : "Инвентарь")
                    : (hellMode ? "Книга проклятий" : "Коллекция")}
                  {activeTab === "inventory" && (
                    <span className="text-lg text-gray-400">
                      ({items.length} {hellMode ? "проклятий" : "предметов"})
                    </span>
                  )}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white text-2xl hover:scale-110 active:scale-95 transition-all"
                  onClick={onClose}
                >
                  ✕
                </Button>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-6 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all ${
                    activeTab === "inventory"
                      ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  onClick={() => setActiveTab("inventory")}
                >
                  {hellMode ? "👻 Проклятия" : "🎒 Инвентарь"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-6 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all ${
                    activeTab === "collection"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  onClick={() => setActiveTab("collection")}
                >
                  {hellMode ? "💀 Книга тьмы" : "📚 Коллекция"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-6 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all ${
                    activeTab === "achievements"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  onClick={() => setActiveTab("achievements")}
                >
                  🏆 Достижения ({unlockedCount}/{playerAchievements.length})
                </Button>
              </div>

              {/* Rarity filters - только для инвентаря */}
              {activeTab === "inventory" && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-4 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all ${
                      selectedRarity === "all"
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => setSelectedRarity("all")}
                  >
                    Все ({items.length})
                  </Button>
                  {rarityCounts.map(({ rarity, count, config }) =>
                    count > 0 ? (
                      <Button
                        key={rarity}
                        variant="ghost"
                        size="sm"
                        className="px-4 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all"
                        style={{
                          background:
                            selectedRarity === rarity
                              ? config.bgGradient
                              : `${config.color}20`,
                          color:
                            selectedRarity === rarity ? "white" : config.color,
                          boxShadow:
                            selectedRarity === rarity
                              ? `0 0 10px ${config.glowColor}`
                              : "none",
                        }}
                        onClick={() => setSelectedRarity(rarity)}
                      >
                        {getHellRarityName(rarity)} ({count})
                      </Button>
                    ) : null
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto overflow-x-hidden max-h-[calc(80vh-200px)]">
              {activeTab === "inventory" ? (
                // Инвентарь
                filteredItems.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <span className="text-6xl block mb-4">{hellMode ? "💀" : "📦"}</span>
                    <p>{hellMode ? "Пустота... Крутите, чтобы собрать проклятия!" : "Пока пусто. Крутите, чтобы получить предметы!"}</p>
                  </div>
                ) : (
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                    layout
                  >
                    {filteredItems
                      .sort((a, b) => {
                        const aIndex = RARITY_ORDER.indexOf(a.item.rarity);
                        const bIndex = RARITY_ORDER.indexOf(b.item.rarity);
                        return aIndex - bIndex;
                      })
                      .map((result, index) => (
                        <motion.div
                          key={`${result.item.id}-${result.timestamp}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          layout
                          className="cursor-pointer"
                          onClick={() => setSelectedItem(result.item)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <SpinItemCard item={result.item} size="md" showDetails />
                        </motion.div>
                      ))}
                  </motion.div>
                )
              ) : activeTab === "collection" ? (
                // Коллекция
                <Collection inventory={items} playerNickname={playerNickname} hellMode={hellMode} lowRaritiesRemoved={lowRaritiesRemoved} />
              ) : (
                // Достижения
                <div className="space-y-4">
                  {/* Полученные достижения */}
                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                      <span>✅</span> Полученные ({unlockedCount})
                    </h3>
                    {unlockedCount === 0 ? (
                      <p className="text-gray-500 text-center py-4">Пока нет достижений. Крутите!</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {playerAchievements
                          .filter(a => unlockedAchievements.includes(a.id))
                          .map((achievement, index) => (
                            <motion.div
                              key={achievement.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30"
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-3xl">{achievement.emoji}</span>
                                <div className="flex-1">
                                  <h4 className="font-bold text-white">{achievement.name}</h4>
                                  <p className="text-sm text-amber-200">{achievement.description}</p>
                                  <p className="text-xs text-gray-400 mt-1">{achievement.requirement}</p>
                                </div>
                                <span className="text-2xl">🏆</span>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Неполученные достижения */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-400 mb-3 flex items-center gap-2">
                      <span>🔒</span> Не получены ({playerAchievements.length - unlockedCount})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {playerAchievements
                        .filter(a => !unlockedAchievements.includes(a.id))
                        .map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-xl border opacity-60 ${
                              achievement.hidden
                                ? "bg-purple-900/30 border-purple-700/50"
                                : "bg-gray-800/50 border-gray-700/50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-3xl grayscale">
                                {achievement.hidden ? "❓" : achievement.emoji}
                              </span>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-300">
                                  {achievement.hidden ? "???" : achievement.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {achievement.hidden ? "Секретное достижение" : achievement.description}
                                </p>
                                <p className="text-xs text-amber-400/70 mt-1 flex items-center gap-1">
                                  <span>{achievement.hidden ? "🤫" : "📋"}</span>
                                  {achievement.hidden ? "Узнаешь, когда получишь..." : achievement.requirement}
                                </p>
                              </div>
                              <span className="text-2xl">{achievement.hidden ? "🤫" : "🔒"}</span>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats footer */}
            <div className="p-4 border-t border-white/10 bg-black/30">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                {rarityCounts.map(({ rarity, count, config }) => (
                  <div
                    key={rarity}
                    className="flex items-center gap-1"
                    style={{ color: config.color }}
                  >
                    <span className="font-bold">{count}</span>
                    <span className="text-gray-400">{getHellRarityName(rarity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Item Detail Modal */}
          <ItemDetailModal
            item={selectedItem}
            isOpen={selectedItem !== null}
            onClose={() => setSelectedItem(null)}
            hellMode={hellMode}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
