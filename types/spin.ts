export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "divine";

export interface SpinItem {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  image: string;
  color: string;
  glowColor: string;
  sound?: string;
}

export interface SpinResult {
  item: SpinItem;
  spinIndex: number;
  timestamp: number;
}

export interface ScriptedSpin {
  items: SpinItem[];
  winningIndex: number;
  duration: number;
  easing: "easeOut" | "easeInOut" | "custom";
}

export interface PlayerData {
  id: string;
  nickname: string;
  avatar: string;
  spins: ScriptedSpin[];
  currentSpinIndex: number;
  inventory: SpinResult[];
}

export interface GameState {
  isAuthenticated: boolean;
  currentPlayer: PlayerData | null;
  isSpinning: boolean;
  lastResult: SpinResult | null;
  showVictoryScreen: boolean;
}

export const RARITY_CONFIG: Record<Rarity, {
  name: string;
  color: string;
  glowColor: string;
  bgGradient: string;
  borderColor: string;
  particleColor: string;
  soundIntensity: number;
  confettiCount: number;
  screenShake: boolean;
  specialEffect: string | null;
}> = {
  common: {
    name: "Обычный",
    color: "#a8d5ba",
    glowColor: "rgba(168, 213, 186, 0.5)",
    bgGradient: "linear-gradient(135deg, #1a472a, #2d5a3d)",
    borderColor: "#3d7a4f",
    particleColor: "#a8d5ba",
    soundIntensity: 0.3,
    confettiCount: 0,
    screenShake: false,
    specialEffect: null,
  },
  uncommon: {
    name: "Необычный",
    color: "#2dd4bf",
    glowColor: "rgba(45, 212, 191, 0.5)",
    bgGradient: "linear-gradient(135deg, #115e59, #14b8a6)",
    borderColor: "#0d9488",
    particleColor: "#2dd4bf",
    soundIntensity: 0.4,
    confettiCount: 20,
    screenShake: false,
    specialEffect: null,
  },
  rare: {
    name: "Редкий",
    color: "#60a5fa",
    glowColor: "rgba(96, 165, 250, 0.6)",
    bgGradient: "linear-gradient(135deg, #1e3a5f, #3b82f6)",
    borderColor: "#2563eb",
    particleColor: "#60a5fa",
    soundIntensity: 0.6,
    confettiCount: 50,
    screenShake: true,
    specialEffect: "snowflakes",
  },
  epic: {
    name: "Эпический",
    color: "#c084fc",
    glowColor: "rgba(192, 132, 252, 0.7)",
    bgGradient: "linear-gradient(135deg, #581c87, #a855f7)",
    borderColor: "#9333ea",
    particleColor: "#c084fc",
    soundIntensity: 0.8,
    confettiCount: 100,
    screenShake: true,
    specialEffect: "aurora",
  },
  legendary: {
    name: "Легендарный",
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.8)",
    bgGradient: "linear-gradient(135deg, #92400e, #f59e0b, #fcd34d)",
    borderColor: "#f59e0b",
    particleColor: "#fbbf24",
    soundIntensity: 1.0,
    confettiCount: 200,
    screenShake: true,
    specialEffect: "golden_snow",
  },
  mythic: {
    name: "Мифический",
    color: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.9)",
    bgGradient: "linear-gradient(135deg, #be123c, #f43f5e, #fbbf24, #a855f7)",
    borderColor: "#e11d48",
    particleColor: "#f43f5e",
    soundIntensity: 1.0,
    confettiCount: 500,
    screenShake: true,
    specialEffect: "christmas_miracle",
  },
  divine: {
    name: "Божественный",
    color: "#ffffff",
    glowColor: "rgba(255, 255, 255, 1.0)",
    bgGradient: "linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
    borderColor: "#ffffff",
    particleColor: "#ffffff",
    soundIntensity: 1.0,
    confettiCount: 1000,
    screenShake: true,
    specialEffect: "divine_blessing",
  },
};
