"use client";

import { useLoans } from "@/hooks/useLoans";
import LoansListContent from "@/components/LoansListContent";
import HistorySkeleton from "@/components/skeletons/HistorySkeleton";

export default function LoansPage() {
  const { loans, isLoading } = useLoans();

  if (isLoading) return <HistorySkeleton />;

  return <LoansListContent loans={loans} />;
}
