"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SpinWheel } from "@/components/spin/SpinWheel";
import { VictoryScreen } from "@/components/spin/VictoryScreen";
import { Inventory } from "@/components/spin/Inventory";
import { Snowfall } from "@/components/effects/Snowfall";
import Aurora from "@/components/Aurora";
import { useGameStore } from "@/stores/gameStore";
import { getFormattedChances, getPlayerInfo } from "@/data/players";
import type { SpinResult } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";

const KrutkaIcon = ({ size = 24 }: { size?: number }) => (
  <Image src="/krutka.png" alt="Крутка" width={size} height={size} className="inline-block" />
);

export function GameScreen() {
  const [showInventory, setShowInventory] = useState(false);
  const [showChances, setShowChances] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    currentPlayer,
    isSpinning,
    lastResult,
    showVictoryScreen,
    currentSpin,
    startSpin,
    completeSpin,
    closeVictoryScreen,
    logout,
    resetPlayer,
    hasMoreSpins,
  } = useGameStore();

  // Проверяем есть ли крутки
  const hasSpinsLeft = hasMoreSpins();
  const canSpin = hasSpinsLeft && !isSpinning && currentSpin !== null;
  
  // Получаем информацию об игроке для отображения шансов
  const playerInfo = currentPlayer ? getPlayerInfo(currentPlayer.nickname) : null;
  const isInfiniteSpins = playerInfo?.maxSpins === 0;
  
  // Автопрокрутка доступна только после 20 круток
  const AUTO_SPIN_UNLOCK_THRESHOLD = 20;
  const canUseAutoSpin = currentPlayer ? currentPlayer.currentSpinIndex >= AUTO_SPIN_UNLOCK_THRESHOLD : false;
  const spinsUntilAutoUnlock = currentPlayer ? Math.max(0, AUTO_SPIN_UNLOCK_THRESHOLD - currentPlayer.currentSpinIndex) : AUTO_SPIN_UNLOCK_THRESHOLD;

  useEffect(() => {
    // Entrance animations
    gsap.fromTo(
      ".game-header",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      ".game-wheel",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, delay: 0.3, ease: "back.out(1.4)" }
    );

    gsap.fromTo(
      ".game-controls",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.5 }
    );
  }, []);

  const handleSpinComplete = (result: SpinResult) => {
    completeSpin(result);
  };

  const handleVictoryClose = () => {
    closeVictoryScreen();
  };

  // Авто-крутка: автоматически закрываем VictoryScreen и начинаем следующий спин
  // НО останавливаемся при выпадении legendary или mythic!
  useEffect(() => {
    if (autoMode && showVictoryScreen && hasSpinsLeft) {
      // Проверяем редкость последнего выпавшего предмета
      const isEpicDrop = lastResult?.item.rarity === "legendary" || lastResult?.item.rarity === "mythic";
      
      if (isEpicDrop) {
        // Останавливаем автокрутку при легендарном/мифическом дропе
        setAutoMode(false);
        // Не закрываем экран награды автоматически!
        return;
      }
      
      autoTimerRef.current = setTimeout(() => {
        closeVictoryScreen();
        // Небольшая задержка перед следующим спином
        setTimeout(() => {
          startSpin();
        }, 300);
      }, 800); // Показываем результат 0.8 секунды
    }

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, [autoMode, showVictoryScreen, hasSpinsLeft, lastResult, closeVictoryScreen, startSpin]);

  // Выключаем авто-режим когда крутки закончились
  useEffect(() => {
    if (autoMode && !hasSpinsLeft && !isSpinning) {
      setAutoMode(false);
    }
  }, [autoMode, hasSpinsLeft, isSpinning]);

  const handleStartAuto = () => {
    setAutoMode(true);
    startSpin();
  };

  const handleStopAuto = () => {
    setAutoMode(false);
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
    }
  };

  if (!currentPlayer) return null;

  // Получаем шансы для отображения
  const chances = getFormattedChances(currentPlayer.nickname);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Aurora
          colorStops={["#00ff87", "#60efff", "#7c3aed"]}
          amplitude={1.2}
          blend={0.6}
          speed={0.5}
        />
      </div>

      {/* Snowfall background */}
      <Snowfall intensity="light" />

      {/* Christmas lights at top */}
      <div className="absolute top-0 left-0 right-0 flex justify-center gap-3 py-2 z-20">
        {["🔴", "🟡", "🟢", "🔵", "🟣", "🔴", "🟡", "🟢", "🔵", "🟣", "🔴", "🟡", "🟢", "🔵"].map((light, i) => (
          <motion.span
            key={i}
            className="text-lg"
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.12,
            }}
          >
            {light}
          </motion.span>
        ))}
      </div>

      {/* Header */}
      <header className="game-header relative z-10 p-4 md:p-6 pt-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Player info */}
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-amber-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Image
                src={currentPlayer.nickname === "KLENKO" ? "/klenko.jpg" : "/hohoyks.jpg"}
                alt={currentPlayer.nickname}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {currentPlayer.nickname}
              </h2>
              <p className="text-sm text-amber-200/70 flex items-center gap-1">
                <KrutkaIcon size={16} /> Сделано круток:{" "}
                <span className="text-amber-400 font-bold">
                  {currentPlayer.currentSpinIndex}
                </span>
                {isInfiniteSpins && (
                  <span className="ml-1 text-green-400">∞</span>
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Chances button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative p-3 h-auto w-auto rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:scale-110 active:scale-95 transition-all"
              onClick={() => setShowChances(!showChances)}
              title="Шансы выпадения"
            >
              <span className="text-xl md:text-2xl">🎲</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative p-3 h-auto w-auto rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:scale-110 active:scale-95 transition-all"
              onClick={() => setShowInventory(true)}
            >
              <span className="text-xl md:text-2xl">🎁</span>
              {currentPlayer.inventory.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {currentPlayer.inventory.length}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="p-3 h-auto w-auto rounded-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:scale-110 active:scale-95 transition-all"
              onClick={resetPlayer}
              title="Сбросить прогресс"
            >
              <span className="text-xl md:text-2xl">🔄</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="p-3 h-auto w-auto rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all"
              onClick={logout}
              title="Выйти"
            >
              <span className="text-xl md:text-2xl">🚪</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Chances popup */}
      {showChances && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-28 right-4 z-30 bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 p-4 shadow-2xl"
        >
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            🎲 Твои шансы выпадения
          </h3>
          <div className="space-y-2">
            {chances.map(({ rarity, name, chance }) => {
              const config = RARITY_CONFIG[rarity];
              return (
                <div key={rarity} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-sm" style={{ color: config.color }}>
                      {name}
                    </span>
                  </span>
                  <span className="text-sm font-mono text-white">
                    {chance}%
                  </span>
                </div>
              );
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-white/60 hover:text-white"
            onClick={() => setShowChances(false)}
          >
            Закрыть
          </Button>
        </motion.div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        {/* Title */}
        <motion.h1
          className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-green-400 mb-8"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
          }}
          style={{ backgroundSize: "200% 200%" }}
        >
          🎄 КРУТКА #{currentPlayer.currentSpinIndex + 1} 🎄
        </motion.h1>

        {/* Spin wheel */}
        <div className="game-wheel w-full">
          {currentSpin ? (
            <SpinWheel
              spin={currentSpin}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
              fastMode={autoMode}
            />
          ) : (
            <div className="text-center py-20">
              <motion.div
                className="text-7xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                🎅
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                С Новым Годом!
              </h2>
              <p className="text-amber-200/70 text-lg">
                Вы сделали {currentPlayer.inventory.length} круток!
              </p>
              <motion.div
                className="mt-4 text-4xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                🎄✨🎁✨🎄
              </motion.div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="game-controls mt-8 flex flex-col items-center gap-4">
          {canSpin && !autoMode && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                size="xl"
                onClick={startSpin}
                className="text-xl md:text-2xl px-12 py-6 bg-gradient-to-r from-red-600 via-red-500 to-green-600 hover:from-red-500 hover:via-amber-500 hover:to-green-500 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 active:scale-100 transition-all duration-300 animate-pulse"
              >
                <span className="flex items-center gap-3">
                  <KrutkaIcon size={28} /> КРУТИТЬ <KrutkaIcon size={28} />
                </span>
              </Button>

              {!isSpinning && canUseAutoSpin && (
                <Button
                  size="lg"
                  onClick={handleStartAuto}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    ⚡ АВТО
                  </span>
                </Button>
              )}
              
              {!isSpinning && !canUseAutoSpin && spinsUntilAutoUnlock > 0 && (
                <div className="text-sm text-white/50 flex items-center gap-2">
                  <span className="text-lg">🔒</span>
                  <span>Авто через {spinsUntilAutoUnlock} круток</span>
                </div>
              )}
            </div>
          )}

          {/* Авто-режим активен */}
          {autoMode && (
            <div className="flex flex-col items-center gap-3">
              <motion.div
                className="text-amber-400 font-bold text-lg flex items-center gap-2"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                ⚡ АВТО-КРУТКА ⚡
              </motion.div>
              <Button
                size="lg"
                variant="outline"
                onClick={handleStopAuto}
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                ⏹️ Остановить
              </Button>
            </div>
          )}

          {!hasSpinsLeft && !showVictoryScreen && !autoMode && (
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => setShowInventory(true)}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 flex items-center gap-2"
              >
                <KrutkaIcon size={20} /> Посмотреть крутки
              </Button>
              <Button variant="outline" size="lg" onClick={resetPlayer} className="border-white/30 text-white hover:bg-white/10">
                🔄 Начать заново
              </Button>
            </div>
          )}
        </div>

        {/* Stats indicator */}
        <div className="mt-8 w-full max-w-md">
          <div className="flex justify-between text-sm text-amber-200/70 mb-2">
            <span>Всего круток сделано</span>
            <span className="text-amber-400 font-bold">
              {currentPlayer.currentSpinIndex}
            </span>
          </div>
          {/* Stats by rarity */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {chances.map(({ rarity, name }) => {
              const config = RARITY_CONFIG[rarity];
              const count = currentPlayer.inventory.filter(r => r.item.rarity === rarity).length;
              if (count === 0) return null;
              return (
                <div
                  key={rarity}
                  className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                  style={{
                    backgroundColor: `${config.color}20`,
                    border: `1px solid ${config.color}40`,
                    color: config.color,
                  }}
                >
                  <span>{name}</span>
                  <span className="text-white">×{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom decorations */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
        {["🎄", "🎁", "⭐", "🎄"].map((emoji, i) => (
          <motion.span
            key={i}
            className="text-2xl opacity-50"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Victory Screen */}
      {lastResult && (
        <VictoryScreen
          result={lastResult}
          isVisible={showVictoryScreen}
          onClose={handleVictoryClose}
          hasMoreSpins={hasSpinsLeft}
        />
      )}

      {/* Inventory */}
      <Inventory
        items={currentPlayer.inventory}
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
      />
    </div>
  );
}
