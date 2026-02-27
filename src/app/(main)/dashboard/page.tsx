import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeStreak } from "@/lib/calculations";
import type { Transaction } from "@/lib/types";
import DashboardContent from "@/components/DashboardContent";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch most recent budget
  const { data: budget } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!budget) {
    redirect("/onboarding");
  }

  // Fetch income within budget period
  const { data: incomeRows } = await supabase
    .from("income")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", budget.start_date)
    .lte("date", budget.end_date)
    .order("date", { ascending: false });

  // Fetch expenses within budget period
  const { data: expenseRows } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", budget.start_date)
    .lte("date", budget.end_date)
    .order("date", { ascending: false });

  const income = incomeRows ?? [];
  const expenses = expenseRows ?? [];

  // Supabase returns numeric columns as strings
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

  // Compute streak from expense dates
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
