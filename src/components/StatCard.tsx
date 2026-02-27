"use client";

import { motion } from "motion/react";

interface StatCardProps {
  emoji: string;
  label: string;
  amount: number;
  color: "emerald" | "red";
}

const colorClasses = {
  emerald: "text-emerald-600 dark:text-emerald-400",
  red: "text-red-600 dark:text-red-400",
};

export default function StatCard({ emoji, label, amount, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4"
    >
      <span className="text-2xl">{emoji}</span>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      <p className={`text-lg font-bold mt-0.5 ${colorClasses[color]}`}>
        ₦{amount.toLocaleString()}
      </p>
    </motion.div>
  );
}
