import type { PlayerData, ScriptedSpin, SpinItem } from "@/types/spin";
import {
  COMMON_ITEMS,
  UNCOMMON_ITEMS,
  RARE_ITEMS,
  EPIC_ITEMS,
  LEGENDARY_ITEMS,
  MYTHIC_ITEMS,
} from "./items";

// Helper function to generate spin items array with winning item at specific position
const generateSpinItems = (
  winningItem: SpinItem,
  winningPosition: number,
  totalItems: number = 50
): SpinItem[] => {
  const items: SpinItem[] = [];

  // Fill with random items, placing winning item at the correct position
  for (let i = 0; i < totalItems; i++) {
    if (i === winningPosition) {
      items.push(winningItem);
    } else {
      // Get random items (weighted towards common/uncommon for background)
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
      } else {
        pool = LEGENDARY_ITEMS;
      }
      items.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }

  return items;
};

// Spin template - stores winning item and duration, generates items dynamically
interface SpinTemplate {
  winningItem: SpinItem;
  duration: number;
  easing: "easeOut" | "easeInOut" | "custom";
}

// Create spin from template - generates fresh items each time
const createSpinFromTemplate = (template: SpinTemplate): ScriptedSpin => {
  const isEpicRarity = template.winningItem.rarity === "legendary" || template.winningItem.rarity === "mythic";
  // More items for legendary/mythic to allow for longer epic spin animation
  const totalItems = isEpicRarity ? 200 : 50;
  const winningPosition = isEpicRarity
    ? 150 + Math.floor(Math.random() * 20) // Win at position 150-169 for epic
    : 35 + Math.floor(Math.random() * 10); // Win at position 35-44 for normal

  return {
    items: generateSpinItems(template.winningItem, winningPosition, totalItems),
    winningIndex: winningPosition,
    duration: template.duration,
    easing: template.easing,
  };
};

// Create spin template (not the actual spin)
const createSpinTemplate = (
  winningItem: SpinItem,
  duration: number = 5000,
  easing: "easeOut" | "easeInOut" | "custom" = "easeOut"
): SpinTemplate => ({
  winningItem,
  duration,
  easing,
});

// ========================================
// KLENKO's New Year Gifts (10 gifts total)
// Storyline: From coal to Christmas miracles
// ========================================
const KLENKO_TEMPLATES: SpinTemplate[] = [
  createSpinTemplate(COMMON_ITEMS[0], 4000), // Кусочек Угля
  createSpinTemplate(COMMON_ITEMS[3], 4500), // Мелкий Уголёк
  createSpinTemplate(UNCOMMON_ITEMS[1], 5000), // Подарочная Коробка
  createSpinTemplate(RARE_ITEMS[0], 5500), // Снежный Шар
  createSpinTemplate(UNCOMMON_ITEMS[6], 4500), // Гирлянда
  createSpinTemplate(EPIC_ITEMS[0], 6000), // Волшебные Сани
  createSpinTemplate(RARE_ITEMS[4], 5000), // Новогодний Свитер
  createSpinTemplate(EPIC_ITEMS[4], 6500), // Посох Мороза
  createSpinTemplate(LEGENDARY_ITEMS[0], 7000), // Шапка Деда Мороза
  createSpinTemplate(MYTHIC_ITEMS[2], 8000), // Дух Рождества
];

// ========================================
// HOHOYKS's New Year Gifts (10 gifts total)
// Storyline: Lucky gifts from the start!
// ========================================
const HOHOYKS_TEMPLATES: SpinTemplate[] = [
  createSpinTemplate(UNCOMMON_ITEMS[1], 4000), // Подарочная Коробка
  createSpinTemplate(RARE_ITEMS[1], 5000), // Коньки
  createSpinTemplate(COMMON_ITEMS[5], 4000), // Старый Уголь
  createSpinTemplate(EPIC_ITEMS[1], 6000), // Северное Сияние в Бутылке
  createSpinTemplate(RARE_ITEMS[2], 5000), // Щелкунчик
  createSpinTemplate(UNCOMMON_ITEMS[5], 4500), // Бубенцы
  createSpinTemplate(LEGENDARY_ITEMS[3], 7000), // Рождественское Чудо
  createSpinTemplate(EPIC_ITEMS[3], 5500), // Золотой Колокол
  createSpinTemplate(LEGENDARY_ITEMS[4], 7500), // Золотая Ёлка
  createSpinTemplate(MYTHIC_ITEMS[0], 8500), // Мешок Деда Мороза
];

// Generate spin on demand
export const generateSpin = (nickname: string, spinIndex: number): ScriptedSpin | null => {
  const templates = nickname.toUpperCase() === "KLENKO" ? KLENKO_TEMPLATES : HOHOYKS_TEMPLATES;
  if (spinIndex < 0 || spinIndex >= templates.length) return null;
  return createSpinFromTemplate(templates[spinIndex]);
};

export const getSpinCount = (nickname: string): number => {
  const templates = nickname.toUpperCase() === "KLENKO" ? KLENKO_TEMPLATES : HOHOYKS_TEMPLATES;
  return templates.length;
};

// ========================================
// Player Data (without spins - they are generated dynamically)
// ========================================
export interface PlayerInfo {
  id: string;
  nickname: string;
  avatar: string;
}

export const PLAYERS: Record<string, PlayerInfo> = {
  KLENKO: {
    id: "klenko",
    nickname: "KLENKO",
    avatar: "🎅",
  },
  HOHOYKS: {
    id: "hohoyks",
    nickname: "HOHOYKS",
    avatar: "🎄",
  },
};

// Valid nicknames
export const VALID_NICKNAMES = ["KLENKO", "HOHOYKS"];

// Check if nickname is valid
export const isValidNickname = (nickname: string): boolean => {
  return VALID_NICKNAMES.includes(nickname.toUpperCase());
};

// Get player info by nickname
export const getPlayerInfo = (nickname: string): PlayerInfo | undefined => {
  const upperNickname = nickname.toUpperCase();
  return PLAYERS[upperNickname];
};
