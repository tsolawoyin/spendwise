"use client";

import { motion } from "motion/react";
import CountUp from "@/components/motion/CountUp";
import BudgetHealthBar from "@/components/BudgetHealthBar";

interface BalanceCardProps {
  balance: number;
  budgetPercent: number;
  daysLeft: number;
  dailyAllowance: number;
  loanImpact?: number;
  totalSaved?: number;
}

export default function BalanceCard({
  balance,
  budgetPercent,
  daysLeft,
  dailyAllowance,
  loanImpact = 0,
  totalSaved = 0,
}: BalanceCardProps) {
  const hasExtras = loanImpact !== 0 || totalSaved > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 text-white"
    >
      <p className="text-sm text-slate-400 mb-1">Available Balance</p>
      <CountUp to={balance} className="text-3xl font-bold block mb-3" />
      {hasExtras && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-slate-400">
          {loanImpact !== 0 && (
            <span>
              🤝 Loans: {loanImpact > 0 ? "-" : "+"}₦{Math.abs(loanImpact).toLocaleString()}
            </span>
          )}
          {totalSaved > 0 && (
            <span>🎯 Saved: ₦{totalSaved.toLocaleString()}</span>
          )}
        </div>
      )}
      <BudgetHealthBar percent={budgetPercent} />
      <div className="flex justify-between mt-3 text-sm text-slate-400">
        <span>{daysLeft} days left</span>
        <span>₦{dailyAllowance.toLocaleString()}/day</span>
      </div>
    </motion.div>
  );
}
