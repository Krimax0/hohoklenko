import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SpinResult, ScriptedSpin } from "@/types/spin";
import { getPlayerInfo, generateSpin, getSpinCount } from "@/data/players";

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
  currentSpin: ScriptedSpin | null; // Храним текущий спин в состоянии
}

interface GameStore extends GameState {
  // Actions
  login: (nickname: string) => boolean;
  logout: () => void;
  prepareSpin: () => void; // Генерирует спин перед началом
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
          // Генерируем первый спин сразу при логине
          const firstSpin = generateSpin(nickname, 0);
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

      // Prepare spin - генерирует спин ОДИН раз перед началом
      prepareSpin: () => {
        const { currentPlayer, currentSpin } = get();
        if (!currentPlayer) return;

        // Если спин уже есть - не перегенерируем
        if (currentSpin) return;

        const spinCount = getSpinCount(currentPlayer.nickname);
        if (currentPlayer.currentSpinIndex >= spinCount) return;

        const newSpin = generateSpin(currentPlayer.nickname, currentPlayer.currentSpinIndex);
        set({ currentSpin: newSpin });
      },

      // Start spin action
      startSpin: () => {
        const { currentPlayer, currentSpin } = get();
        if (!currentPlayer || !currentSpin) return;

        const spinCount = getSpinCount(currentPlayer.nickname);
        if (currentPlayer.currentSpinIndex >= spinCount) return;

        set({ isSpinning: true, showVictoryScreen: false });
      },

      // Complete spin action
      completeSpin: (result: SpinResult) => {
        const { currentPlayer } = get();
        if (!currentPlayer) return;

        const newSpinIndex = currentPlayer.currentSpinIndex + 1;
        const updatedPlayer: PlayerState = {
          ...currentPlayer,
          currentSpinIndex: newSpinIndex,
          inventory: [...currentPlayer.inventory, result],
        };

        // Генерируем следующий спин заранее (или null если спинов больше нет)
        const nextSpin = generateSpin(currentPlayer.nickname, newSpinIndex);

        set({
          isSpinning: false,
          lastResult: result,
          showVictoryScreen: true,
          currentPlayer: updatedPlayer,
          currentSpin: nextSpin, // Устанавливаем следующий спин
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
          // Генерируем первый спин при сбросе
          const firstSpin = generateSpin(currentPlayer.nickname, 0);
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

        const spinCount = getSpinCount(currentPlayer.nickname);
        return currentPlayer.currentSpinIndex < spinCount;
      },
    }),
    {
      name: "hohoklenko-game-storage-v3", // Новая версия для очистки старых данных
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentPlayer: state.currentPlayer,
      }),
      // При восстановлении состояния - генерируем спин
      onRehydrateStorage: () => (state) => {
        if (state?.currentPlayer) {
          const spin = generateSpin(state.currentPlayer.nickname, state.currentPlayer.currentSpinIndex);
          state.currentSpin = spin;
        }
      },
    }
  )
);
