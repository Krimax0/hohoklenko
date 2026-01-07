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
    divine: { color: "#ffffff", glowColor: "rgba(255, 255, 255, 1.0)" },
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

// ========================================
// Пул предметов для KLENKO - "невезучий" персонаж
// ========================================
export const KLENKO_ITEMS: SpinItem[] = [
  // Common (8 предметов) - много угля
  createItem("klenko_coal_piece", "Кусочек Угля", "Для непослушных детей", "common", "⬛"),
  createItem("klenko_coal_chunk", "Угольный Брикет", "Крупный и чёрный", "common", "🪨"),
  createItem("klenko_coal_dust", "Угольная Пыль", "Пачкает руки", "common", "🖤"),
  createItem("klenko_coal_small", "Мелкий Уголёк", "Совсем крошечный", "common", "◾"),
  createItem("klenko_coal_shiny", "Блестящий Уголь", "Почти как алмаз... но нет", "common", "💎"),
  createItem("klenko_coal_old", "Старый Уголь", "Из прошлого года", "common", "⚫"),
  createItem("klenko_coal_warm", "Тёплый Уголь", "Ещё не остыл", "common", "🔥"),
  createItem("klenko_coal_gift", "Уголь в Обёртке", "Подарок? Сюрприз!", "common", "🎁"),

  // Uncommon (4 предмета)
  createItem("klenko_christmas_ball", "Ёлочный Шар", "Сверкает огнями гирлянды", "uncommon", "🔴"),
  createItem("klenko_gift_box", "Подарочная Коробка", "Что же внутри?", "uncommon", "🎁"),
  createItem("klenko_wreath", "Рождественский Венок", "Украшен красными ягодами", "uncommon", "💚"),
  createItem("klenko_star_cookie", "Звёздное Печенье", "Покрыто глазурью", "uncommon", "⭐"),

  // Rare (3 предмета)
  createItem("klenko_snow_globe", "Снежный Шар", "Внутри миниатюрная зима", "rare", "🔮"),
  createItem("klenko_ice_skates", "Коньки", "Для катания по льду", "rare", "⛸️"),
  createItem("klenko_nutcracker", "Щелкунчик", "Деревянный солдатик", "rare", "🪖"),

  // Epic (2 предмета)
  createItem("klenko_magic_sleigh", "Волшебные Сани", "Летят по небу!", "epic", "🛷"),
  createItem("klenko_aurora_bottle", "Северное Сияние в Бутылке", "Переливается всеми цветами", "epic", "🌌"),

  // Legendary (2 предмета)
  createItem("klenko_santas_hat", "Шапка Деда Мороза", "Настоящая! Тёплая и волшебная", "legendary", "🎅"),
  createItem("klenko_infinite_gift", "Бесконечный Подарок", "Каждый раз новый сюрприз", "legendary", "🎁"),

  // Mythic (1 предмет)
  createItem("klenko_santas_bag", "Мешок Деда Мороза", "Вмещает все подарки мира", "mythic", "🎒"),
];

// Divine для KLENKO
export const KLENKO_DIVINE: SpinItem[] = [
  createItem("klenko_minecraft_key", "🎁 Ключ Minecraft для KLENKO", "Особый подарок от создателя! Лицензия Minecraft Java Edition", "divine", "🔑"),
];

