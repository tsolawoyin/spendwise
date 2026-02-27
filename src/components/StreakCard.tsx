"use client";

import { motion } from "motion/react";

interface StreakCardProps {
  streak: number;
}

export default function StreakCard({ streak }: StreakCardProps) {
  if (streak < 1) return null;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-center"
    >
      <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
        🔥 {streak} Day Streak
      </span>
    </motion.div>
  );
}
