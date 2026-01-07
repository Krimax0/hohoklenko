"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

interface WordRotateProps {
  words: string[]
  duration?: number
  motionProps?: MotionProps
  className?: string
  direction?: "up" | "down" // up = снизу вверх, down = сверху вниз
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps,
  className,
  direction = "down",
}: WordRotateProps) {
  const [index, setIndex] = useState(0)

  // Дефолтные анимации в зависимости от направления
  const defaultMotionProps: MotionProps = direction === "up"
    ? {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -50 },
        transition: { duration: 0.25, ease: "easeOut" },
      }
    : {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 },
        transition: { duration: 0.25, ease: "easeOut" },
      }

  const finalMotionProps = motionProps || defaultMotionProps

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, duration)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [words, duration])

  return (
    <div className="overflow-hidden py-2">
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[index]}
          className={cn(className)}
          {...finalMotionProps}
        >
          {words[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  )
}
