"use client";

import { motion } from "motion/react";
import CountUp from "@/components/motion/CountUp";
import BudgetHealthBar from "@/components/BudgetHealthBar";

interface BalanceCardProps {
  balance: number;
  budgetPercent: number;
  daysLeft: number;
  dailyAllowance: number;
}

export default function BalanceCard({
  balance,
  budgetPercent,
  daysLeft,
  dailyAllowance,
}: BalanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 text-white"
    >
      <p className="text-sm text-slate-400 mb-1">Balance</p>
      <CountUp to={balance} className="text-3xl font-bold block mb-3" />
      <BudgetHealthBar percent={budgetPercent} />
      <div className="flex justify-between mt-3 text-sm text-slate-400">
        <span>{daysLeft} days left</span>
        <span>₦{dailyAllowance.toLocaleString()}/day</span>
      </div>
    </motion.div>
  );
}
