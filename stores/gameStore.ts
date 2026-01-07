import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SpinResult, ScriptedSpin, SpinItem } from "@/types/spin";
import { getPlayerInfo, generateRandomSpin, hasSpinsRemaining } from "@/data/players";
import { HOHOYKS_SECRET_LEGENDARY, KLENKO_HELLISH_ITEMS, KLENKO_DIVINE_ITEM, HOHOYKS_DIVINE_ITEM, KLENKO_HELLISH_DIVINE_ITEM } from "@/data/items";
import type { SpecialMessage } from "./specialMechanics";
import {
  shouldShowLuckMessage,
  getRandomLuckMessage,
  shouldShow30SpinMessage,
  shouldShow40SpinMessage,
  getKlenkoWarning,
  isHellModeActive,
  HOHOYKS_30_SPIN_MESSAGE,
  HOHOYKS_40_SPIN_MESSAGE,
  HOHOYKS_INFINITY_MESSAGE,
  KLENKO_30_SPIN_MESSAGE,
} from "./specialMechanics";

interface PlayerState {
  id: string;
  nickname: string;
  avatar: string;
  currentSpinIndex: number;
  inventory: SpinResult[];
  hasInfinitySpin: boolean; // Получил ли HOHOYKS крутку бесконечности
  hellModeActive: boolean; // Активирован ли адский режим для KLENKO
  lowRaritiesRemoved: boolean; // Удалены ли низкие редкости для HOHOYKS
}

interface GameState {
  isAuthenticated: boolean;
  currentPlayer: PlayerState | null;
  isSpinning: boolean;
  lastResult: SpinResult | null;
  showVictoryScreen: boolean;
  currentSpin: ScriptedSpin | null;
  specialMessage: SpecialMessage | null; // Специальное сообщение для отображения
  showBonusSpin: boolean; // Показать ли бонусную крутку для HOHOYKS
  bonusSpinActive: boolean; // Активна ли бонусная крутка (можно крутить даже без hasMoreSpins)
}

interface GameStore extends GameState {
  // Actions
  login: (nickname: string) => boolean;
  logout: () => void;
  prepareSpin: () => void;
  startSpin: () => void;
  completeSpin: (result: SpinResult) => void;
  closeVictoryScreen: () => void;
  resetPlayer: () => void;
  hasMoreSpins: () => boolean;
  closeSpecialMessage: () => void; // Закрыть специальное сообщение
  activateBonusSpin: () => void; // Активировать бонусную крутку для HOHOYKS
  transformToHellItems: () => void; // Превратить предметы KLENKO в адские
  debugGrantDivine: () => void; // DEBUG: Принудительно выдать божественный предмет
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      currentPlayer: null,
      isSpinning: false,
      lastResult: null,
      showVictoryScreen: false,
      currentSpin: null,
      specialMessage: null,
      showBonusSpin: false,
      bonusSpinActive: false,

      // Login action
      login: (nickname: string) => {
        const playerInfo = getPlayerInfo(nickname);
        if (playerInfo) {
          const firstSpin = generateRandomSpin(nickname, [], false);
          set({
            isAuthenticated: true,
            currentPlayer: {
              id: playerInfo.id,
              nickname: playerInfo.nickname,
              avatar: playerInfo.avatar,
              currentSpinIndex: 0,
              inventory: [],
              hasInfinitySpin: false,
              hellModeActive: false,
              lowRaritiesRemoved: false,
            },
            currentSpin: firstSpin,
            specialMessage: null,
            showBonusSpin: false,
            bonusSpinActive: false,
          });
          return true;
        }
        return false;
      },

      // Logout action
      logout: () => {
        set({
          isAuthenticated: false,
          currentPlayer: null,
          isSpinning: false,
          lastResult: null,
          showVictoryScreen: false,
          currentSpin: null,
          specialMessage: null,
          showBonusSpin: false,
          bonusSpinActive: false,
        });
      },

      // Prepare spin
      prepareSpin: () => {
        const { currentPlayer, currentSpin } = get();
        if (!currentPlayer) return;

        if (currentSpin) return;

        const playerInfo = getPlayerInfo(currentPlayer.nickname);
        if (!playerInfo) return;

        // Для KLENKO разрешаем отрицательные крутки
        const canSpin = currentPlayer.nickname.toUpperCase() === "KLENKO" ||
                       currentPlayer.hasInfinitySpin ||
                       hasSpinsRemaining(currentPlayer.nickname, currentPlayer.currentSpinIndex);

        if (!canSpin) return;

        const collectedItemIds = currentPlayer.inventory.map(r => r.item.id);
        // Проверяем, будет ли следующая крутка 200-й (гарантированный divine)
        const isGuaranteedDivine = currentPlayer.currentSpinIndex === 199;

        const newSpin = generateRandomSpin(
          currentPlayer.nickname,
          collectedItemIds,
          currentPlayer.lowRaritiesRemoved,
          currentPlayer.hellModeActive,
          isGuaranteedDivine
        );
        set({ currentSpin: newSpin });
      },

