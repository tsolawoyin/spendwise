"use client";

import { useParams } from "next/navigation";
import { useRecord } from "@/hooks/useRecord";
import type { Loan } from "@/lib/types";
import LoanForm from "@/components/LoanForm";
import EditFormSkeleton from "@/components/skeletons/EditFormSkeleton";

export default function EditLoanPage() {
  const { id } = useParams<{ id: string }>();
  const { record: loan, isLoading } = useRecord<Loan>("loans", id);

  if (isLoading || !loan) return <EditFormSkeleton />;

  return <LoanForm mode="edit" initialData={loan} />;
}
