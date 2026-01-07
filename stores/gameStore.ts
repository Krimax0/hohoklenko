import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SpinResult, ScriptedSpin } from "@/types/spin";
import { getPlayerInfo, generateRandomSpin, hasSpinsRemaining } from "@/data/players";

interface PlayerState {
  id: string;
  nickname: string;
  avatar: string;
  currentSpinIndex: number;
  inventory: SpinResult[];
}

interface GameState {
  isAuthenticated: boolean;
  currentPlayer: PlayerState | null;
  isSpinning: boolean;
  lastResult: SpinResult | null;
  showVictoryScreen: boolean;
  currentSpin: ScriptedSpin | null;
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

      // Login action
      login: (nickname: string) => {
        const playerInfo = getPlayerInfo(nickname);
        if (playerInfo) {
          // Генерируем первый спин сразу при логине (теперь рандомный)
          const firstSpin = generateRandomSpin(nickname, []);
          set({
            isAuthenticated: true,
            currentPlayer: {
              id: playerInfo.id,
              nickname: playerInfo.nickname,
              avatar: playerInfo.avatar,
              currentSpinIndex: 0,
              inventory: [],
            },
            currentSpin: firstSpin,
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
        });
      },

      // Prepare spin - генерирует НОВЫЙ рандомный спин
      prepareSpin: () => {
        const { currentPlayer, currentSpin } = get();
        if (!currentPlayer) return;

        // Если спин уже есть - не перегенерируем
        if (currentSpin) return;

        // Проверяем, есть ли ещё крутки
        if (!hasSpinsRemaining(currentPlayer.nickname, currentPlayer.currentSpinIndex)) return;

        // Генерируем новый рандомный спин с учетом собранных предметов
        const collectedItemIds = currentPlayer.inventory.map(r => r.item.id);
        const newSpin = generateRandomSpin(currentPlayer.nickname, collectedItemIds);
        set({ currentSpin: newSpin });
      },

      // Start spin action
      startSpin: () => {
        const { currentPlayer, currentSpin } = get();
        if (!currentPlayer || !currentSpin) return;

        // Проверяем, есть ли ещё крутки
        if (!hasSpinsRemaining(currentPlayer.nickname, currentPlayer.currentSpinIndex)) return;

        set({ isSpinning: true, showVictoryScreen: false });
      },

      // Complete spin action
      completeSpin: (result: SpinResult) => {
        const { currentPlayer } = get();
        if (!currentPlayer) return;

        const newSpinIndex = currentPlayer.currentSpinIndex + 1;
        const updatedInventory = [...currentPlayer.inventory, result];
        const updatedPlayer: PlayerState = {
          ...currentPlayer,
          currentSpinIndex: newSpinIndex,
          inventory: updatedInventory,
        };

        // Генерируем НОВЫЙ рандомный спин для следующей крутки с учетом НОВОЙ коллекции
        const collectedItemIds = updatedInventory.map(r => r.item.id);
        const nextSpin = hasSpinsRemaining(currentPlayer.nickname, newSpinIndex)
          ? generateRandomSpin(currentPlayer.nickname, collectedItemIds)
          : null;

        set({
          isSpinning: false,
          lastResult: result,
          showVictoryScreen: true,
          currentPlayer: updatedPlayer,
          currentSpin: nextSpin,
        });
      },

      // Close victory screen
      closeVictoryScreen: () => {
        set({ showVictoryScreen: false, lastResult: null });
      },

      // Reset player progress
      resetPlayer: () => {
        const { currentPlayer } = get();
        if (!currentPlayer) return;

        const playerInfo = getPlayerInfo(currentPlayer.nickname);
        if (playerInfo) {
          // Генерируем новый рандомный спин при сбросе (без собранных предметов)
          const firstSpin = generateRandomSpin(currentPlayer.nickname, []);
          set({
            currentPlayer: {
              id: playerInfo.id,
              nickname: playerInfo.nickname,
              avatar: playerInfo.avatar,
              currentSpinIndex: 0,
              inventory: [],
            },
            isSpinning: false,
            lastResult: null,
            showVictoryScreen: false,
            currentSpin: firstSpin,
          });
        }
      },

      // Check if player has more spins
      hasMoreSpins: () => {
        const { currentPlayer } = get();
        if (!currentPlayer) return false;

        return hasSpinsRemaining(currentPlayer.nickname, currentPlayer.currentSpinIndex);
      },
    }),
    {
      name: "hohoklenko-game-storage-v4", // Новая версия для очистки старых данных
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentPlayer: state.currentPlayer,
      }),
      // При восстановлении состояния - генерируем новый рандомный спин
      onRehydrateStorage: () => (state) => {
        if (state?.currentPlayer) {
          // Генерируем новый рандомный спин при восстановлении с учетом собранных предметов
          const collectedItemIds = state.currentPlayer.inventory?.map(r => r.item.id) || [];
          const spin = generateRandomSpin(state.currentPlayer.nickname, collectedItemIds);
          state.currentSpin = spin;
        }
      },
    }
  )
);
