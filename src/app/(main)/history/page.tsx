import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Transaction } from "@/lib/types";
import HistoryContent from "@/components/HistoryContent";

export default async function HistoryPage() {
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

  // Build merged transaction list, sorted by date desc
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
  ].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() ||
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return <HistoryContent transactions={transactions} />;
}
