// Система достижений

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: string; // За что получено достижение
  emoji: string;
  // Для кого доступно: "all" | "KLENKOZARASHI" | "HOHOYKS"
  forPlayer: "all" | "KLENKOZARASHI" | "HOHOYKS";
  hidden?: boolean; // Скрытое достижение - название и условие не видны пока не получишь
}

// Все достижения
export const ACHIEVEMENTS: Achievement[] = [
  // === Общие ===
  {
    id: "first_spin",
    name: "Первый раз",
    description: "Начало положено!",
    requirement: "Сделать первую крутку",
    emoji: "🎰",
    forPlayer: "all",
  },
  {
    id: "ten_spins",
    name: "Десяточка",
    description: "Разогрев окончен!",
    requirement: "Сделать 10 круток",
    emoji: "🔟",
    forPlayer: "all",
  },
  {
    id: "rainbow",
    name: "Радуга",
    description: "Полный спектр!",
    requirement: "Собрать предметы 5 разных редкостей",
    emoji: "🌈",
    forPlayer: "all",
  },
  {
    id: "divine_drop",
    name: "Божественный",
    description: "ТЫ СДЕЛАЛ ЭТО!",
    requirement: "Получить божественный предмет",
    emoji: "👑",
    forPlayer: "all",
  },

  // === Для Ани (Klenkozarashi) ===
  {
    id: "coal_magnat",
    name: "Угольный Магнат",
    description: "Санта точно тебя запомнил",
    requirement: "Собрать 5 разных видов угля",
    emoji: "⛏️",
    forPlayer: "KLENKOZARASHI",
  },
  {
    id: "hell_tourist",
    name: "Адский Турист",
    description: "Добро пожаловать в ад!",
    requirement: "Попасть в адский режим",
    emoji: "😈",
    forPlayer: "KLENKOZARASHI",
    hidden: true,
  },
  {
    id: "misa_collector",
    name: "Миса-коллекционер",
    description: "Полный кошачий набор!",
    requirement: "Собрать всех Мис",
    emoji: "🐱",
    forPlayer: "KLENKOZARASHI",
  },
  {
    id: "unlucky",
    name: "Невезучая",
    description: "Ну хоть тепло будет...",
    requirement: "Получить 3 угля подряд",
    emoji: "😭",
    forPlayer: "KLENKOZARASHI",
  },
  {
    id: "unexpected_luck",
    name: "Неожиданно!",
    description: "Уля не поверит!",
    requirement: "Выбить legendary в первых 10 крутках",
    emoji: "🍀",
    forPlayer: "KLENKOZARASHI",
  },

  // === Для Ули (Hohoyks) ===
  {
    id: "oksik_mania",
    name: "Оксик-мания",
    description: "Армия Оксиков готова!",
    requirement: "Собрать всех Оксиков",
    emoji: "🦌",
    forPlayer: "HOHOYKS",
  },
  {
    id: "infinity",
    name: "Бесконечность",
    description: "Время не властно над тобой",
    requirement: "Получить Крутку Бесконечности",
    emoji: "♾️",
    forPlayer: "HOHOYKS",
    hidden: true,
  },
  {
    id: "lucky",
    name: "Везунчик",
    description: "Срочно скинь Ане!",
    requirement: "Выбить epic или выше в первых 5 крутках",
    emoji: "⚡",
    forPlayer: "HOHOYKS",
  },
];

// Получить достижения для игрока
export const getPlayerAchievements = (nickname: string): Achievement[] => {
  const upper = nickname.toUpperCase();
  return ACHIEVEMENTS.filter(
    (a) => a.forPlayer === "all" || a.forPlayer === upper
  );
};

// Получить достижение по ID
export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find((a) => a.id === id);
};

// ID предметов для проверки достижений
export const COAL_ITEM_IDS = [
  "klenko_coal_piece",
  "klenko_coal_chunk",
  "klenko_coal_dust",
  "klenko_coal_shiny",
  "klenko_coal_gift",
];

export const MISA_ITEM_IDS = [
  "klenko_misa_foil",
  "klenko_misa_propeller",
  "klenko_misa_new_year",
  "klenko_misa_pixel",
  "klenko_misa_winter_devil",
];

export const OKSIK_ITEM_IDS = [
  "hohoyks_oksik_road",
  "hohoyks_oksik_crochet",
  "hohoyks_oksik_dance",
  "hohoyks_oksik_pixel",
  "hohoyks_oksik_sledge",
  "hohoyks_oksik_new_year",
];
