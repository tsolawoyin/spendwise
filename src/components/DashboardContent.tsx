"use client";

import type { Budget, Transaction } from "@/lib/types";
import { useApp } from "@/providers/app-provider";
import { useXP } from "@/hooks/useXP";
import {
  calcBalance,
  calcDaysLeft,
  calcDailyAllowance,
  calcBudgetPercent,
} from "@/lib/calculations";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/StaggerList";
import LevelBadge from "@/components/LevelBadge";
import XPBadge from "@/components/XPBadge";
import StreakCard from "@/components/StreakCard";
import BalanceCard from "@/components/BalanceCard";
import StatCard from "@/components/StatCard";
import QuickActions from "@/components/QuickActions";
import TransactionItem from "@/components/TransactionItem";

interface DashboardContentProps {
  budget: Budget;
  totalIncome: number;
  totalExpenses: number;
  recentTransactions: Transaction[];
  streak: number;
}

export default function DashboardContent({
  budget,
  totalIncome,
  totalExpenses,
  recentTransactions,
  streak,
}: DashboardContentProps) {
  const { user } = useApp();
  const { xp, level } = useXP();

  const balance = calcBalance(totalIncome, totalExpenses);
  const daysLeft = calcDaysLeft(budget.end_date);
  const dailyAllowance = calcDailyAllowance(balance, daysLeft);

  const startDate = new Date(budget.start_date);
  const endDate = new Date(budget.end_date);
  const totalBudgetDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const budgetPercent = calcBudgetPercent(daysLeft, totalBudgetDays);

  const firstName = user?.profile?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-4">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hi, {firstName} 👋</h1>
            <div className="flex items-center gap-2 mt-1">
              <LevelBadge level={level} />
              <XPBadge xp={xp} />
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Streak */}
      <StreakCard streak={streak} />

      {/* Balance Card */}
      <BalanceCard
        balance={balance}
        budgetPercent={budgetPercent}
        daysLeft={daysLeft}
        dailyAllowance={dailyAllowance}
      />

      {/* Stats Grid */}
      <FadeIn delay={0.1}>
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

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Transactions */}
      <FadeIn delay={0.3}>
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        {recentTransactions.length > 0 ? (
          <StaggerList className="divide-y divide-border">
            {recentTransactions.map((tx) => (
              <StaggerItem key={tx.id}>
                <TransactionItem transaction={tx} />
              </StaggerItem>
            ))}
          </StaggerList>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">
              Add your first income or expense to get started!
            </p>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
