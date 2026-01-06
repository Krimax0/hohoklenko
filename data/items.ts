import type { SpinItem, Rarity } from "@/types/spin";

const createItem = (
  id: string,
  name: string,
  description: string,
  rarity: Rarity,
  emoji: string
): SpinItem => {
  const rarityColors: Record<Rarity, { color: string; glowColor: string }> = {
    common: { color: "#a8d5ba", glowColor: "rgba(168, 213, 186, 0.5)" },
    uncommon: { color: "#2dd4bf", glowColor: "rgba(45, 212, 191, 0.5)" },
    rare: { color: "#60a5fa", glowColor: "rgba(96, 165, 250, 0.6)" },
    epic: { color: "#c084fc", glowColor: "rgba(192, 132, 252, 0.7)" },
    legendary: { color: "#fbbf24", glowColor: "rgba(251, 191, 36, 0.8)" },
    mythic: { color: "#f43f5e", glowColor: "rgba(244, 63, 94, 0.9)" },
  };

  return {
    id,
    name,
    description,
    rarity,
    image: emoji,
    color: rarityColors[rarity].color,
    glowColor: rarityColors[rarity].glowColor,
  };
};

// COMMON ITEMS - Уголь для непослушных!
export const COMMON_ITEMS: SpinItem[] = [
  createItem("coal_piece", "Кусочек Угля", "Для непослушных детей", "common", "⬛"),
  createItem("coal_chunk", "Угольный Брикет", "Крупный и чёрный", "common", "🪨"),
  createItem("coal_dust", "Угольная Пыль", "Пачкает руки", "common", "🖤"),
  createItem("coal_small", "Мелкий Уголёк", "Совсем крошечный", "common", "◾"),
  createItem("coal_shiny", "Блестящий Уголь", "Почти как алмаз... но нет", "common", "💎"),
  createItem("coal_old", "Старый Уголь", "Из прошлого года", "common", "⚫"),
  createItem("coal_warm", "Тёплый Уголь", "Ещё не остыл", "common", "🔥"),
  createItem("coal_gift", "Уголь в Обёртке", "Подарок? Сюрприз!", "common", "🎁"),
];

// UNCOMMON ITEMS - Хорошие подарки
export const UNCOMMON_ITEMS: SpinItem[] = [
  createItem("christmas_ball", "Ёлочный Шар", "Сверкает огнями гирлянды", "uncommon", "🔴"),
  createItem("gift_box", "Подарочная Коробка", "Что же внутри?", "uncommon", "🎁"),
  createItem("wreath", "Рождественский Венок", "Украшен красными ягодами", "uncommon", "💚"),
  createItem("star_cookie", "Звёздное Печенье", "Покрыто глазурью", "uncommon", "⭐"),
  createItem("snowman_hat", "Шляпа Снеговика", "Немного потрёпанная", "uncommon", "🎩"),
  createItem("jingle_bells", "Бубенцы", "Дзинь-дзинь-дзинь!", "uncommon", "🎶"),
  createItem("christmas_lights", "Гирлянда", "Мигает разными цветами", "uncommon", "✨"),
  createItem("eggnog", "Гоголь-Моголь", "Праздничный напиток", "uncommon", "🥛"),
];

// RARE ITEMS - Особенные подарки
export const RARE_ITEMS: SpinItem[] = [
  createItem("snow_globe", "Снежный Шар", "Внутри миниатюрная зима", "rare", "🔮"),
  createItem("ice_skates", "Коньки", "Для катания по льду", "rare", "⛸️"),
  createItem("nutcracker", "Щелкунчик", "Деревянный солдатик", "rare", "🪖"),
  createItem("reindeer_plush", "Плюшевый Олень", "Мягкий и пушистый", "rare", "🦌"),
  createItem("christmas_sweater", "Новогодний Свитер", "С оленями и ёлками", "rare", "🧥"),
  createItem("music_box", "Музыкальная Шкатулка", "Играет 'Jingle Bells'", "rare", "🎵"),
  createItem("crystal_star", "Хрустальная Звезда", "Для верхушки ёлки", "rare", "💫"),
];

// EPIC ITEMS - Волшебные подарки
export const EPIC_ITEMS: SpinItem[] = [
  createItem("magic_sleigh", "Волшебные Сани", "Летят по небу!", "epic", "🛷"),
  createItem("aurora_bottle", "Северное Сияние в Бутылке", "Переливается всеми цветами", "epic", "🌌"),
  createItem("eternal_wreath", "Вечнозелёный Венок", "Никогда не увядает", "epic", "🌿"),
  createItem("golden_bell", "Золотой Колокол", "Исполняет желания при звоне", "epic", "🔔"),
  createItem("frost_wand", "Посох Мороза", "Создаёт снежинки", "epic", "🪄"),
  createItem("enchanted_ornament", "Зачарованный Шар", "Показывает будущий год", "epic", "🎄"),
];

// LEGENDARY ITEMS - Легендарные сокровища
export const LEGENDARY_ITEMS: SpinItem[] = [
  createItem("santas_hat", "Шапка Деда Мороза", "Настоящая! Тёплая и волшебная", "legendary", "🎅"),
  createItem("reindeer_antlers", "Рога Рудольфа", "Светятся в темноте!", "legendary", "✨"),
  createItem("infinite_gift", "Бесконечный Подарок", "Каждый раз новый сюрприз", "legendary", "🎁"),
  createItem("christmas_miracle", "Рождественское Чудо", "Исполняет одно желание", "legendary", "⭐"),
  createItem("golden_tree", "Золотая Ёлка", "Сияет ярче солнца", "legendary", "🌟"),
];

// MYTHIC ITEMS - Мифические артефакты Нового Года
export const MYTHIC_ITEMS: SpinItem[] = [
  createItem("santas_bag", "Мешок Деда Мороза", "Вмещает все подарки мира", "mythic", "🎒"),
  createItem("time_crystal", "Кристалл Времени", "Останавливает полночь навечно", "mythic", "💎"),
  createItem("spirit_of_christmas", "Дух Рождества", "Чистая магия праздника", "mythic", "👼"),
  createItem("eternal_snow", "Вечный Снег", "Падает только для тебя", "mythic", "🌨️"),
];

// ALL ITEMS
export const ALL_ITEMS: SpinItem[] = [
  ...COMMON_ITEMS,
  ...UNCOMMON_ITEMS,
  ...RARE_ITEMS,
  ...EPIC_ITEMS,
  ...LEGENDARY_ITEMS,
  ...MYTHIC_ITEMS,
];

// Helper function to get items by rarity
export const getItemsByRarity = (rarity: Rarity): SpinItem[] => {
  switch (rarity) {
    case "common":
      return COMMON_ITEMS;
    case "uncommon":
      return UNCOMMON_ITEMS;
    case "rare":
      return RARE_ITEMS;
    case "epic":
      return EPIC_ITEMS;
    case "legendary":
      return LEGENDARY_ITEMS;
    case "mythic":
      return MYTHIC_ITEMS;
    default:
      return COMMON_ITEMS;
  }
};

// Helper function to get a specific item by ID
export const getItemById = (id: string): SpinItem | undefined => {
  return ALL_ITEMS.find((item) => item.id === id);
};
