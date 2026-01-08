"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { SpinWheel } from "@/components/spin/SpinWheel";
import { VictoryScreen } from "@/components/spin/VictoryScreen";
import { Inventory } from "@/components/spin/Inventory";
import { SpecialMessageModal } from "@/components/spin/SpecialMessageModal";
import { LuckToast } from "@/components/spin/LuckToast";
import { AchievementToast } from "@/components/AchievementToast";
import { FinalScreen } from "@/components/FinalScreen";
import { Snowfall } from "@/components/effects/Snowfall";
import Aurora from "@/components/Aurora";
import { useGameStore } from "@/stores/gameStore";
import { getFormattedChances, getPlayerInfo } from "@/data/players";
import type { SpinResult } from "@/types/spin";
import { RARITY_CONFIG } from "@/types/spin";

const KrutkaIcon = ({ size = 24 }: { size?: number }) => (
  <Image src="/krutka.png" alt="Крутка" width={size} height={size} className="inline-block" />
);

// Маппинг имён для отображения
const displayNames: Record<string, string> = {
  KLENKOZARASHI: "Аняяяяяяяя",
  HOHOYKS: "Уляяяяяя",
};

const getDisplayName = (playerName: string): string => {
  return displayNames[playerName.toUpperCase()] || playerName;
};

// Пасхалки при клике на аватар
const avatarMessages: Record<string, string[]> = {
  KLENKOZARASHI: [
    "Уля передаёт привет! 💕",
    "Уля скучает по тебе! 🥺",
    "Уля говорит: ты лучшая! ✨",
    "Уля ждёт тебя! 💖",
  ],
  HOHOYKS: [
    "Аня передаёт привет! 💕",
    "Аня скучает по тебе! 🥺",
    "Аня говорит: ты супер! ✨",
    "Аня ждёт тебя! 💖",
  ],
};

