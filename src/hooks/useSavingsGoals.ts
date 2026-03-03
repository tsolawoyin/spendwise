"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import type { SavingsGoal, SavingsTransaction, SavingsGoalWithProgress } from "@/lib/types";
import { enrichSavingsGoal } from "@/lib/calculations";

export function useSavingsGoals() {
  const { supabase, user } = useApp();
  const router = useRouter();
  const [goals, setGoals] = useState<SavingsGoalWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    async function fetchGoals() {
      const [goalsResult, txnsResult] = await Promise.all([
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
      ]);

      if (cancelled) return;

      const rawGoals: SavingsGoal[] = goalsResult.data ?? [];
      const rawTxns: SavingsTransaction[] = txnsResult.data ?? [];

      const enriched = rawGoals.map((g) => enrichSavingsGoal(g, rawTxns));
      setGoals(enriched);
      setIsLoading(false);
    }

    fetchGoals();

    return () => {
      cancelled = true;
    };
  }, [user, supabase, router]);

  return { goals, isLoading };
}