// ========================================
// АДСКИЕ ВЕРСИИ предметов для KLENKO (когда реальность искажается)
// ========================================
export const KLENKO_HELLISH_ITEMS: SpinItem[] = [
  // Common (8 предметов) - адский уголь
  createItem("klenko_hell_coal_piece", "🔥 Адский Уголь", "Горит вечным пламенем", "common", "🔥"),
  createItem("klenko_hell_coal_chunk", "🔥 Пылающий Брикет", "Обжигает душу", "common", "💀"),
  createItem("klenko_hell_coal_dust", "🔥 Пепел Проклятых", "Остатки грешников", "common", "☠️"),
  createItem("klenko_hell_coal_small", "🔥 Искра Ада", "Маленькая, но опасная", "common", "⚡"),
  createItem("klenko_hell_coal_shiny", "🔥 Кровавый Алмаз", "Пропитан страданиями", "common", "💎"),
  createItem("klenko_hell_coal_old", "🔥 Древний Пепел", "Из первого круга ада", "common", "🌑"),
  createItem("klenko_hell_coal_warm", "🔥 Жар Преисподней", "Никогда не остынет", "common", "🌋"),
  createItem("klenko_hell_coal_gift", "🔥 Проклятый Дар", "Подарок от самого дьявола", "common", "👹"),

  // Uncommon (4 предмета)
  createItem("klenko_hell_christmas_ball", "🔥 Шар Проклятий", "Отражает твои грехи", "uncommon", "🔴"),
  createItem("klenko_hell_gift_box", "🔥 Ящик Пандоры", "Лучше не открывать", "uncommon", "📦"),
  createItem("klenko_hell_wreath", "🔥 Венок Шипов", "Колючий и опасный", "uncommon", "🥀"),
  createItem("klenko_hell_star_cookie", "🔥 Печенье Отчаяния", "Горькое на вкус", "uncommon", "🍪"),

  // Rare (3 предмета)
  createItem("klenko_hell_snow_globe", "🔥 Шар Кошмаров", "Внутри вечная тьма", "rare", "🌑"),
  createItem("klenko_hell_ice_skates", "🔥 Коньки Страданий", "Режут по льду ада", "rare", "⛸️"),
  createItem("klenko_hell_nutcracker", "🔥 Костолом", "Ломает не только орехи", "rare", "💀"),

  // Epic (2 предмета)
  createItem("klenko_hell_magic_sleigh", "🔥 Колесница Ада", "Везет прямо в преисподнюю", "epic", "🛷"),
  createItem("klenko_hell_aurora_bottle", "🔥 Кровавое Сияние", "Северное сияние из ада", "epic", "🩸"),

  // Legendary (2 предмета)
  createItem("klenko_hell_santas_hat", "🔥 Шапка Крампуса", "Носит демон Рождества", "legendary", "👹"),
  createItem("klenko_hell_infinite_gift", "🔥 Бесконечное Проклятие", "Дарит только страдания", "legendary", "💀"),

  // Mythic (1 предмет)
  createItem("klenko_hell_santas_bag", "🔥 Мешок Душ", "Вмещает души грешников", "mythic", "👻"),
];

// Divine для KLENKO в адском режиме
export const KLENKO_HELLISH_DIVINE: SpinItem[] = [
  createItem("klenko_hell_minecraft_key", "🔥 Проклятый Ключ Minecraft", "Ключ, выкованный в аду! Лицензия Minecraft Java Edition... но какой ценой?", "divine", "🗝️"),
];

