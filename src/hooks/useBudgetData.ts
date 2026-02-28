"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import type { Budget, Income, Expense } from "@/lib/types";

interface BudgetData {
  budget: Budget;
  income: Income[];
  expenses: Expense[];
}

interface UseBudgetDataOptions {
  budgetOnly?: boolean;
}

export function useBudgetData(options?: UseBudgetDataOptions) {
  const { supabase, user } = useApp();
  const router = useRouter();
  const [data, setData] = useState<BudgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    async function fetchData() {
      // Fetch most recent budget
      const { data: budget } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (cancelled) return;

      if (!budget) {
        router.replace("/onboarding");
        return;
      }

      if (options?.budgetOnly) {
        setData({ budget, income: [], expenses: [] });
        setIsLoading(false);
        return;
      }

      // Fetch income + expenses in parallel
      const [incomeResult, expenseResult] = await Promise.all([
        supabase
          .from("income")
          .select("*")
          .eq("user_id", user!.id)
          .gte("date", budget.start_date)
          .lte("date", budget.end_date)
          .order("date", { ascending: false }),
        supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user!.id)
          .gte("date", budget.start_date)
          .lte("date", budget.end_date)
          .order("date", { ascending: false }),
      ]);

      if (cancelled) return;

      setData({
        budget,
        income: incomeResult.data ?? [],
        expenses: expenseResult.data ?? [],
      });
      setIsLoading(false);
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [user, supabase, router, options?.budgetOnly]);

  return { data, isLoading };
}
