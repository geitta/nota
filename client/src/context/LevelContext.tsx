import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AnnotationTrack } from "../types";

/**
 * Nota has two explanation depths, matching the proposal's layman/expert
 * tracks and the Figma piece-page tabs exactly: "Beginner" and "Seasoned".
 *
 * "Interpretations" — the third tab visible on the piece page — is NOT a
 * third depth level. It's a mode switch that navigates to the recording
 * comparison page (see pages/Compare.tsx), not another value of Level.
 * Earlier code modeled this as three levels (Beginner/Advanced/Expert),
 * which was a misreading before the actual tab layout was visible.
 */
export const LEVELS = {
  BEGINNER: "beginner",
  SEASONED: "seasoned",
} as const;

export type Level = (typeof LEVELS)[keyof typeof LEVELS];

export const LEVEL_META: Record<Level, { label: string; tagline: string }> = {
  [LEVELS.BEGINNER]: {
    label: "Beginner",
    tagline: "New to classical music? Start here.",
  },
  [LEVELS.SEASONED]: {
    label: "Seasoned",
    tagline: "Full analytical detail, no simplifying.",
  },
};

export function trackForLevel(level: Level): AnnotationTrack {
  return level === LEVELS.SEASONED ? "expert" : "layman";
}

const STORAGE_KEY = "nota:listener-level";

interface LevelContextValue {
  level: Level;
  setLevel: (level: Level) => void;
}

const LevelContext = createContext<LevelContextValue | null>(null);

export function LevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<Level>(() => {
    if (typeof window === "undefined") return LEVELS.BEGINNER;
    return (window.localStorage.getItem(STORAGE_KEY) as Level) || LEVELS.BEGINNER;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, level);
  }, [level]);

  return (
    <LevelContext.Provider value={{ level, setLevel }}>
      {children}
    </LevelContext.Provider>
  );
}

export function useLevel(): LevelContextValue {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error("useLevel must be used inside a LevelProvider");
  return ctx;
}