"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";

interface ParticleBackgroundProps {
  variant?: "default" | "celebration" | "gold" | "purple" | "fire";
}

export function ParticleBackground({ variant = "default" }: ParticleBackgroundProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (_container?: Container): Promise<void> => {
    // Particles loaded
  };

  const options: ISourceOptions = useMemo(() => {
    const getBaseOptions = (): ISourceOptions => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    });

    switch (variant) {
      case "celebration":
        return {
          ...getBaseOptions(),
          particles: {
            color: {
              value: ["#f59e0b", "#ef4444", "#22c55e", "#3b82f6", "#a855f7"],
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: false,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: "top" as const,
              enable: true,
              outModes: {
                default: "bounce" as const,
              },
              random: false,
              speed: 3,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 100,
            },
            opacity: {
              value: 0.8,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 2, max: 5 },
            },
          },
        };
      case "gold":
        return {
          ...getBaseOptions(),
          particles: {
            color: {
              value: ["#f59e0b", "#fbbf24", "#fcd34d"],
            },
            links: {
              color: "#f59e0b",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: "none" as const,
              enable: true,
              outModes: {
                default: "bounce" as const,
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 80,
            },
            opacity: {
              value: 0.6,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
        };
      case "purple":
        return {
          ...getBaseOptions(),
          particles: {
            color: {
              value: ["#a855f7", "#c084fc", "#e879f9"],
            },
            links: {
              color: "#a855f7",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: "none" as const,
              enable: true,
              outModes: {
                default: "bounce" as const,
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 80,
            },
            opacity: {
              value: 0.6,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
        };
      case "fire":
        return {
          ...getBaseOptions(),
          particles: {
            color: {
              value: ["#ef4444", "#f97316", "#eab308"],
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: false,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: "top" as const,
              enable: true,
              outModes: {
                default: "bounce" as const,
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 80,
            },
            opacity: {
              value: { min: 0.3, max: 0.8 },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 4 },
            },
          },
        };
      default:
        return getBaseOptions();
    }
  }, [variant]);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      className="absolute inset-0 -z-10"
    />
  );
}
