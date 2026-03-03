"use client";

import { useSearchParams } from "next/navigation";
import { useBudgetData } from "@/hooks/useBudgetData";
import type { Transaction } from "@/lib/types";
import HistoryContent from "@/components/HistoryContent";
import HistorySkeleton from "@/components/skeletons/HistorySkeleton";

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const budgetId = searchParams.get("budgetId") ?? undefined;
  const { data, isLoading } = useBudgetData({
    budgetId,
    includeLoans: true,
  });

  if (isLoading || !data) return <HistorySkeleton />;

  const { income, expenses, loans, loanRepayments } = data;

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
    ...(loans ?? []).map((row) => ({
      id: row.id,
      type: "loan" as const,
      amount: Number(row.amount),
      category: row.type === "lent" ? "Lent" : "Borrowed",
      note: row.person_name,
      date: row.date,
      created_at: row.created_at,
    })),
    ...(loanRepayments ?? []).map((row) => ({
      id: row.id,
      type: "loan_repayment" as const,
      amount: Number(row.amount),
      category: "Repayment",
      note: null,
      date: row.date,
      created_at: row.created_at,
    })),
  ].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() ||
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return <HistoryContent transactions={transactions} />;
}
