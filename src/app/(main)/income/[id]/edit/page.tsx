"use client";

import { useParams } from "next/navigation";
import { useRecord } from "@/hooks/useRecord";
import type { Income } from "@/lib/types";
import IncomeForm from "@/components/IncomeForm";
import EditFormSkeleton from "@/components/skeletons/EditFormSkeleton";

export default function EditIncomePage() {
  const { id } = useParams<{ id: string }>();
  const { record: income, isLoading } = useRecord<Income>("income", id);

  if (isLoading || !income) return <EditFormSkeleton />;

  return <IncomeForm mode="edit" initialData={income} />;
}
