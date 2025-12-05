import React, { createContext, useContext, useMemo, useState } from "react";
import { defaultSettings, difficultyPresets, STORAGE_KEY } from "../state/constants.js";

const GameSettingsContext = createContext(null);

const readSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    const merged = {
      ...defaultSettings,
      ...parsed,
    };
    return merged;
  } catch {
    return defaultSettings;
  }
};

export const GameSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => readSettings());
  const [lastStats, setLastStats] = useState(null);

  const updateSettings = (next) => {
    setSettings((prev) => {
      const merged = typeof next === "function" ? next(prev) : { ...prev, ...next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  };

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      presets: difficultyPresets,
      lastStats,
      setLastStats,
    }),
    [settings, lastStats],
  );

  return <GameSettingsContext.Provider value={value}>{children}</GameSettingsContext.Provider>;
};

export const useGameSettings = () => {
  const ctx = useContext(GameSettingsContext);
  if (!ctx) {
    throw new Error("useGameSettings має використовуватися всередині GameSettingsProvider.");
  }
  return ctx;
};



