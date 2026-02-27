import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeStreak } from "@/lib/calculations";
import { EXPENSE_CATEGORIES } from "@/lib/categoryConfig";
import SummaryContent from "@/components/SummaryContent";

interface CategoryTotal {
  category: string;
  emoji: string;
  amount: number;
  percent: number;
}

export default async function SummaryPage() {
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
    .lte("date", budget.end_date);

  // Fetch expenses within budget period
  const { data: expenseRows } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", budget.start_date)
    .lte("date", budget.end_date);

  const income = incomeRows ?? [];
  const expenses = expenseRows ?? [];

  const totalIncome = income.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );
  const totalExpenses = expenses.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );

  // Compute streak
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
