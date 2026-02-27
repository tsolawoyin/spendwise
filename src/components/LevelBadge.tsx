"use client";

import { motion } from "motion/react";

interface LevelBadgeProps {
  level: number;
}

export default function LevelBadge({ level }: LevelBadgeProps) {
  return (
    <motion.span
      key={level}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
    >
      Lv. {level}
    </motion.span>
  );
}
