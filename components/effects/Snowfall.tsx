"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";

let engineInitialized = false;

interface SnowfallProps {
  intensity?: "light" | "medium" | "heavy" | "blizzard";
}

export function Snowfall({ intensity = "medium" }: SnowfallProps) {
  const [init, setInit] = useState(engineInitialized);
  const particlesId = useId();

  useEffect(() => {
    if (engineInitialized) {
      setInit(true);
      return;
    }

    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      engineInitialized = true;
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (_container?: Container): Promise<void> => {
    // Snowfall loaded
  };

  const intensityConfig = {
    light: { count: 30, speed: 0.3 },
    medium: { count: 60, speed: 0.5 },
    heavy: { count: 100, speed: 0.7 },
    blizzard: { count: 200, speed: 1 },
  };

  const config = intensityConfig[intensity];

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: "#ffffff",
        },
        move: {
          direction: "bottom" as const,
          enable: true,
          outModes: {
            default: "out" as const,
          },
          random: false,
          speed: config.speed,
          straight: true,
          gravity: {
            enable: false,
          },
          decay: 0,
        },
        number: {
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
          value: config.count,
        },
        opacity: {
          value: { min: 0.3, max: 0.8 },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
        wobble: {
          enable: false,
        },
        zIndex: {
          value: { min: 0, max: 100 },
        },
      },
      detectRetina: true,
      fullScreen: {
        enable: false,
      },
    }),
    [config.count, config.speed]
  );

  if (!init) return null;

  return (
    <Particles
      id={`snowfall-${particlesId}`}
      particlesLoaded={particlesLoaded}
      options={options}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
