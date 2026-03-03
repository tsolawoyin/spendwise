"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { SavingsGoalWithProgress } from "@/lib/types";

interface SavingsSummaryCardProps {
  goals: SavingsGoalWithProgress[];
}

export default function SavingsSummaryCard({ goals }: SavingsSummaryCardProps) {
  const totalSaved = goals.reduce((s, g) => s + g.totalSaved, 0);

  return (
    <Link href="/wallet/savings">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎯</span>
          <p className="text-sm font-semibold">Savings</p>
          <span className="ml-auto text-xs text-muted-foreground">
            {goals.length} goal{goals.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Saved</p>
          <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
            ₦{totalSaved.toLocaleString()}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