// ========================================
// Пул предметов для HOHOYKS - "удачливый" персонаж
// ========================================
export const HOHOYKS_ITEMS: SpinItem[] = [
  // Common (5 предметов) - меньше угля
  createItem("hohoyks_snowflake", "Снежинка", "Уникальная и прекрасная", "common", "❄️"),
  createItem("hohoyks_candy_cane", "Леденец", "Мятный и сладкий", "common", "🍬"),
  createItem("hohoyks_mittens", "Варежки", "Тёплые и уютные", "common", "🧤"),
  createItem("hohoyks_ornament", "Ёлочная игрушка", "Блестящая и яркая", "common", "🎀"),
  createItem("hohoyks_stocking", "Рождественский носок", "Для подарков", "common", "🧦"),

  // Uncommon (5 предметов)
  createItem("hohoyks_snowman_hat", "Шляпа Снеговика", "Немного потрёпанная", "uncommon", "🎩"),
  createItem("hohoyks_jingle_bells", "Бубенцы", "Дзинь-дзинь-дзинь!", "uncommon", "🎶"),
  createItem("hohoyks_christmas_lights", "Гирлянда", "Мигает разными цветами", "uncommon", "✨"),
  createItem("hohoyks_eggnog", "Гоголь-Моголь", "Праздничный напиток", "uncommon", "🥛"),
  createItem("hohoyks_gingerbread", "Пряничный человечек", "Вкусный и ароматный", "uncommon", "🍪"),

  // Rare (4 предмета)
  createItem("hohoyks_reindeer_plush", "Плюшевый Олень", "Мягкий и пушистый", "rare", "🦌"),
  createItem("hohoyks_christmas_sweater", "Новогодний Свитер", "С оленями и ёлками", "rare", "🧥"),
  createItem("hohoyks_music_box", "Музыкальная Шкатулка", "Играет 'Jingle Bells'", "rare", "🎵"),
  createItem("hohoyks_crystal_star", "Хрустальная Звезда", "Для верхушки ёлки", "rare", "💫"),

  // Epic (3 предмета)
  createItem("hohoyks_eternal_wreath", "Вечнозелёный Венок", "Никогда не увядает", "epic", "🌿"),
  createItem("hohoyks_golden_bell", "Золотой Колокол", "Исполняет желания при звоне", "epic", "🔔"),
  createItem("hohoyks_frost_wand", "Посох Мороза", "Создаёт снежинки", "epic", "🪄"),

  // Legendary (2 предмета)
  createItem("hohoyks_reindeer_antlers", "Рога Рудольфа", "Светятся в темноте!", "legendary", "✨"),
  createItem("hohoyks_golden_tree", "Золотая Ёлка", "Сияет ярче солнца", "legendary", "🌟"),

  // Mythic (1 предмет)
  createItem("hohoyks_time_crystal", "Кристалл Времени", "Останавливает полночь навечно", "mythic", "💎"),
];

// SECRET LEGENDARY для HOHOYKS - Крутка Бесконечности
export const HOHOYKS_SECRET_LEGENDARY: SpinItem =
  createItem("hohoyks_infinity_spin", "⚡ Крутка Бесконечности ⚡", "Легендарный артефакт из альтернативной вселенной! Дарует бесконечные крутки!", "legendary", "♾️");

// Divine для HOHOYKS
export const HOHOYKS_DIVINE: SpinItem[] = [
  createItem("hohoyks_minecraft_key", "🎁 Ключ Minecraft для HOHOYKS", "Особый подарок от создателя! Лицензия Minecraft Java Edition", "divine", "🔑"),
];

// Отдельные divine предметы для прямого доступа
export const KLENKO_DIVINE_ITEM: SpinItem = KLENKO_DIVINE[0];
export const HOHOYKS_DIVINE_ITEM: SpinItem = HOHOYKS_DIVINE[0];
export const KLENKO_HELLISH_DIVINE_ITEM: SpinItem = KLENKO_HELLISH_DIVINE[0];

// Полные коллекции игроков (включая божественные)
export const KLENKO_ALL_ITEMS: SpinItem[] = [...KLENKO_ITEMS, ...KLENKO_DIVINE];
export const HOHOYKS_ALL_ITEMS: SpinItem[] = [...HOHOYKS_ITEMS, ...HOHOYKS_DIVINE];

// Все предметы (для обратной совместимости)
export const ALL_ITEMS: SpinItem[] = [...KLENKO_ALL_ITEMS, ...HOHOYKS_ALL_ITEMS];

// Helper function to get player's item pool
export const getPlayerItems = (nickname: string, hellMode: boolean = false): SpinItem[] => {
  const upperNickname = nickname.toUpperCase();
  if (upperNickname === "KLENKO") {
    // В адском режиме возвращаем адские предметы с адским divine
    if (hellMode) {
      return [...KLENKO_HELLISH_ITEMS, ...KLENKO_HELLISH_DIVINE];
    }
    return KLENKO_ALL_ITEMS;
  } else if (upperNickname === "HOHOYKS") {
    return HOHOYKS_ALL_ITEMS;
  }
  return [];
};

// Helper function to get items by rarity for specific player
export const getItemsByRarity = (rarity: Rarity, nickname: string, hellMode: boolean = false): SpinItem[] => {
  const playerItems = getPlayerItems(nickname, hellMode);
  return playerItems.filter(item => item.rarity === rarity);
};

// Helper function to get a specific item by ID
export const getItemById = (id: string): SpinItem | undefined => {
  return ALL_ITEMS.find((item) => item.id === id);
};