      // Start spin
      startSpin: () => {
        const { currentPlayer, currentSpin, bonusSpinActive } = get();
        if (!currentPlayer || !currentSpin) return;

        const playerInfo = getPlayerInfo(currentPlayer.nickname);
        if (!playerInfo) return;

        // Для KLENKO разрешаем отрицательные крутки
        // Для бонусной крутки тоже разрешаем
        const canSpin = bonusSpinActive ||
                       currentPlayer.nickname.toUpperCase() === "KLENKO" ||
                       currentPlayer.hasInfinitySpin ||
                       hasSpinsRemaining(currentPlayer.nickname, currentPlayer.currentSpinIndex);

        if (!canSpin) return;

        set({ isSpinning: true, showVictoryScreen: false });
      },

      // Complete spin - ГЛАВНАЯ ЛОГИКА
      completeSpin: (result: SpinResult) => {
        const { currentPlayer } = get();
        if (!currentPlayer) return;

        const newSpinIndex = currentPlayer.currentSpinIndex + 1;
        const updatedInventory = [...currentPlayer.inventory, result];
        let specialMessage: SpecialMessage | null = null;
        let showBonusSpin = false;
        let hasInfinitySpin = currentPlayer.hasInfinitySpin;
        let hellModeActive = currentPlayer.hellModeActive;
        let lowRaritiesRemoved = currentPlayer.lowRaritiesRemoved;

        const isHohoyks = currentPlayer.nickname.toUpperCase() === "HOHOYKS";
        const isKlenko = currentPlayer.nickname.toUpperCase() === "KLENKO";

        // ========================================
        // ЛОГИКА ДЛЯ HOHOYKS
        // ========================================
        if (isHohoyks) {
          // Проверка на получение Крутки Бесконечности
          if (result.item.id === "hohoyks_infinity_spin") {
            hasInfinitySpin = true;
            specialMessage = HOHOYKS_INFINITY_MESSAGE;
          }
          // Проверка на 30-ю крутку (показать сообщение и предложить бонусную крутку)
          else if (shouldShow30SpinMessage(currentPlayer.nickname, newSpinIndex)) {
            specialMessage = HOHOYKS_30_SPIN_MESSAGE;
            showBonusSpin = true;
          }
          // Проверка на 40-ю крутку (удалить низкие редкости)
          else if (shouldShow40SpinMessage(currentPlayer.nickname, newSpinIndex)) {
            lowRaritiesRemoved = true;
            specialMessage = HOHOYKS_40_SPIN_MESSAGE;
          }
          // Случайные сообщения удачи после 30 круток
          else if (shouldShowLuckMessage(newSpinIndex)) {
            specialMessage = {
              type: "info",
              title: "✨ Удача! ✨",
              message: getRandomLuckMessage(),
              icon: "🍀",
            };
          }
        }

        // ========================================
        // ЛОГИКА ДЛЯ KLENKO
        // ========================================
        if (isKlenko) {
          // Проверка на 30-ю крутку
          if (shouldShow30SpinMessage(currentPlayer.nickname, newSpinIndex)) {
            specialMessage = KLENKO_30_SPIN_MESSAGE;
          }
          // Предупреждения для круток после 30
          else if (newSpinIndex > 30) {
            const warning = getKlenkoWarning(newSpinIndex);
            if (warning) {
              specialMessage = warning;

              // Активация адского режима на 38 крутке
              if (newSpinIndex === 38) {
                hellModeActive = true;
              }
            }
          }
        }

        const updatedPlayer: PlayerState = {
          ...currentPlayer,
          currentSpinIndex: newSpinIndex,
          inventory: updatedInventory,
          hasInfinitySpin,
          hellModeActive,
          lowRaritiesRemoved,
        };

        // Генерируем следующий спин
        const collectedItemIds = updatedInventory.map(r => r.item.id);
        const playerInfo = getPlayerInfo(currentPlayer.nickname);

        // Проверяем, будет ли следующая крутка 200-й (гарантированный divine)
        const nextSpinIs200 = newSpinIndex === 199; // следующая будет 200-я

        let nextSpin: ScriptedSpin | null = null;

        // Для KLENKO всегда генерируем спин (даже в минусе)
        if (isKlenko) {
          nextSpin = generateRandomSpin(currentPlayer.nickname, collectedItemIds, lowRaritiesRemoved, hellModeActive, nextSpinIs200);
        }
        // Для HOHOYKS проверяем наличие бесконечных круток
        else if (hasInfinitySpin || hasSpinsRemaining(currentPlayer.nickname, newSpinIndex)) {
          nextSpin = generateRandomSpin(currentPlayer.nickname, collectedItemIds, lowRaritiesRemoved, false, nextSpinIs200);
        }

        set({
          isSpinning: false,
          lastResult: result,
          showVictoryScreen: true,
          currentPlayer: updatedPlayer,
          currentSpin: nextSpin,
          specialMessage,
          showBonusSpin,
          bonusSpinActive: false,
        });
      },

