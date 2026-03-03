"use client";

import { useParams } from "next/navigation";
import { useRecord } from "@/hooks/useRecord";
import type { SavingsGoal } from "@/lib/types";
import SavingsGoalForm from "@/components/SavingsGoalForm";
import EditFormSkeleton from "@/components/skeletons/EditFormSkeleton";

export default function EditSavingsGoalPage() {
  const { id } = useParams<{ id: string }>();
  const { record: goal, isLoading } = useRecord<SavingsGoal>("savings_goals", id);

  if (isLoading || !goal) return <EditFormSkeleton />;

  return <SavingsGoalForm mode="edit" initialData={goal} />;
}
