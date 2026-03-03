"use client";

import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const budgetId = searchParams.get("budgetId") ?? undefined;
  const { data, isLoading } = useBudgetData({
    budgetId,
    includeLoans: true,
    includeSavings: true,
  });

  if (isLoading || !data) return <SummarySkeleton />;

  const { income, expenses, enrichedLoans, loanImpact, enrichedGoals, totalSaved } = data;

  const totalIncome = income.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );
  const totalExpenses = expenses.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );

  // Loan & savings data (pre-enriched by useBudgetData)
  const activeLoans = (enrichedLoans ?? []).filter((l) => !l.is_settled);
  const lentOut = activeLoans.filter((l) => l.type === "lent").reduce((s, l) => s + l.remaining, 0);
  const borrowed = activeLoans.filter((l) => l.type === "borrowed").reduce((s, l) => s + l.remaining, 0);

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
      lentOut={lentOut}
      borrowed={borrowed}
      loanImpact={loanImpact ?? 0}
      totalSaved={totalSaved ?? 0}
      savingsGoalCount={(enrichedGoals ?? []).length}
    />
  );
}
