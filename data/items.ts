import type { SpinItem, Rarity } from "@/types/spin";

const createItem = (
  id: string,
  name: string,
  description: string,
  rarity: Rarity,
  emoji: string,
  imageUrl?: string
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
    ...(imageUrl && { imageUrl }),
    color: rarityColors[rarity].color,
    glowColor: rarityColors[rarity].glowColor,
  };
};

// ========================================
// Пул предметов для Klenkozarashi - "невезучий" персонаж
// ========================================
export const KLENKO_ITEMS: SpinItem[] = [
  // Common (5 предметов) - уголь
  createItem("klenko_coal_piece", "Кусочек Угля", "Санта был в ярости!", "common", "⬛", "/images/coal.png"),
  createItem("klenko_coal_chunk", "Угольный Брикет", "Можно топить печку год!", "common", "🪨", "/images/coal_bag.png"),
  createItem("klenko_coal_dust", "Угольная Пыль", "Теперь ты тоже чёрный", "common", "🖤", "/images/coal_dust.png"),
  createItem("klenko_coal_shiny", "Блестящий Уголь", "Почти алмаз... почти.", "common", "💎"),
  createItem("klenko_coal_gift", "Уголь в Обёртке", "Сюрприз! Это снова уголь.", "common", "🎁"),

  // Uncommon (3 предмета)
  createItem("klenko_christmas_ball", "Ёлочный Шар", "Уля украсила блёстками специально для тебя", "uncommon", "🔴"),
  createItem("klenko_gift_box", "Подарочная Коробка", "Уля сказала не открывать без неё!", "uncommon", "🎁"),
  createItem("klenko_star_cookie", "Звёздное Печенье", "Уля испекла! Один луч уже откусила сама", "uncommon", "⭐"),

  // Rare (2 предмета)
  createItem("klenko_snow_globe", "Снежный Шар", "Потряси! Ещё! ЕЩЁ!", "rare", "🔮"),
  createItem("klenko_misa_foil", "Миса в Фольге", "Защита от инопланетян!", "rare", "🪖", "/images/misa_foil_hat.jpg"),

  // Epic (2 предмета)
  createItem("klenko_misa_propeller", "Миса с Пропеллером", "Готова к взлёту!", "epic", "🛷", "/images/misa_propeller_hat.jpg"),
  createItem("klenko_blood_crystal", "Кровавый Кристалл", "Лизни его. Давай, лизни.", "epic", "💎", "/images/blood_crystal.png"),

  // Legendary (2 предмета)
  createItem("klenko_misa_new_year", "Новогодняя Миса", "Твои подарки тоже открыла. Упс.", "legendary", "🎅", "/images/misa_new_year.png"),
  createItem("klenko_misa_pixel", "Пиксельная Миса", "8 бит чистого счастья!", "legendary", "🎁", "/images/misa_pixel.png"),

  // Mythic (1 предмет)
  createItem("klenko_misa_winter_devil", "Миса Зимний Демон", "Съела все морковки снеговиков в районе", "mythic", "🎒", "/images/misa_winter_devil.png"),
];

// Divine для Klenkozarashi
export const KLENKO_DIVINE: SpinItem[] = [
  createItem("klenko_minecraft_key", "🎁 Ключ Minecraft для Klenkozarashi", "Особый подарок от создателя! Лицензия Minecraft Java Edition", "divine", "🔑"),
];

