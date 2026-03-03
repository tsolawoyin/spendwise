"use client";

import { motion } from "motion/react";
import { useXP } from "@/hooks/useXP";
import FadeIn from "@/components/motion/FadeIn";
import StreakCard from "@/components/StreakCard";
import StreakDots from "@/components/StreakDots";
import StatCard from "@/components/StatCard";
import WeeklyCategoryBar from "@/components/WeeklyCategoryBar";

interface CategoryTotal {
  category: string;
  emoji: string;
  amount: number;
  percent: number;
}

interface SummaryContentProps {
  totalIncome: number;
  totalExpenses: number;
  streak: number;
  expenseDates: string[];
  categoryTotals: CategoryTotal[];
  lentOut?: number;
  borrowed?: number;
  loanImpact?: number;
  totalSaved?: number;
  savingsGoalCount?: number;
}

export default function SummaryContent({
  totalIncome,
  totalExpenses,
  streak,
  expenseDates,
  categoryTotals,
  lentOut = 0,
  borrowed = 0,
  loanImpact = 0,
  totalSaved = 0,
  savingsGoalCount = 0,
}: SummaryContentProps) {
  const { xp, level, xpToNextLevel } = useXP();
  const xpPercent = ((xp % 100) / 100) * 100;

  return (
    <div className="space-y-5">
      {/* Title */}
      <FadeIn>
        <h1 className="text-2xl font-bold">Summary 📊</h1>
      </FadeIn>

      {/* Streak Section */}
      <FadeIn delay={0.05}>
        <div className="space-y-3">
          <StreakCard streak={streak} />
          <StreakDots expenseDates={expenseDates} />
        </div>
      </FadeIn>

      {/* Category Breakdown */}
      <FadeIn delay={0.1}>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Category Breakdown</h2>
          {categoryTotals.length > 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4 space-y-4">
              {categoryTotals.map((cat) => (
                <WeeklyCategoryBar
                  key={cat.category}
                  category={cat.category}
                  emoji={cat.emoji}
                  amount={cat.amount}
                  percent={cat.percent}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-3xl mb-1">📭</p>
              <p className="text-sm">No expenses yet this period</p>
            </div>
          )}
        </div>
      </FadeIn>

      {/* XP Progress */}
      <FadeIn delay={0.15}>
        <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold">
            ⚡ {xp} XP · Level {level}
          </p>
          <div className="bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-amber-400 h-full rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {xpToNextLevel} XP to Level {level + 1}
          </p>
        </div>
      </FadeIn>

      {/* Loans & Savings Overview */}
      {(lentOut > 0 || borrowed > 0 || totalSaved > 0) && (
        <FadeIn delay={0.2}>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Wallet Overview</h2>
            <div className="grid grid-cols-2 gap-3">
              {lentOut > 0 && (
                <StatCard
                  emoji="🤝"
                  label="Owed to You"
                  amount={lentOut}
                  color="blue"
                />
              )}
              {borrowed > 0 && (
                <StatCard
                  emoji="🏦"
                  label="You Owe"
                  amount={borrowed}
                  color="blue"
                />
              )}
              {totalSaved > 0 && (
                <StatCard
                  emoji="🎯"
                  label={`Saved (${savingsGoalCount} goal${savingsGoalCount !== 1 ? "s" : ""})`}
                  amount={totalSaved}
                  color="teal"
                />
              )}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Totals */}
      <FadeIn delay={0.25}>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            emoji="💰"
            label="Total Income"
            amount={totalIncome}
            color="emerald"
          />
          <StatCard
            emoji="💸"
            label="Total Expenses"
            amount={totalExpenses}
            color="red"
          />
        </div>
      </FadeIn>
    </div>
  );
}
