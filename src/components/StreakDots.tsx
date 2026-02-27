"use client";

import { motion } from "motion/react";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1 },
};

interface StreakDotsProps {
  expenseDates: string[];
}

export default function StreakDots({ expenseDates }: StreakDotsProps) {
  // Get the Monday of the current week
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  // Build set of dates that have expenses this week
  const activeDays = new Set<number>();
  for (const dateStr of expenseDates) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor(
      (d.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff >= 0 && diff < 7) {
      activeDays.add(diff);
    }
  }

  return (
    <div className="flex items-center justify-between px-2">
      {DAY_LABELS.map((label, i) => (
        <div key={label} className="flex flex-col items-center gap-1.5">
          <motion.div
            variants={dotVariants}
            initial="hidden"
            animate="show"
            transition={{
              delay: i * 0.08,
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className={`w-3 h-3 rounded-full ${
              activeDays.has(i)
                ? "bg-amber-400"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
          <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
