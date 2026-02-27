"use client";

import { useState, useEffect, useCallback } from "react";

const XP_KEY = "spendwise_xp";

export function useXP() {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(XP_KEY);
    if (stored) setXp(parseInt(stored, 10));
  }, []);

  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = 100 - (xp % 100);

  const addXP = useCallback((amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      localStorage.setItem(XP_KEY, String(next));
      return next;
    });
  }, []);

  return { xp, level, xpToNextLevel, addXP };
}
