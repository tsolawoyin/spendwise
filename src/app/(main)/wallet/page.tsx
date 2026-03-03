"use client";

import { useLoans } from "@/hooks/useLoans";
import { useSavingsGoals } from "@/hooks/useSavingsGoals";
import WalletContent from "@/components/WalletContent";
import WalletSkeleton from "@/components/skeletons/WalletSkeleton";

export default function WalletPage() {
  const { loans, isLoading: loansLoading } = useLoans();
  const { goals, isLoading: goalsLoading } = useSavingsGoals();

  if (loansLoading || goalsLoading) return <WalletSkeleton />;

  return <WalletContent loans={loans} goals={goals} />;
}