export function GameScreen() {
  const [showInventory, setShowInventory] = useState(false);
  const [showChances, setShowChances] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    currentPlayer,
    isSpinning,
    lastResult,
    showVictoryScreen,
    currentSpin,
    specialMessage,
    luckMessage,
    showBonusSpin,
    newAchievement,
    startSpin,
    completeSpin,
    closeVictoryScreen,
    closeSpecialMessage,
    closeLuckMessage,
    closeAchievementNotification,
    activateBonusSpin,
    transformToHellItems,
    logout,
    hasMoreSpins,
  } = useGameStore();

  // Обработчик клика на аватар
  const handleAvatarClick = () => {
    if (!currentPlayer) return;
    const messages = avatarMessages[currentPlayer.nickname.toUpperCase()] || [];
    if (messages.length > 0) {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setAvatarMessage(randomMessage);
      setTimeout(() => setAvatarMessage(null), 2500);
    }
  };

  // Проверяем есть ли крутки
  const hasSpinsLeft = hasMoreSpins();
  const canSpin = hasSpinsLeft && !isSpinning && currentSpin !== null;

  // Получаем информацию об игроке для отображения шансов
  const playerInfo = currentPlayer ? getPlayerInfo(currentPlayer.nickname) : null;

  // Проверяем специальные состояния
  const isKlenko = currentPlayer?.nickname.toUpperCase() === "KLENKOZARASHI";
  const isHohoyks = currentPlayer?.nickname.toUpperCase() === "HOHOYKS";
  const hasInfinitySpin = currentPlayer?.hasInfinitySpin || false;
  const hellModeActive = currentPlayer?.hellModeActive || false;

  // Для Klenkozarashi показываем отрицательные крутки
  const displaySpinCount = currentPlayer ? (
    isKlenko && currentPlayer.currentSpinIndex > 30
      ? 30 - currentPlayer.currentSpinIndex // Отрицательное число
      : currentPlayer.currentSpinIndex
  ) : 0;

  // Автопрокрутка доступна только после 20 круток
  const AUTO_SPIN_UNLOCK_THRESHOLD = 20;
  const canUseAutoSpin = currentPlayer ? currentPlayer.currentSpinIndex >= AUTO_SPIN_UNLOCK_THRESHOLD : false;
  const spinsUntilAutoUnlock = currentPlayer ? Math.max(0, AUTO_SPIN_UNLOCK_THRESHOLD - currentPlayer.currentSpinIndex) : AUTO_SPIN_UNLOCK_THRESHOLD;

  // Эффект для трансформации предметов в адские на 39 крутке
  useEffect(() => {
    if (currentPlayer && isKlenko && currentPlayer.currentSpinIndex === 39) {
      transformToHellItems();
    }
  }, [currentPlayer?.currentSpinIndex, isKlenko, transformToHellItems]);

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
  // НО останавливаемся при выпадении legendary, mythic или divine!
  useEffect(() => {
    if (autoMode && showVictoryScreen && hasSpinsLeft) {
      // Проверяем редкость последнего выпавшего предмета
      const isEpicDrop = lastResult?.item.rarity === "legendary" || lastResult?.item.rarity === "mythic" || lastResult?.item.rarity === "divine";

      if (isEpicDrop) {
        // Останавливаем автокрутку при легендарном/мифическом/божественном дропе
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

  // Выключаем авто-режим когда крутки закончились (но не для Klenkozarashi!)
  useEffect(() => {
    if (autoMode && !hasSpinsLeft && !isSpinning && !isKlenko) {
      setAutoMode(false);
    }
  }, [autoMode, hasSpinsLeft, isSpinning, isKlenko]);

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

  const handleBonusSpinClick = () => {
    activateBonusSpin();
    closeSpecialMessage();
  };

  if (!currentPlayer) return null;

  // Получаем шансы для отображения (с учётом модификатора после 40 круток)
  const chances = getFormattedChances(currentPlayer.nickname, currentPlayer.lowRaritiesRemoved);

  // Цвета Aurora в зависимости от режима
  const auroraColors = hellModeActive
    ? ["#ff0000", "#8b0000", "#4a0000"] // Адские красные оттенки
    : ["#00ff87", "#60efff", "#7c3aed"]; // Обычные новогодние

  // Фон в зависимости от режима
  const bgClass = hellModeActive
    ? "bg-gradient-to-br from-red-950 via-black to-red-950"
    : "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900";

  return (
    <div className={`relative min-h-screen flex flex-col ${bgClass} overflow-hidden`}>
      {/* Aurora background */}
      <div className={`absolute inset-0 z-0 ${hellModeActive ? "opacity-60" : "opacity-40"}`}>
        <Aurora
          colorStops={auroraColors}
          amplitude={hellModeActive ? 2.0 : 1.2}
          blend={hellModeActive ? 0.8 : 0.6}
          speed={hellModeActive ? 1.0 : 0.5}
        />
      </div>

      {/* Snowfall background - красный снег в адском режиме */}
      <Snowfall intensity={hellModeActive ? "heavy" : "light"} />

      {/* Christmas lights at top - адские огни в адском режиме */}
      <div className="absolute top-0 left-0 right-0 flex justify-center gap-3 py-2 z-20">
        {(hellModeActive
          ? ["🔥", "💀", "🔥", "👹", "🔥", "💀", "🔥", "👹", "🔥", "💀", "🔥", "👹", "🔥", "💀"]
          : ["🔴", "🟡", "🟢", "🔵", "🟣", "🔴", "🟡", "🟢", "🔵", "🟣", "🔴", "🟡", "🟢", "🔵"]
        ).map((light, i) => (
          <motion.span
            key={i}
            className="text-lg"
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: hellModeActive ? 0.5 : 1.5,
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
          <div className="flex items-center gap-4 relative">
            <motion.div
              className={`w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 cursor-pointer ${hellModeActive ? "border-red-500" : "border-amber-400"} hover:scale-110 transition-transform`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              onClick={handleAvatarClick}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={currentPlayer.nickname === "Klenkozarashi" ? "/klenko.jpg" : "/hohoyks.jpg"}
                alt={currentPlayer.nickname}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Пасхалка - сообщение при клике на аватар */}
            <AnimatePresence>
              {avatarMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                  className="absolute left-0 top-full mt-2 px-4 py-2 bg-pink-500/90 backdrop-blur-sm rounded-xl text-white text-sm font-medium whitespace-nowrap shadow-lg z-50"
                >
                  {avatarMessage}
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <h2 className={`text-xl md:text-2xl font-bold ${hellModeActive ? "text-red-400" : "text-white"}`}>
                {getDisplayName(currentPlayer.nickname)}
                {hellModeActive && <span className="ml-2">👹</span>}
              </h2>
              <p className={`text-sm ${hellModeActive ? "text-red-300/70" : "text-amber-200/70"} flex items-center gap-1`}>
                <KrutkaIcon size={16} />
                {hasInfinitySpin ? (
                  <>
                    Бесконечные крутки{" "}
                    <span className="text-green-400">♾️</span>
                  </>
                ) : currentPlayer.currentSpinIndex > (playerInfo?.baseMaxSpins || 30) ? (
                  <>
                    В минусе:{" "}
                    <span className="text-red-500 font-bold">
                      {currentPlayer.currentSpinIndex - (playerInfo?.baseMaxSpins || 30)}
                    </span>
                  </>
                ) : (
                  <>
                    Осталось круток:{" "}
                    <span className={`${hellModeActive ? "text-red-400" : "text-amber-400"} font-bold`}>
                      {(playerInfo?.baseMaxSpins || 30) - currentPlayer.currentSpinIndex}
                    </span>
                  </>
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
              className={`relative p-3 h-auto w-auto rounded-full ${hellModeActive ? "bg-red-500/20 hover:bg-red-500/30 border-red-500/30" : "bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30"} border hover:scale-110 active:scale-95 transition-all`}
              onClick={() => setShowChances(!showChances)}
              title="Шансы выпадения"
            >
              <span className="text-xl md:text-2xl">{hellModeActive ? "💀" : "🎲"}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`relative p-3 h-auto w-auto rounded-full ${hellModeActive ? "bg-red-500/20 hover:bg-red-500/30 border-red-500/30" : "bg-red-500/20 hover:bg-red-500/30 border-red-500/30"} border hover:scale-110 active:scale-95 transition-all`}
              onClick={() => setShowInventory(true)}
            >
              <span className="text-xl md:text-2xl">{hellModeActive ? "👻" : "🎁"}</span>
              {currentPlayer.inventory.length > 0 && (
                <span className={`absolute -top-1 -right-1 ${hellModeActive ? "bg-red-600" : "bg-amber-500"} text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold`}>
                  {currentPlayer.inventory.length}
                </span>
              )}
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
          className={`absolute top-28 right-4 z-30 ${hellModeActive ? "bg-red-950/90" : "bg-black/80"} backdrop-blur-xl rounded-xl border ${hellModeActive ? "border-red-500/30" : "border-white/20"} p-4 shadow-2xl`}
        >
          <h3 className={`text-lg font-bold ${hellModeActive ? "text-red-300" : "text-white"} mb-3 flex items-center gap-2`}>
            {hellModeActive ? "💀" : "🎲"} Твои шансы выпадения
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
                  <span className={`text-sm font-mono ${hellModeActive ? "text-red-200" : "text-white"}`}>
                    {chance}%
                  </span>
                </div>
              );
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full mt-3 ${hellModeActive ? "text-red-300/60 hover:text-red-200" : "text-white/60 hover:text-white"}`}
            onClick={() => setShowChances(false)}
          >
            Закрыть
          </Button>
        </motion.div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        {/* Кнопка открытия божественного подарка */}
        {currentPlayer.inventory.some(r => r.item.rarity === "divine") && (
          <motion.div
            className="w-full max-w-md mb-4"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            <motion.button
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white font-bold text-xl shadow-2xl border-2 border-white/30 flex items-center justify-center gap-3 cursor-pointer"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)",
                  "0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(236, 72, 153, 0.5)",
                  "0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)",
                ],
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFinalScreen(true)}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                🎁
              </motion.span>
              <span>ОТКРЫТЬ БОЖЕСТВЕННЫЙ ПОДАРОК</span>
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                ✨
              </motion.span>
            </motion.button>
          </motion.div>
        )}

        {/* Progress bar */}
        <div className="w-full max-w-md mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${hellModeActive ? "text-red-300" : "text-amber-200"}`}>
              {hellModeActive ? "🔥" : "🎄"} Сделано: {currentPlayer.currentSpinIndex}
              {!hasInfinitySpin && ` / ${playerInfo?.baseMaxSpins || 30}`}
              {hasInfinitySpin && " ♾️"}
            </span>
            <span className={`text-xs ${hellModeActive ? "text-red-400/60" : "text-white/60"}`}>
              {hasInfinitySpin
                ? "∞"
                : currentPlayer.currentSpinIndex > (playerInfo?.baseMaxSpins || 30)
                  ? <span className="text-red-400">{(playerInfo?.baseMaxSpins || 30) - currentPlayer.currentSpinIndex} в минусе</span>
                  : `${Math.max(0, (playerInfo?.baseMaxSpins || 30) - currentPlayer.currentSpinIndex)} осталось`
              }
            </span>
          </div>
          <div className={`h-3 rounded-full ${hellModeActive ? "bg-red-950/50" : "bg-white/10"} relative overflow-hidden`}>
            <motion.div
              className={`h-full rounded-full absolute left-0 top-0 ${
                hellModeActive
                  ? "bg-gradient-to-r from-red-600 via-orange-500 to-red-600"
                  : currentPlayer.currentSpinIndex > (playerInfo?.baseMaxSpins || 30)
                    ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                    : "bg-gradient-to-r from-green-500 via-amber-400 to-red-500"
              }`}
              initial={{ width: 0 }}
              animate={{
                width: hasInfinitySpin
                  ? "100%"
                  : `${(currentPlayer.currentSpinIndex / (playerInfo?.baseMaxSpins || 30)) * 100}%`
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <BorderBeam
              size={40}
              duration={4}
              colorFrom={hellModeActive ? "#ff4444" : "#fbbf24"}
              colorTo={hellModeActive ? "#991b1b" : "#22c55e"}
              borderWidth={2}
            />
          </div>
        </div>

        {/* Spin wheel */}
        <div className="game-wheel w-full">
          {currentSpin ? (
            <SpinWheel
              spin={currentSpin}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
              fastMode={autoMode}
              hellMode={hellModeActive}
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
                {hellModeActive ? "👹" : "🎅"}
              </motion.div>
              <h2 className={`text-3xl font-bold ${hellModeActive ? "text-red-400" : "text-white"} mb-2`}>
                {hellModeActive ? "Добро пожаловать в Ад!" : "С Новым Годом!"}
              </h2>
              <p className={`${hellModeActive ? "text-red-300/70" : "text-amber-200/70"} text-lg`}>
                Вы сделали {currentPlayer.inventory.length} круток!
              </p>
              <motion.div
                className="mt-4 text-4xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                {hellModeActive ? "🔥💀👹💀🔥" : "🎄✨🎁✨🎄"}
              </motion.div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="game-controls mt-8 flex flex-col items-center gap-4">
          {canSpin && !autoMode && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <ShimmerButton
                onClick={startSpin}
                shimmerColor={hellModeActive ? "#ff4444" : "#ffdd00"}
                shimmerSize="0.08em"
                shimmerDuration="2s"
                borderRadius="16px"
                background={hellModeActive
                  ? "linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #c2410c 100%)"
                  : "linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #16a34a 100%)"
                }
                className="text-xl md:text-2xl px-10 py-5 font-bold hover:scale-105 active:scale-100 transition-transform"
              >
                <span className="flex items-center gap-3">
                  <KrutkaIcon size={28} /> {hellModeActive ? "КРУТИТЬ... ЕСЛИ ОСМЕЛИШЬСЯ" : "КРУТИТЬ"} <KrutkaIcon size={28} />
                </span>
              </ShimmerButton>

              {!isSpinning && canUseAutoSpin && (
                <Button
                  size="lg"
                  onClick={handleStartAuto}
                  className={`${hellModeActive ? "bg-gradient-to-r from-red-700 to-orange-700 hover:from-red-600 hover:to-orange-600" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"} text-white font-bold shadow-lg`}
                >
                  <span className="flex items-center gap-2">
                    ⚡ АВТО
                  </span>
                </Button>
              )}

              {!isSpinning && !canUseAutoSpin && spinsUntilAutoUnlock > 0 && (
                <div className={`text-sm ${hellModeActive ? "text-red-400/50" : "text-white/50"} flex items-center gap-2`}>
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
                className={`${hellModeActive ? "text-red-400" : "text-amber-400"} font-bold text-lg flex items-center gap-2`}
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

          {!hasSpinsLeft && !showVictoryScreen && !autoMode && !isKlenko && (
            <Button
              size="lg"
              onClick={() => setShowInventory(true)}
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 flex items-center gap-2"
            >
              <KrutkaIcon size={20} /> Посмотреть крутки
            </Button>
          )}
        </div>

        {/* Stats indicator */}
        <div className="mt-8 w-full max-w-md">
          <div className={`flex justify-between text-sm ${hellModeActive ? "text-red-300/70" : "text-amber-200/70"} mb-2`}>
            <span>Всего круток сделано</span>
            <NumberTicker
              value={currentPlayer.currentSpinIndex}
              className={`${hellModeActive ? "text-red-400" : "text-amber-400"} font-bold text-sm`}
            />
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
        {(hellModeActive ? ["🔥", "💀", "👹", "🔥"] : ["🎄", "🎁", "⭐", "🎄"]).map((emoji, i) => (
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
          hellMode={hellModeActive}
        />
      )}

      {/* Inventory */}
      <Inventory
        items={currentPlayer.inventory}
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        playerNickname={currentPlayer.nickname}
        hellMode={hellModeActive}
        lowRaritiesRemoved={currentPlayer.lowRaritiesRemoved}
        unlockedAchievements={currentPlayer.achievements || []}
      />

      {/* Special Message Modal */}
      <SpecialMessageModal
        message={specialMessage}
        isOpen={specialMessage !== null}
        onClose={closeSpecialMessage}
        showBonusButton={showBonusSpin}
        onBonusClick={handleBonusSpinClick}
      />

      {/* Luck Toast (небольшие сообщения удачи в левом нижнем углу) */}
      <LuckToast
        message={luckMessage}
        isVisible={luckMessage !== null}
        onClose={closeLuckMessage}
        autoHideDelay={3500}
      />

      {/* Achievement Toast (уведомление о новом достижении) */}
      <AchievementToast
        achievement={newAchievement}
        onClose={closeAchievementNotification}
      />

      {/* Final Screen */}
      <FinalScreen
        playerName={currentPlayer.nickname}
        isOpen={showFinalScreen}
        onClose={() => setShowFinalScreen(false)}
      />
    </div>
  );
}
