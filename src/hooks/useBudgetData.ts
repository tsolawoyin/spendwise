"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import type { Budget, Income, Expense, Loan, LoanRepayment, LoanWithRepayments, SavingsGoal, SavingsTransaction, SavingsGoalWithProgress } from "@/lib/types";
import { enrichLoan, calcLoanImpact, enrichSavingsGoal, calcTotalSaved } from "@/lib/calculations";

interface BudgetData {
  budget: Budget;
  income: Income[];
  expenses: Expense[];
  allBudgets?: Budget[];
  loans?: Loan[];
  loanRepayments?: LoanRepayment[];
  savingsGoals?: SavingsGoal[];
  savingsTransactions?: SavingsTransaction[];
  enrichedLoans?: LoanWithRepayments[];
  loanImpact?: number;
  enrichedGoals?: SavingsGoalWithProgress[];
  totalSaved?: number;
}

interface UseBudgetDataOptions {
  budgetOnly?: boolean;
  budgetId?: string;
  includeAllBudgets?: boolean;
  includeLoans?: boolean;
  includeSavings?: boolean;
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

      // Optionally fetch loans and savings (not budget-scoped)
      let loans: Loan[] | undefined;
      let loanRepayments: LoanRepayment[] | undefined;
      let savingsGoals: SavingsGoal[] | undefined;
      let savingsTransactions: SavingsTransaction[] | undefined;

      const extraFetches: Promise<void>[] = [];

      if (options?.includeLoans) {
        extraFetches.push(
          Promise.all([
            supabase
              .from("loans")
              .select("*")
              .eq("user_id", user!.id)
              .order("date", { ascending: false }),
            supabase
              .from("loan_repayments")
              .select("*")
              .eq("user_id", user!.id)
              .order("date", { ascending: false }),
          ]).then(([loansRes, repRes]) => {
            loans = loansRes.data ?? [];
            loanRepayments = repRes.data ?? [];
          }),
        );
      }

      if (options?.includeSavings) {
        extraFetches.push(
          Promise.all([
            supabase
              .from("savings_goals")
              .select("*")
              .eq("user_id", user!.id)
              .order("created_at", { ascending: false }),
            supabase
              .from("savings_transactions")
              .select("*")
              .eq("user_id", user!.id)
              .order("date", { ascending: false }),
          ]).then(([goalsRes, txnsRes]) => {
            savingsGoals = goalsRes.data ?? [];
            savingsTransactions = txnsRes.data ?? [];
          }),
        );
      }

      if (extraFetches.length > 0) {
        await Promise.all(extraFetches);
      }

      if (cancelled) return;

      // Pre-enrich loan/savings data so pages don't duplicate this
      let enrichedLoans: LoanWithRepayments[] | undefined;
      let loanImpactVal: number | undefined;
      if (loans && loanRepayments) {
        const reps = loanRepayments;
        enrichedLoans = loans.map((l) => enrichLoan(l, reps));
        loanImpactVal = calcLoanImpact(enrichedLoans);
      }

      let enrichedGoals: SavingsGoalWithProgress[] | undefined;
      let totalSavedVal: number | undefined;
      if (savingsGoals && savingsTransactions) {
        const txns = savingsTransactions;
        enrichedGoals = savingsGoals.map((g) => enrichSavingsGoal(g, txns));
        totalSavedVal = calcTotalSaved(enrichedGoals);
      }

      setData({
        budget,
        income: incomeResult.data ?? [],
        expenses: expenseResult.data ?? [],
        allBudgets,
        loans,
        loanRepayments,
        savingsGoals,
        savingsTransactions,
        enrichedLoans,
        loanImpact: loanImpactVal,
        enrichedGoals,
        totalSaved: totalSavedVal,
      });
      setIsLoading(false);
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [user, supabase, router, options?.budgetOnly, options?.budgetId, options?.includeAllBudgets, options?.includeLoans, options?.includeSavings]);

  return { data, isLoading };
}
