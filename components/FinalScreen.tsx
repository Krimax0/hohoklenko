"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WordRotate } from "@/components/ui/word-rotate";
import { Snowfall } from "@/components/effects/Snowfall";
import Aurora from "@/components/Aurora";

type Phase =
  | "intro"
  | "key_reveal"
  | "check_intro"
  | "typing_nick"
  | "checking"
  | "check_failed"
  | "select_alt"
  | "reveal_success"
  | "personal_message";

interface FinalScreenProps {
  playerName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Генерация кринжовых альтернативных ников
const generateAltNicks = (name: string): string[] => {
  const upper = name.toUpperCase();
  return [
    `${name}228322`,
    `XxX___${upper}___XxX`,
    `${name}_2007_pro`,
    `xx${name}killer99xx`,
  ];
};

// Личные пожелания для игроков
const personalMessages: Record<string, string[]> = {
  KLENKOZARASHI: [
    "ценю каждую минуту проведённую с вами",
    "хочу всегда быть рядом с вами",
    "желаю вам самого лучшего Нового Года!",
    "хочу чтобы вы всегда были вместе",
    "хочу чтобы вы были не разлей вода",
    "хочу вас обнять сильно сильно",
  ],
  HOHOYKS: [
    "ценю каждую минуту проведённую с вами",
    "хочу всегда быть рядом с вами",
    "желаю вам самого лучшего Нового Года!",
    "хочу чтобы вы всегда были вместе",
    "хочу чтобы вы были не разлей вода",
    "хочу вас обнять сильно сильно",
  ],
};

export function FinalScreen({ playerName, isOpen, onClose }: FinalScreenProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [typedNick, setTypedNick] = useState("");
  const [checkingMessage, setCheckingMessage] = useState("Проверяем...");
  const [selectedAltNick, setSelectedAltNick] = useState<string | null>(null);
  const [showOchen, setShowOchen] = useState(0); // 0 - нет, 1 - первое очень, 2 - второе ОЧЕНЬ

  const altNicks = generateAltNicks(playerName);
  const messages = personalMessages[playerName.toUpperCase()] || personalMessages.KLENKOZARASHI;

  // Сброс состояния при открытии
  useEffect(() => {
    if (isOpen) {
      setPhase("intro");
      setTypedNick("");
      setCheckingMessage("Проверяем...");
      setSelectedAltNick(null);
      setShowOchen(0);
    }
  }, [isOpen]);

  // Автоматические переходы между фазами
  useEffect(() => {
    if (!isOpen) return;

    let timer: NodeJS.Timeout;

    if (phase === "intro") {
      timer = setTimeout(() => setPhase("key_reveal"), 2000);
    } else if (phase === "key_reveal") {
      timer = setTimeout(() => setPhase("check_intro"), 3000);
    } else if (phase === "check_intro") {
      timer = setTimeout(() => setPhase("typing_nick"), 2000);
    }

    return () => clearTimeout(timer);
  }, [phase, isOpen]);

  // Анимация печатания ника
  useEffect(() => {
    if (phase !== "typing_nick") return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= playerName.length) {
        setTypedNick(playerName.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("checking"), 500);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [phase, playerName]);

  // Фейковая проверка с сообщениями
  useEffect(() => {
    if (phase !== "checking") return;

    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setCheckingMessage("Подождите ещё..."), 2000));
    timers.push(setTimeout(() => setCheckingMessage("Чёт долговато..."), 4000));
    timers.push(setTimeout(() => setCheckingMessage("Пытаемся избавиться от нарушителя..."), 7000));
    timers.push(setTimeout(() => setPhase("check_failed"), 10000));

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Обработка выбора альтернативного ника
  const handleSelectAltNick = useCallback((nick: string) => {
    setSelectedAltNick(nick);
    setPhase("select_alt");

    // Через 2 секунды показываем что всё ок
    setTimeout(() => setPhase("reveal_success"), 2000);
  }, []);

  // Переход к личным сообщениям
  useEffect(() => {
    if (phase !== "reveal_success") return;

    const timer = setTimeout(() => setPhase("personal_message"), 4000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Анимация личных сообщений
  useEffect(() => {
    if (phase !== "personal_message") return;

    // Показываем "очень" с задержками
    const timer1 = setTimeout(() => setShowOchen(1), 1000);
    const timer2 = setTimeout(() => setShowOchen(2), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [phase]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Aurora background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Aurora
          colorStops={["#a855f7", "#ec4899", "#f59e0b"]}
          amplitude={1.5}
          blend={0.7}
          speed={0.6}
        />
      </div>

      <Snowfall intensity="medium" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Phase: Intro */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                className="text-8xl"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎉
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-white">
                ПОЗДРАВЛЯЮ!
              </h1>
              <p className="text-xl md:text-2xl text-amber-200">
                Ты выбил божественный предмет!
              </p>
            </motion.div>
          )}

          {/* Phase: Key Reveal */}
          {phase === "key_reveal" && (
            <motion.div
              key="key_reveal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="space-y-6"
            >
              <motion.div
                className="text-9xl"
                animate={{
                  rotateY: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔑
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Так вот, держи ключик!
              </h2>
              <p className="text-xl text-purple-300">
                Лицензия Minecraft Java Edition
              </p>
            </motion.div>
          )}

          {/* Phase: Check Intro */}
          {phase === "check_intro" && (
            <motion.div
              key="check_intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <motion.div className="text-7xl">🤔</motion.div>
              <h2 className="text-2xl md:text-4xl font-bold text-white">
                А давай сразу проверим...
              </h2>
              <p className="text-xl text-amber-200">
                Не занят ли твой никнейм?
              </p>
            </motion.div>
          )}

          {/* Phase: Typing Nick */}
          {phase === "typing_nick" && (
            <motion.div
              key="typing_nick"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <p className="text-xl text-white/70">Вводим никнейм...</p>
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border-2 border-green-500/50 p-6 max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-mono">minecraft:~$</span>
                  <span className="text-2xl font-mono text-white">
                    {typedNick}
                    <motion.span
                      className="inline-block w-3 h-6 bg-green-400 ml-1"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase: Checking */}
          {phase === "checking" && (
            <motion.div
              key="checking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border-2 border-amber-500/50 p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    className="w-6 h-6 border-4 border-amber-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-xl font-mono text-amber-400">
                    Проверка: {playerName}
                  </span>
                </div>
                <motion.p
                  key={checkingMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg text-white/80"
                >
                  {checkingMessage}
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Phase: Check Failed */}
          {phase === "check_failed" && (
            <motion.div
              key="check_failed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <motion.div
                className="text-8xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                😭
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-black text-red-400">
                ОООО НЕТ!!!
              </h2>
              <p className="text-xl md:text-2xl text-white">
                ТВОЙ НИКНЕЙМ <span className="text-red-400 font-bold">{playerName}</span> ЗАНЯТ!
              </p>
              <p className="text-lg text-white/70">
                Очень сожалею... Придётся выбрать что-то из этого:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {altNicks.map((nick, i) => (
                  <motion.button
                    key={nick}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    onClick={() => handleSelectAltNick(nick)}
                    className="px-4 py-3 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 rounded-xl text-white font-mono text-sm hover:scale-105 transition-transform"
                  >
                    {nick}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Phase: Select Alt (loading) */}
          {phase === "select_alt" && (
            <motion.div
              key="select_alt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <motion.div
                className="text-7xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                😔
              </motion.div>
              <p className="text-xl text-white/70">
                Ладно, пусть будет...
              </p>
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border-2 border-gray-500/50 p-6 max-w-md mx-auto">
                <span className="text-2xl font-mono text-gray-400">
                  {selectedAltNick}
                </span>
              </div>
            </motion.div>
          )}

          {/* Phase: Reveal Success */}
          {phase === "reveal_success" && (
            <motion.div
              key="reveal_success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <motion.div
                className="text-9xl"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1], rotate: [0, 360] }}
                transition={{ duration: 0.8 }}
              >
                🎊
              </motion.div>
              <motion.h2
                className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                СТОООП!
              </motion.h2>
              <motion.p
                className="text-xl md:text-2xl text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Никнейм <span className="text-green-400 font-bold">{playerName}</span>
              </motion.p>
              <motion.p
                className="text-2xl md:text-4xl font-black text-green-400"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
              >
                СВОБОДЕН! ✅
              </motion.p>
              <motion.p
                className="text-lg text-white/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Шутка 😏
              </motion.p>
            </motion.div>
          )}

          {/* Phase: Personal Message */}
          {phase === "personal_message" && (
            <motion.div
              key="personal_message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <motion.div className="text-7xl">❤️</motion.div>

              <div className="text-2xl md:text-4xl font-bold text-white leading-relaxed">
                <span>Я </span>

                {/* Первое "очень" - простое */}
                <AnimatePresence>
                  {showOchen >= 1 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-pink-400"
                    >
                      очень
                    </motion.span>
                  )}
                </AnimatePresence>

                {showOchen >= 1 && <span>{" "}</span>}

                {/* Второе "ОЧЕНЬ" - мощное */}
                <AnimatePresence>
                  {showOchen >= 2 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0, rotate: -20 }}
                      animate={{
                        opacity: 1,
                        scale: 1.3,
                        rotate: 0,
                      }}
                      transition={{
                        duration: 0.6,
                        type: "spring",
                        bounce: 0.6,
                      }}
                      className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 mx-2"
                      style={{
                        textShadow: "0 0 30px rgba(236, 72, 153, 0.8)",
                      }}
                    >
                      ОЧЕНЬ
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Ротация слов снизу вверх */}
              {showOchen >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <WordRotate
                    words={messages}
                    duration={3000}
                    direction="up"
                    className="text-2xl md:text-3xl font-bold text-amber-200"
                  />
                </motion.div>
              )}

              {/* Кнопка закрытия */}
              {showOchen >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="space-y-6 pt-6"
                >
                  <motion.p
                    className="text-lg md:text-xl text-white/80 max-w-md mx-auto leading-relaxed"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Пусть этот год станет самым лучшим!!!! ✨
                  </motion.p>
                  <motion.button
                    onClick={onClose}
                    className="group px-8 py-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md border border-pink-300/30 text-white font-medium text-lg rounded-full hover:border-pink-300/50 transition-all duration-500"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(236, 72, 153, 0.1)",
                        "0 0 30px rgba(236, 72, 153, 0.2)",
                        "0 0 20px rgba(236, 72, 153, 0.1)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="flex items-center gap-2">
                      <span>Обнимаю</span>
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
