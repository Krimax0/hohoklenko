import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SoundProvider } from "@/contexts/SoundContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HOHOKLENKO - Крутки",
  description: "Эпические крутки с редкими предметами",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <head>
        {/* Preload critical sounds for instant playback */}
        <link rel="preload" href="/sounds/success-jingle.wav" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/sounds/level-up.wav" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/sounds/game-reward.wav" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/sounds/legendary-loot.wav" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/sounds/electric-zap-loop.wav" as="fetch" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
