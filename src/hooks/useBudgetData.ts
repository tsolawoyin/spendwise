"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import type { Budget, Income, Expense } from "@/lib/types";

interface BudgetData {
  budget: Budget;
  income: Income[];
  expenses: Expense[];
  allBudgets?: Budget[];
}

interface UseBudgetDataOptions {
  budgetOnly?: boolean;
  budgetId?: string;
  includeAllBudgets?: boolean;
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
      let budget: Budget | null = null;

      if (options?.budgetId) {
        // Fetch specific budget by ID
        const { data: specificBudget } = await supabase
          .from("budgets")
          .select("*")
          .eq("id", options.budgetId)
          .eq("user_id", user!.id)
          .single();
        budget = specificBudget;
      } else {
        // Fetch most recent budget
        const { data: latestBudget } = await supabase
          .from("budgets")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        budget = latestBudget;
      }

      if (cancelled) return;

      if (!budget) {
        router.replace("/onboarding");
        return;
      }

      // Optionally fetch all budgets for profile
      let allBudgets: Budget[] | undefined;
      if (options?.includeAllBudgets) {
        const { data: budgets } = await supabase
          .from("budgets")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });
        allBudgets = budgets ?? [];
      }

      if (cancelled) return;

      if (options?.budgetOnly) {
        setData({ budget, income: [], expenses: [], allBudgets });
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
        allBudgets,
      });
      setIsLoading(false);
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [user, supabase, router, options?.budgetOnly, options?.budgetId, options?.includeAllBudgets]);

  return { data, isLoading };
}
