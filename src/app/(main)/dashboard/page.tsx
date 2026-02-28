"use client";

import { useBudgetData } from "@/hooks/useBudgetData";
import { computeStreak } from "@/lib/calculations";
import type { Transaction } from "@/lib/types";
import DashboardContent from "@/components/DashboardContent";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export default function DashboardPage() {
  const { data, isLoading } = useBudgetData();

  if (isLoading || !data) return <DashboardSkeleton />;

  const { budget, income, expenses } = data;

  const totalIncome = income.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );
  const totalExpenses = expenses.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );

  // Build merged transaction list, sorted by date descending, take last 5
  const transactions: Transaction[] = [
    ...income.map((row) => ({
      id: row.id,
      type: "income" as const,
      amount: Number(row.amount),
      category: row.source,
      note: null,
      date: row.date,
      created_at: row.created_at,
    })),
    ...expenses.map((row) => ({
      id: row.id,
      type: "expense" as const,
      amount: Number(row.amount),
      category: row.category,
      note: row.note,
      date: row.date,
      created_at: row.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime() ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const expenseDates = expenses.map((row) => row.date);
  const streak = computeStreak(expenseDates);

  return (
    <DashboardContent
      budget={budget}
      totalIncome={totalIncome}
      totalExpenses={totalExpenses}
      recentTransactions={transactions}
      streak={streak}
    />
  );
}
