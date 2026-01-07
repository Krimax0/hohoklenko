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
  maxSpins: number; // Максимальное количество круток (0 = бесконечно, отрицательное = может уходить в минус)
  baseMaxSpins: number; // Базовое количество круток (30 для обоих)
}

// ========================================
// Конфигурация игроков с индивидуальными шансами
// ========================================
export const PLAYERS: Record<string, PlayerInfo> = {
  KLENKOZARASHI: {
    id: "klenko",
    nickname: "Klenkozarashi",
    avatar: "🎅",
    maxSpins: 30, // Может уходить в минус (тролль механика)
    baseMaxSpins: 30,
    chances: {
      // Klenkozarashi - "невезучий" персонаж, больше угля
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
    maxSpins: 30, // После секретного предмета станет 0 (бесконечно)
    baseMaxSpins: 30,
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
 * @param lowRaritiesRemoved - для HOHOYKS после 40 круток убираются common и uncommon
 */
const selectRandomRarity = (
  chances: RarityChances,
  collectedItemIds: string[] = [],
  nickname: string,
  lowRaritiesRemoved: boolean = false
): Rarity => {
  const random = Math.random() * 100;
  let cumulative = 0;

  const rarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "divine"];

  // Проверяем, собрана ли коллекция игрока
  const collectionComplete = isCollectionComplete(collectedItemIds, nickname);

  // Для HOHOYKS после 40 круток сильно уменьшаем шансы common и uncommon (в 10 раз)
  let adjustedChances = { ...chances };
  if (lowRaritiesRemoved && nickname.toUpperCase() === "HOHOYKS") {
    const commonReduction = chances.common * 0.9; // Уменьшаем на 90%
    const uncommonReduction = chances.uncommon * 0.9; // Уменьшаем на 90%
    const totalReduction = commonReduction + uncommonReduction;

    // Новые шансы для common/uncommon (10% от оригинала)
    adjustedChances.common = chances.common * 0.1;
    adjustedChances.uncommon = chances.uncommon * 0.1;

    // Перераспределяем освободившиеся шансы на редкие и выше пропорционально
    const higherRarities: Rarity[] = ["rare", "epic", "legendary", "mythic"];
    const totalHigher = higherRarities.reduce((sum, r) => sum + chances[r], 0);

    higherRarities.forEach(rarity => {
      const proportion = chances[rarity] / totalHigher;
      adjustedChances[rarity] = chances[rarity] + (totalReduction * proportion);
    });
  }

  for (const rarity of rarities) {
    // Пропускаем божественную редкость если коллекция не собрана
    if (rarity === "divine" && !collectionComplete) {
      continue;
    }

    cumulative += adjustedChances[rarity];
    if (random < cumulative) {
      return rarity;
    }
  }

  // Fallback
  return "common";
};

/**
 * Выбирает случайный предмет из пула игрока по редкости
 */
const selectRandomItem = (rarity: Rarity, nickname: string, hellMode: boolean = false): SpinItem => {
  const items = getItemsByRarity(rarity, nickname, hellMode);

  // Выбираем случайный предмет из доступных для игрока
  return items[Math.floor(Math.random() * items.length)];
};

/**
 * Генерирует список предметов для визуального отображения на барабане
 * с победным предметом на нужной позиции
 * @param lowRaritiesRemoved - для HOHOYKS после 40 круток сильно снижаются шансы common и uncommon
 * @param hellMode - адский режим для Klenkozarashi
 */
const generateSpinItems = (
  winningItem: SpinItem,
  winningPosition: number,
  nickname: string,
  totalItems: number = 50,
  lowRaritiesRemoved: boolean = false,
  hellMode: boolean = false
): SpinItem[] => {
  const items: SpinItem[] = [];
  const playerItems = getPlayerItems(nickname, hellMode).filter(item => item.rarity !== "divine");

  for (let i = 0; i < totalItems; i++) {
    if (i === winningPosition) {
      items.push(winningItem);
    } else {
      // Заполняем случайными предметами из пула игрока
      const rand = Math.random();
      let pool: SpinItem[];

      if (lowRaritiesRemoved && nickname.toUpperCase() === "HOHOYKS") {
        // После 40 круток - сильно уменьшенный шанс common/uncommon (5% каждый)
        if (rand < 0.05) {
          pool = playerItems.filter(item => item.rarity === "common");
        } else if (rand < 0.10) {
          pool = playerItems.filter(item => item.rarity === "uncommon");
        } else if (rand < 0.45) {
          pool = playerItems.filter(item => item.rarity === "rare");
        } else if (rand < 0.75) {
          pool = playerItems.filter(item => item.rarity === "epic");
        } else if (rand < 0.92) {
          pool = playerItems.filter(item => item.rarity === "legendary");
        } else {
          pool = playerItems.filter(item => item.rarity === "mythic");
        }
      } else {
        // Обычное распределение
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
      }

      // Если пул пустой, берем любой доступный предмет
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
 * @param lowRaritiesRemoved - для HOHOYKS после 40 круток убираются common и uncommon
 * @param hellMode - адский режим для Klenkozarashi
 * @param guaranteedDivine - гарантированный божественный предмет (на 200-й крутке)
 */
export const generateRandomSpin = (
  nickname: string,
  collectedItemIds: string[] = [],
  lowRaritiesRemoved: boolean = false,
  hellMode: boolean = false,
  guaranteedDivine: boolean = false
): ScriptedSpin | null => {
  const player = getPlayerInfo(nickname);
  if (!player) return null;

  let winningRarity: Rarity;
  let winningItem: SpinItem;

  if (guaranteedDivine) {
    // Гарантированный божественный предмет на 200-й крутке
    winningRarity = "divine";
    winningItem = selectRandomItem(winningRarity, nickname, hellMode);
  } else {
    // Выбираем случайную редкость на основе шансов игрока
    winningRarity = selectRandomRarity(player.chances, collectedItemIds, nickname, lowRaritiesRemoved);
    // Выбираем случайный предмет этой редкости
    winningItem = selectRandomItem(winningRarity, nickname, hellMode);
  }

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
    items: generateSpinItems(winningItem, winningPosition, nickname, totalItems, lowRaritiesRemoved, hellMode),
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
 * @param lowRaritiesRemoved - для HOHOYKS после 40 круток сильно снижаются шансы common и uncommon
 */
export const getFormattedChances = (nickname: string, lowRaritiesRemoved: boolean = false): { rarity: Rarity; name: string; chance: number }[] => {
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

  // Рассчитываем скорректированные шансы для HOHOYKS после 40 круток
  let adjustedChances = { ...player.chances };
  if (lowRaritiesRemoved && nickname.toUpperCase() === "HOHOYKS") {
    const commonReduction = player.chances.common * 0.9;
    const uncommonReduction = player.chances.uncommon * 0.9;
    const totalReduction = commonReduction + uncommonReduction;

    adjustedChances.common = player.chances.common * 0.1;
    adjustedChances.uncommon = player.chances.uncommon * 0.1;

    const higherRarities: Rarity[] = ["rare", "epic", "legendary", "mythic"];
    const totalHigher = higherRarities.reduce((sum, r) => sum + player.chances[r], 0);

    higherRarities.forEach(rarity => {
      const proportion = player.chances[rarity] / totalHigher;
      adjustedChances[rarity] = player.chances[rarity] + (totalReduction * proportion);
    });
  }

  return rarities.map((rarity) => ({
    rarity,
    name: rarityNames[rarity],
    chance: Math.round(adjustedChances[rarity] * 100) / 100, // Округляем до 2 знаков
  }));
};
