"use client";

import Link from "next/link";
import { motion } from "motion/react";
import SavingsProgressRing from "@/components/SavingsProgressRing";
import type { SavingsGoalWithProgress } from "@/lib/types";

interface SavingsGoalCardProps {
  goal: SavingsGoalWithProgress;
}

export default function SavingsGoalCard({ goal }: SavingsGoalCardProps) {
  const deadlineStr = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link href={`/wallet/savings/${goal.id}`}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4 flex items-center gap-4"
      >
        <SavingsProgressRing percent={goal.percent} size={56} strokeWidth={5} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{goal.name}</p>
          <p className="text-xs text-muted-foreground">
            ₦{goal.totalSaved.toLocaleString()} / ₦{Number(goal.target_amount).toLocaleString()}
          </p>
          {deadlineStr && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Due {deadlineStr}
            </p>
          )}
        </div>
        <span className="text-lg">🎯</span>
      </motion.div>
    </Link>
  );
}