      // Close victory screen
      closeVictoryScreen: () => {
        set({ showVictoryScreen: false, lastResult: null });
      },

      // Close special message
      closeSpecialMessage: () => {
        set({ specialMessage: null });
      },

      // Activate bonus spin for HOHOYKS
      activateBonusSpin: () => {
        const { currentPlayer } = get();
        if (!currentPlayer) return;

        // Создаем специальный спин с гарантированной Круткой Бесконечности
        const bonusSpin: ScriptedSpin = {
          items: Array(50).fill(HOHOYKS_SECRET_LEGENDARY),
          winningIndex: 25,
          duration: 7500,
          easing: "easeOut",
        };

        set({
          currentSpin: bonusSpin,
          showBonusSpin: false,
          specialMessage: null,
          bonusSpinActive: true,
          showVictoryScreen: false,
          lastResult: null,
        });
      },

      // Transform KLENKO items to hellish versions
      transformToHellItems: () => {
        const { currentPlayer } = get();
        if (!currentPlayer || currentPlayer.nickname.toUpperCase() !== "KLENKO") return;

        // Создаем маппинг обычных предметов на адские
        const hellishMap: Record<string, SpinItem> = {};
        KLENKO_HELLISH_ITEMS.forEach((hellItem, index) => {
          // Предполагаем, что порядок совпадает с обычными предметами
          const normalId = hellItem.id.replace("_hell", "");
          hellishMap[normalId] = hellItem;
        });

        // Трансформируем инвентарь
        const transformedInventory = currentPlayer.inventory.map(result => {
          const hellishItem = hellishMap[result.item.id];
          if (hellishItem) {
            return {
              ...result,
              item: hellishItem,
            };
          }
          return result;
        });

        set({
          currentPlayer: {
            ...currentPlayer,
            inventory: transformedInventory,
          },
        });
      },

      // DEBUG: Принудительно выдать божественный предмет
      debugGrantDivine: () => {
        const { currentPlayer } = get();
        if (!currentPlayer) return;

        const isKlenko = currentPlayer.nickname.toUpperCase() === "KLENKO";
        const isHohoyks = currentPlayer.nickname.toUpperCase() === "HOHOYKS";

        // Выбираем правильный divine предмет
        let divineItem: SpinItem;
        if (isKlenko) {
          divineItem = currentPlayer.hellModeActive ? KLENKO_HELLISH_DIVINE_ITEM : KLENKO_DIVINE_ITEM;
        } else if (isHohoyks) {
          divineItem = HOHOYKS_DIVINE_ITEM;
        } else {
          return;
        }

        const divineResult: SpinResult = {
          item: divineItem,
          timestamp: Date.now(),
        };

        const updatedInventory = [...currentPlayer.inventory, divineResult];

        set({
          currentPlayer: {
            ...currentPlayer,
            inventory: updatedInventory,
          },
          lastResult: divineResult,
          showVictoryScreen: true,
        });
      },

      // Reset player progress
      resetPlayer: () => {
        const { currentPlayer } = get();
        if (!currentPlayer) return;

        const playerInfo = getPlayerInfo(currentPlayer.nickname);
        if (playerInfo) {
          const firstSpin = generateRandomSpin(currentPlayer.nickname, [], false);
          set({
            currentPlayer: {
              id: playerInfo.id,
              nickname: playerInfo.nickname,
              avatar: playerInfo.avatar,
              currentSpinIndex: 0,
              inventory: [],
              hasInfinitySpin: false,
              hellModeActive: false,
              lowRaritiesRemoved: false,
            },
            isSpinning: false,
            lastResult: null,
            showVictoryScreen: false,
            currentSpin: firstSpin,
            specialMessage: null,
            showBonusSpin: false,
            bonusSpinActive: false,
          });
        }
      },

      // Check if player has more spins
      hasMoreSpins: () => {
        const { currentPlayer, bonusSpinActive } = get();
        if (!currentPlayer) return false;

        // Бонусная крутка активна - можно крутить
        if (bonusSpinActive) return true;

        // KLENKO всегда может крутить (даже в минусе)
        if (currentPlayer.nickname.toUpperCase() === "KLENKO") return true;

        // HOHOYKS с бесконечными крутками
        if (currentPlayer.hasInfinitySpin) return true;

        return hasSpinsRemaining(currentPlayer.nickname, currentPlayer.currentSpinIndex);
      },
    }),
    {
      name: "hohoklenko-game-storage-v5", // Новая версия
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentPlayer: state.currentPlayer,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.currentPlayer) {
          const collectedItemIds = state.currentPlayer.inventory?.map(r => r.item.id) || [];
          const spin = generateRandomSpin(
            state.currentPlayer.nickname,
            collectedItemIds,
            state.currentPlayer.lowRaritiesRemoved || false
          );
          state.currentSpin = spin;
        }
      },
    }
  )
);
