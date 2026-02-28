"use client";

import { useBudgetData } from "@/hooks/useBudgetData";
import { computeStreak } from "@/lib/calculations";
import { EXPENSE_CATEGORIES } from "@/lib/categoryConfig";
import SummaryContent from "@/components/SummaryContent";
import SummarySkeleton from "@/components/skeletons/SummarySkeleton";

interface CategoryTotal {
  category: string;
  emoji: string;
  amount: number;
  percent: number;
}

export default function SummaryPage() {
  const { data, isLoading } = useBudgetData();

  if (isLoading || !data) return <SummarySkeleton />;

  const { income, expenses } = data;

  const totalIncome = income.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );
  const totalExpenses = expenses.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );

  const expenseDates = expenses.map((row) => row.date);
  const streak = computeStreak(expenseDates);

  // Compute per-category totals
  const categoryMap = new Map<string, number>();
  for (const row of expenses) {
    const current = categoryMap.get(row.category) ?? 0;
    categoryMap.set(row.category, current + Number(row.amount));
  }

  const categoryTotals: CategoryTotal[] = Array.from(categoryMap.entries())
    .map(([category, amount]) => {
      const config = EXPENSE_CATEGORIES.find((c) => c.name === category);
      return {
        category,
        emoji: config?.emoji ?? "📦",
        amount,
        percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return (
    <SummaryContent
      totalIncome={totalIncome}
      totalExpenses={totalExpenses}
      streak={streak}
      expenseDates={expenseDates}
      categoryTotals={categoryTotals}
    />
  );
}
