"use client";

import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import LoanSummaryCard from "@/components/LoanSummaryCard";
import SavingsSummaryCard from "@/components/SavingsSummaryCard";
import type { LoanWithRepayments, SavingsGoalWithProgress } from "@/lib/types";

interface WalletContentProps {
  loans: LoanWithRepayments[];
  goals: SavingsGoalWithProgress[];
}

export default function WalletContent({ loans, goals }: WalletContentProps) {
  return (
    <div className="space-y-4">
      <FadeIn>
        <h1 className="text-2xl font-bold">Wallet 💼</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your loans and savings
        </p>
      </FadeIn>

      {/* Quick add buttons */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/wallet/loans/add"
            className="flex items-center justify-center gap-2 h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          >
            + Loan
          </Link>
          <Link
            href="/wallet/savings/add"
            className="flex items-center justify-center gap-2 h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-colors"
          >
            + Savings Goal
          </Link>
        </div>
      </FadeIn>

      {/* Loan Summary */}
      <FadeIn delay={0.1}>
        <LoanSummaryCard loans={loans} />
      </FadeIn>

      {/* Savings Summary */}
      <FadeIn delay={0.15}>
        <SavingsSummaryCard goals={goals} />
      </FadeIn>
    </div>
  );
}
