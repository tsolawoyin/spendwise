"use client";

import { motion } from "motion/react";

interface WeeklyCategoryBarProps {
  category: string;
  emoji: string;
  amount: number;
  percent: number;
}

export default function WeeklyCategoryBar({
  category,
  emoji,
  amount,
  percent,
}: WeeklyCategoryBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {emoji} {category}
        </span>
        <span className="text-sm font-semibold text-red-600 dark:text-red-400">
          ₦{amount.toLocaleString()}
        </span>
      </div>
      <div className="bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-red-500 h-full rounded-full"
        />
      </div>
    </div>
  );
}
