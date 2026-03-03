"use client";

import { useSearchParams } from "next/navigation";
import { useBudgetData } from "@/hooks/useBudgetData";
import { computeStreak, enrichLoan, calcLoanImpact, enrichSavingsGoal, calcTotalSaved } from "@/lib/calculations";
import type { Transaction } from "@/lib/types";
import DashboardContent from "@/components/DashboardContent";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const budgetId = searchParams.get("budgetId") ?? undefined;
  const { data, isLoading } = useBudgetData({
    budgetId,
    includeLoans: true,
    includeSavings: true,
  });

  if (isLoading || !data) return <DashboardSkeleton />;

  const { budget, income, expenses, loans, loanRepayments, savingsGoals, savingsTransactions } = data;

  const totalIncome = income.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );
  const totalExpenses = expenses.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );

  // Compute loan impact
  const enrichedLoans = (loans ?? []).map((l) => enrichLoan(l, loanRepayments ?? []));
  const loanImpact = calcLoanImpact(enrichedLoans);

  // Compute savings total
  const enrichedGoals = (savingsGoals ?? []).map((g) => enrichSavingsGoal(g, savingsTransactions ?? []));
  const totalSaved = calcTotalSaved(enrichedGoals);

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
      isHistorical={!!budgetId}
      loanImpact={loanImpact}
      totalSaved={totalSaved}
    />
  );
}