// ========================================
// АДСКИЕ ВЕРСИИ предметов для Klenkozarashi (когда реальность искажается)
// ========================================
export const KLENKO_HELLISH_ITEMS: SpinItem[] = [
  // Common (4 предмета)
  createItem("klenko_hell_coal_piece", "🔥 Адский Уголь", "Руки уже горят, да?", "common", "🔥", "/images/hell_coal.png"),
  createItem("klenko_hell_coal_dust", "🔥 Пепел Проклятых", "Бывший грешник. Теперь пыль.", "common", "☠️"),
  createItem("klenko_hell_coal_shiny", "🔥 Кровавый Алмаз", "Красиво? Это кровь.", "common", "💎"),
  createItem("klenko_hell_coal_gift", "🔥 Проклятый Дар", "Не открывай. Серьёзно.", "common", "👹"),

  // Uncommon (3 предмета)
  createItem("klenko_hell_gift_box", "🔥 Ящик Пандоры", "Открыл? Ну, удачи.", "uncommon", "📦"),
  createItem("klenko_hell_wreath", "🔥 Венок Шипов", "Примерь! Будет весело!", "uncommon", "🥀"),
  createItem("klenko_hell_star_cookie", "🔥 Печенье Отчаяния", "На вкус как твои слёзы", "uncommon", "🍪", "/images/hell_cookie.png"),

  // Rare (2 предмета)
  createItem("klenko_hell_snow_globe", "🔥 Шар Кошмаров", "Потряси. Увидишь свой страх.", "rare", "🌑"),
  createItem("klenko_hell_nutcracker", "🔥 Костолом", "Орехи? Какие орехи?", "rare", "💀"),

  // Epic (2 предмета)
  createItem("klenko_hell_magic_sleigh", "🔥 Колесница Ада", "Следующая остановка: вечность", "epic", "🛷"),
  createItem("klenko_hell_aurora_bottle", "🔥 Кровавое Сияние", "Северное сияние, но больнее", "epic", "🩸"),

  // Legendary (1 предмет)
  createItem("klenko_hell_misa_devil", "🔥 Демон Миса", "Ангел? Не, не слышала!", "legendary", "👹", "/images/misa_devil.png"),

  // Mythic (1 предмет)
  createItem("klenko_hell_santas_bag", "🔥 Мешок Душ", "Твоя тоже поместится!", "mythic", "👻"),
];

// Divine для Klenkozarashi в адском режиме
export const KLENKO_HELLISH_DIVINE: SpinItem[] = [
  createItem("klenko_hell_minecraft_key", "🔥 Проклятый Ключ Minecraft", "Ключ, выкованный в аду! Лицензия Minecraft Java Edition... но какой ценой?", "divine", "🗝️"),
];

// ========================================
// Пул предметов для HOHOYKS - "удачливый" персонаж
// ========================================
export const HOHOYKS_ITEMS: SpinItem[] = [
  // Common (3 предмета)
  createItem("hohoyks_snowflake", "Снежинка", "Аня подула - улетела к тебе!", "common", "❄️"),
  createItem("hohoyks_candy_cane", "Леденец", "Застрял в волосах у Ани", "common", "🍬"),
  createItem("hohoyks_stocking", "Рождественский носок", "Аня туда спрятала мандаринку для тебя", "common", "🧦"),

  // Uncommon (4 предмета)
  createItem("hohoyks_snowman_hat", "Шляпа Снеговика", "Аня сказала что тебе точно пойдёт!", "uncommon", "🎩"),
  createItem("hohoyks_jingle_bells", "Бубенцы", "Аня звенит ими когда скучает по тебе", "uncommon", "🎶"),
  createItem("hohoyks_christmas_lights", "Гирлянда", "Аня запуталась в ней. Опять.", "uncommon", "✨"),
  createItem("hohoyks_gingerbread", "Пряничный человечек", "Кричит 'НЕ МЕНЯ!' при виде молока", "uncommon", "🍪"),

  // Rare (4 предмета)
  createItem("hohoyks_oksik_road", "Оксик на Машинке", "Скорость: максимальная. Направление: неизвестно", "rare", "🦌", "/images/oksik_road.png"),
  createItem("hohoyks_oksik_crochet", "Оксик-Рукодельник", "Клубок ниток боится его", "rare", "🧥", "/images/oksik_crochet.png"),
  createItem("hohoyks_oksik_dance", "Танцующий Оксик", "Танцует даже когда музыки нет. Милоооо.", "rare", "🎵", "/images/oksik_dance.png"),
  createItem("hohoyks_oksik_pixel", "Пиксельный Оксик", "8 бит, 100% милоты", "rare", "💫", "/images/oksik_pixel.png"),

  // Epic (2 предмета)
  createItem("hohoyks_golden_bell", "Золотой Колокол", "Дин-дон, ты богат!", "epic", "🔔"),
  createItem("hohoyks_frost_wand", "Волшебная Сосулька", "Лизни её! Язык к ней точно не прилипнет... наверное", "epic", "🧊"),

  // Legendary (2 предмета)
  createItem("hohoyks_oksik_sledge", "Оксик на Санках", "Тормоза для слабаков!", "legendary", "✨", "/images/oksik_on_sledge.png"),
  createItem("hohoyks_golden_tree", "Золотая Ёлка", "Соседи ослепли от зависти!", "legendary", "🌟"),

  // Mythic (1 предмет)
  createItem("hohoyks_oksik_new_year", "Новогодний Оксик", "Съел 47 мандаринов. Не останавливается.", "mythic", "💎", "/images/oksik_new_year.png"),
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
  if (upperNickname === "KLENKOZARASHI") {
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
