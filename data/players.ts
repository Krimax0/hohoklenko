import type { ScriptedSpin, SpinItem, Rarity } from "@/types/spin";
import {
  COMMON_ITEMS,
  UNCOMMON_ITEMS,
  RARE_ITEMS,
  EPIC_ITEMS,
  LEGENDARY_ITEMS,
  MYTHIC_ITEMS,
  getItemsByRarity,
} from "./items";

// ========================================
// Система шансов выпадения для каждого игрока
// Все значения в процентах (должны в сумме давать 100)
// ========================================
export interface RarityChances {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
  mythic: number;
}

export interface PlayerInfo {
  id: string;
  nickname: string;
  avatar: string;
  chances: RarityChances;
  maxSpins: number; // Максимальное количество круток (0 = бесконечно)
}

// ========================================
// Конфигурация игроков с индивидуальными шансами
// ========================================
export const PLAYERS: Record<string, PlayerInfo> = {
  KLENKO: {
    id: "klenko",
    nickname: "KLENKO",
    avatar: "🎅",
    maxSpins: 0, // Бесконечные крутки
    chances: {
      // KLENKO - "невезучий" персонаж, больше угля
      common: 40,     // 40% - много угля
      uncommon: 25,   // 25%
      rare: 18,       // 18%
      epic: 10,       // 10%
      legendary: 5,   // 5%
      mythic: 2,      // 2%
    },
  },
  HOHOYKS: {
    id: "hohoyks",
    nickname: "HOHOYKS",
    avatar: "🎄",
    maxSpins: 0, // Бесконечные крутки
    chances: {
      // HOHOYKS - более удачливый
      common: 25,     // 25% - меньше угля
      uncommon: 30,   // 30%
      rare: 22,       // 22%
      epic: 13,       // 13%
      legendary: 7,   // 7%
      mythic: 3,      // 3%
    },
  },
};

// Valid nicknames
export const VALID_NICKNAMES = Object.keys(PLAYERS);

// Check if nickname is valid
export const isValidNickname = (nickname: string): boolean => {
  return VALID_NICKNAMES.includes(nickname.toUpperCase());
};

// Get player info by nickname
export const getPlayerInfo = (nickname: string): PlayerInfo | undefined => {
  const upperNickname = nickname.toUpperCase();
  return PLAYERS[upperNickname];
};

// ========================================
// Система рандомного выбора
// ========================================

/**
 * Выбирает случайную редкость на основе шансов игрока
 */
const selectRandomRarity = (chances: RarityChances): Rarity => {
  const random = Math.random() * 100;
  let cumulative = 0;

  const rarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

  for (const rarity of rarities) {
    cumulative += chances[rarity];
    if (random < cumulative) {
      return rarity;
    }
  }

  // Fallback на случай погрешностей округления
  return "common";
};

/**
 * Выбирает случайный предмет из пула по редкости
 */
const selectRandomItem = (rarity: Rarity): SpinItem => {
  const items = getItemsByRarity(rarity);
  return items[Math.floor(Math.random() * items.length)];
};

/**
 * Генерирует список предметов для визуального отображения на барабане
 * с победным предметом на нужной позиции
 */
const generateSpinItems = (
  winningItem: SpinItem,
  winningPosition: number,
  totalItems: number = 50
): SpinItem[] => {
  const items: SpinItem[] = [];

  for (let i = 0; i < totalItems; i++) {
    if (i === winningPosition) {
      items.push(winningItem);
    } else {
      // Заполняем случайными предметами (взвешено в сторону common/uncommon для фона)
      const rand = Math.random();
      let pool: SpinItem[];
      if (rand < 0.5) {
        pool = COMMON_ITEMS;
      } else if (rand < 0.75) {
        pool = UNCOMMON_ITEMS;
      } else if (rand < 0.9) {
        pool = RARE_ITEMS;
      } else if (rand < 0.96) {
        pool = EPIC_ITEMS;
      } else if (rand < 0.99) {
        pool = LEGENDARY_ITEMS;
      } else {
        pool = MYTHIC_ITEMS;
      }
      items.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }

  return items;
};

/**
 * Генерирует случайный спин для игрока на основе его индивидуальных шансов
 */
export const generateRandomSpin = (nickname: string): ScriptedSpin | null => {
  const player = getPlayerInfo(nickname);
  if (!player) return null;

  // Выбираем случайную редкость на основе шансов игрока
  const winningRarity = selectRandomRarity(player.chances);
  
  // Выбираем случайный предмет этой редкости
  const winningItem = selectRandomItem(winningRarity);

  // Определяем параметры анимации в зависимости от редкости
  const isEpicDrop = winningRarity === "legendary" || winningRarity === "mythic";
  const totalItems = isEpicDrop ? 200 : 50;
  const winningPosition = isEpicDrop
    ? 150 + Math.floor(Math.random() * 20) // Позиция 150-169 для эпических дропов
    : 35 + Math.floor(Math.random() * 10); // Позиция 35-44 для обычных

  // Длительность анимации
  const durationMap: Record<Rarity, number> = {
    common: 4000,
    uncommon: 4500,
    rare: 5500,
    epic: 6500,
    legendary: 7500,
    mythic: 8500,
  };

  return {
    items: generateSpinItems(winningItem, winningPosition, totalItems),
    winningIndex: winningPosition,
    duration: durationMap[winningRarity],
    easing: "easeOut",
  };
};

// Для совместимости - старая функция (теперь просто вызывает новую)
export const generateSpin = (nickname: string, _spinIndex: number): ScriptedSpin | null => {
  return generateRandomSpin(nickname);
};

// Возвращает максимальное количество спинов (0 = бесконечно)
export const getSpinCount = (nickname: string): number => {
  const player = getPlayerInfo(nickname);
  return player?.maxSpins ?? 10; // По умолчанию 10 если игрок не найден
};

// Проверяет, есть ли ещё спины у игрока
export const hasSpinsRemaining = (nickname: string, currentSpinIndex: number): boolean => {
  const player = getPlayerInfo(nickname);
  if (!player) return false;
  
  // Если maxSpins = 0, то крутки бесконечны
  if (player.maxSpins === 0) return true;
  
  return currentSpinIndex < player.maxSpins;
};

/**
 * Получить отформатированные шансы для отображения в UI
 */
export const getFormattedChances = (nickname: string): { rarity: Rarity; name: string; chance: number }[] => {
  const player = getPlayerInfo(nickname);
  if (!player) return [];

  const rarityNames: Record<Rarity, string> = {
    common: "Обычный",
    uncommon: "Необычный",
    rare: "Редкий",
    epic: "Эпический",
    legendary: "Легендарный",
    mythic: "Мифический",
  };

  const rarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];
  
  return rarities.map((rarity) => ({
    rarity,
    name: rarityNames[rarity],
    chance: player.chances[rarity],
  }));
};
