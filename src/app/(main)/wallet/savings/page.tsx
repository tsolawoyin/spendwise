"use client";

import { useSavingsGoals } from "@/hooks/useSavingsGoals";
import SavingsGoalsList from "@/components/SavingsGoalsList";
import HistorySkeleton from "@/components/skeletons/HistorySkeleton";

export default function SavingsPage() {
  const { goals, isLoading } = useSavingsGoals();

  if (isLoading) return <HistorySkeleton />;

  return <SavingsGoalsList goals={goals} />;
}
