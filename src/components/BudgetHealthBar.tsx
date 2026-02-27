"use client";

import { motion } from "motion/react";

interface BudgetHealthBarProps {
  percent: number;
}

export default function BudgetHealthBar({ percent }: BudgetHealthBarProps) {
  const remaining = 100 - percent;

  const barColor =
    remaining > 50
      ? "bg-emerald-500"
      : remaining > 25
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${remaining}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full rounded-full ${barColor}`}
      />
    </div>
  );
}
