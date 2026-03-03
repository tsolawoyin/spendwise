"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import { enrichSavingsGoal } from "@/lib/calculations";
import type { SavingsGoal, SavingsTransaction, SavingsGoalWithProgress } from "@/lib/types";
import SavingsGoalDetailContent from "@/components/SavingsGoalDetailContent";
import SavingsDetailSkeleton from "@/components/skeletons/SavingsDetailSkeleton";

export default function SavingsGoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { supabase } = useApp();
  const router = useRouter();
  const [goal, setGoal] = useState<SavingsGoalWithProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      const [goalResult, txnsResult] = await Promise.all([
        supabase.from("savings_goals").select("*").eq("id", id).single(),
        supabase
          .from("savings_transactions")
          .select("*")
          .eq("goal_id", id)
          .order("date", { ascending: false }),
      ]);

      if (cancelled) return;

      if (!goalResult.data) {
        router.replace("/wallet/savings");
        return;
      }

      const enriched = enrichSavingsGoal(
        goalResult.data as SavingsGoal,
        (txnsResult.data ?? []) as SavingsTransaction[],
      );
      setGoal(enriched);
      setIsLoading(false);
    }

    fetch();
    return () => { cancelled = true; };
  }, [supabase, id, router]);

  if (isLoading || !goal) return <SavingsDetailSkeleton />;

  return <SavingsGoalDetailContent goal={goal} />;
}
