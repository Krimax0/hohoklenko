"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { SpinResult, Rarity, SpinItem } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";
import { getPlayerItems } from "@/data/items";
import { getFormattedChances, isCollectionComplete } from "@/data/players";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CollectionProps {
  inventory: SpinResult[];
  playerNickname: string;
  hellMode?: boolean;
  lowRaritiesRemoved?: boolean;
}

const RARITY_ORDER: Rarity[] = [
  "divine",
  "mythic",
  "legendary",
  "epic",
  "rare",
  "uncommon",
  "common",
];

// Компонент для отображения открытого предмета
function UnlockedItemCard({ item, chance }: { item: SpinItem; chance: number }) {
  const config = RARITY_CONFIG[item.rarity];

  return (
    <motion.div
      className="relative rounded-xl p-4 flex flex-col items-center text-center hover:z-50 bg-white/5 backdrop-blur-sm"
      style={{
        border: `1px solid ${config.color}30`,
      }}
      whileHover={{
        scale: 1.02,
        borderColor: config.color,
        boxShadow: `0 0 15px ${config.glowColor}`
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Картинка/Эмодзи */}
      {item.imageUrl ? (
        <div className="relative w-20 h-20 mb-3">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain drop-shadow-lg"
            sizes="80px"
          />
        </div>
      ) : (
        <div className="text-5xl mb-3">
          {item.image}
        </div>
      )}

      {/* Название */}
      <div className="text-sm font-semibold text-white mb-1 leading-tight">
        {item.name}
      </div>

      {/* Редкость */}
      <div
        className="text-xs font-medium mb-2 px-2 py-0.5 rounded-full"
        style={{
          color: config.color,
          background: `${config.color}15`
        }}
      >
        {config.name}
      </div>

      {/* Описание */}
      <div className="text-xs text-white/50 leading-relaxed">
        {item.description}
      </div>
    </motion.div>
  );
}

// Компонент для отображения заблокированного предмета
function LockedItemCard({ item, chance }: { item: SpinItem; chance: number }) {
  const config = RARITY_CONFIG[item.rarity];

  return (
    <motion.div
      className="relative rounded-xl p-4 flex flex-col items-center text-center hover:z-50 bg-white/[0.02]"
      style={{
        border: `1px solid ${config.color}20`,
      }}
      whileHover={{
        scale: 1.02,
        borderColor: `${config.color}40`,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Иконка вопроса */}
      <div
        className="text-5xl mb-3 opacity-40"
        style={{ color: config.color }}
      >
        ?
      </div>

      {/* Редкость */}
      <div
        className="text-xs font-medium mb-2 px-2 py-0.5 rounded-full opacity-60"
        style={{
          color: config.color,
          background: `${config.color}10`
        }}
      >
        {config.name}
      </div>

      {/* Шанс */}
      <div className="text-xs text-white/30 font-mono">
        {chance}%
      </div>
    </motion.div>
  );
}

export function Collection({ inventory, playerNickname, hellMode = false, lowRaritiesRemoved = false }: CollectionProps) {
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all");

  // Получаем шансы для игрока (с учётом модификатора после 40 круток)
  const chances = getFormattedChances(playerNickname, lowRaritiesRemoved);
  const chanceMap = chances.reduce((acc, { rarity, chance }) => {
    acc[rarity] = chance;
    return acc;
  }, {} as Record<Rarity, number>);

  // Получаем предметы текущего игрока (адские если hellMode активен)
  const playerItems = getPlayerItems(playerNickname, hellMode);

  // Создаем Set из ID выпавших предметов
  const unlockedItemIds = new Set(inventory.map((result) => result.item.id));

  // Фильтруем предметы по выбранной редкости
  const filteredItems =
    selectedRarity === "all"
      ? playerItems
      : playerItems.filter((item) => item.rarity === selectedRarity);

  // Разделяем на выпавшие и не выпавшие
  const unlockedItems = filteredItems.filter((item) =>
    unlockedItemIds.has(item.id)
  );
  const lockedItems = filteredItems.filter(
    (item) => !unlockedItemIds.has(item.id)
  );

  // Статистика по редкости
  const rarityCounts = RARITY_ORDER.map((rarity) => {
    const totalInRarity = playerItems.filter((item) => item.rarity === rarity).length;
    const unlockedInRarity = playerItems.filter(
      (item) => item.rarity === rarity && unlockedItemIds.has(item.id)
    ).length;
    return {
      rarity,
      total: totalInRarity,
      unlocked: unlockedInRarity,
      config: RARITY_CONFIG[rarity],
    };
  });

  const totalItems = playerItems.length;
  const totalUnlocked = unlockedItemIds.size;
  const completionPercent = Math.floor((totalUnlocked / totalItems) * 100);

  // Проверяем доступность божественной редкости
  const collectedItemIds = inventory.map((result) => result.item.id);
  const collectionIsComplete = isCollectionComplete(collectedItemIds, playerNickname);

  // Считаем прогресс без учета божественных предметов
  const nonDivineItems = playerItems.filter(item => item.rarity !== "divine");
  const nonDivineUnlocked = nonDivineItems.filter(item => unlockedItemIds.has(item.id)).length;

  return (
    <div className="flex flex-col h-full">
      {/* Прогресс коллекции */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/70">Прогресс коллекции</span>
          <span className="text-sm font-bold text-white">
            {totalUnlocked} / {totalItems} ({completionPercent}%)
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Индикатор божественной редкости */}
        {!collectionIsComplete && (
          <div className="mt-2 text-xs text-white/50 flex items-center gap-2">
            <span>🔒</span>
            <span>
              Соберите все предметы ({nonDivineUnlocked}/{nonDivineItems.length}) чтобы разблокировать Божественную редкость!
            </span>
          </div>
        )}
        {collectionIsComplete && !unlockedItemIds.has(playerNickname.toLowerCase() + "_minecraft_key") && (
          <div className="mt-2 text-xs text-yellow-400 flex items-center gap-2 font-bold animate-pulse">
            <span>✨</span>
            <span>
              Коллекция собрана! Божественная редкость теперь доступна!
            </span>
          </div>
        )}
      </div>

      {/* Фильтры по редкости */}
      <div className="flex flex-wrap gap-2 mb-4">
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
          Все ({totalItems})
        </Button>
        {rarityCounts.map(({ rarity, total, unlocked, config }) => (
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
              color: selectedRarity === rarity ? "white" : config.color,
              boxShadow:
                selectedRarity === rarity
                  ? `0 0 10px ${config.glowColor}`
                  : "none",
            }}
            onClick={() => setSelectedRarity(rarity)}
          >
            {config.name} ({unlocked}/{total})
          </Button>
        ))}
      </div>

      {/* Сетка предметов */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <span className="text-6xl block mb-4">📦</span>
            <p>Нет предметов в этой категории</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
            {/* Сначала выпавшие предметы */}
            {unlockedItems
              .sort((a, b) => {
                const aIndex = RARITY_ORDER.indexOf(a.rarity);
                const bIndex = RARITY_ORDER.indexOf(b.rarity);
                return aIndex - bIndex;
              })
              .map((item) => (
                <UnlockedItemCard
                  key={item.id}
                  item={item}
                  chance={chanceMap[item.rarity]}
                />
              ))}

            {/* Затем не выпавшие предметы */}
            {lockedItems
              .sort((a, b) => {
                const aIndex = RARITY_ORDER.indexOf(a.rarity);
                const bIndex = RARITY_ORDER.indexOf(b.rarity);
                return aIndex - bIndex;
              })
              .map((item) => (
                <LockedItemCard
                  key={item.id}
                  item={item}
                  chance={chanceMap[item.rarity]}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
