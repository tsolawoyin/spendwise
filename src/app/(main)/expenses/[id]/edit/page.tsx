"use client";

import { useParams } from "next/navigation";
import { useRecord } from "@/hooks/useRecord";
import type { Expense } from "@/lib/types";
import ExpenseForm from "@/components/ExpenseForm";
import EditFormSkeleton from "@/components/skeletons/EditFormSkeleton";

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>();
  const { record: expense, isLoading } = useRecord<Expense>("expenses", id);

  if (isLoading || !expense) return <EditFormSkeleton />;

  return <ExpenseForm mode="edit" initialData={expense} />;
}
