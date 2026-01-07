import type { ScriptedSpin, SpinItem, Rarity } from "@/types/spin";
import {
  getPlayerItems,
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
  divine: number;
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
      common: 39.5,   // 39.5% - много угля
      uncommon: 25,   // 25%
      rare: 18,       // 18%
      epic: 10,       // 10%
      legendary: 5,   // 5%
      mythic: 1.5,    // 1.5%
      divine: 0.5,    // 0.5% - божественный подарок!
    },
  },
  HOHOYKS: {
    id: "hohoyks",
    nickname: "HOHOYKS",
    avatar: "🎄",
    maxSpins: 0, // Бесконечные крутки
    chances: {
      // HOHOYKS - более удачливый
      common: 24.5,   // 24.5% - меньше угля
      uncommon: 30,   // 30%
      rare: 22,       // 22%
      epic: 13,       // 13%
      legendary: 7,   // 7%
      mythic: 2.5,    // 2.5%
      divine: 0.5,    // 0.5% - божественный подарок!
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
 * Проверяет, собрана ли полная коллекция (все предметы кроме божественных) для конкретного игрока
 */
export const isCollectionComplete = (collectedItemIds: string[], nickname: string): boolean => {
  const collectedSet = new Set(collectedItemIds);

  // Получаем все предметы игрока кроме божественных
  const playerItems = getPlayerItems(nickname);
  const allNonDivineItems = playerItems.filter(item => item.rarity !== "divine");

  // Проверяем, что все не-божественные предметы собраны
  return allNonDivineItems.every(item => collectedSet.has(item.id));
};

/**
 * Выбирает случайную редкость на основе шансов игрока
 * Божественная редкость доступна только когда собрана вся коллекция
 */
const selectRandomRarity = (chances: RarityChances, collectedItemIds: string[] = [], nickname: string): Rarity => {
  const random = Math.random() * 100;
  let cumulative = 0;

  const rarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "divine"];

  // Проверяем, собрана ли коллекция игрока
  const collectionComplete = isCollectionComplete(collectedItemIds, nickname);

  for (const rarity of rarities) {
    // Пропускаем божественную редкость если коллекция не собрана
    if (rarity === "divine" && !collectionComplete) {
      continue;
    }

    cumulative += chances[rarity];
    if (random < cumulative) {
      return rarity;
    }
  }

  // Fallback на случай погрешностей округления
  return "common";
};

/**
 * Выбирает случайный предмет из пула игрока по редкости
 */
const selectRandomItem = (rarity: Rarity, nickname: string): SpinItem => {
  const items = getItemsByRarity(rarity, nickname);

  // Выбираем случайный предмет из доступных для игрока
  return items[Math.floor(Math.random() * items.length)];
};

/**
 * Генерирует список предметов для визуального отображения на барабане
 * с победным предметом на нужной позиции
 */
const generateSpinItems = (
  winningItem: SpinItem,
  winningPosition: number,
  nickname: string,
  totalItems: number = 50
): SpinItem[] => {
  const items: SpinItem[] = [];
  const playerItems = getPlayerItems(nickname).filter(item => item.rarity !== "divine");

  for (let i = 0; i < totalItems; i++) {
    if (i === winningPosition) {
      items.push(winningItem);
    } else {
      // Заполняем случайными предметами из пула игрока (взвешено в сторону common/uncommon для фона)
      const rand = Math.random();
      let pool: SpinItem[];
      if (rand < 0.5) {
        pool = playerItems.filter(item => item.rarity === "common");
      } else if (rand < 0.75) {
        pool = playerItems.filter(item => item.rarity === "uncommon");
      } else if (rand < 0.9) {
        pool = playerItems.filter(item => item.rarity === "rare");
      } else if (rand < 0.96) {
        pool = playerItems.filter(item => item.rarity === "epic");
      } else if (rand < 0.99) {
        pool = playerItems.filter(item => item.rarity === "legendary");
      } else {
        pool = playerItems.filter(item => item.rarity === "mythic");
      }

      // Если пул пустой (например, нет мифических у игрока), берем любой предмет
      if (pool.length === 0) {
        pool = playerItems;
      }

      items.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }

  return items;
};

/**
 * Генерирует случайный спин для игрока на основе его индивидуальных шансов
 * Принимает массив ID собранных предметов для проверки доступности божественной редкости
 */
export const generateRandomSpin = (nickname: string, collectedItemIds: string[] = []): ScriptedSpin | null => {
  const player = getPlayerInfo(nickname);
  if (!player) return null;

  // Выбираем случайную редкость на основе шансов игрока
  const winningRarity = selectRandomRarity(player.chances, collectedItemIds, nickname);

  // Выбираем случайный предмет этой редкости
  const winningItem = selectRandomItem(winningRarity, nickname);

  // Определяем параметры анимации в зависимости от редкости
  const isEpicDrop = winningRarity === "legendary" || winningRarity === "mythic" || winningRarity === "divine";
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
    divine: 10000,
  };

  return {
    items: generateSpinItems(winningItem, winningPosition, nickname, totalItems),
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
    divine: "Божественный",
  };

  const rarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "divine"];

  return rarities.map((rarity) => ({
    rarity,
    name: rarityNames[rarity],
    chance: player.chances[rarity],
  }));
};
