"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaggerList, StaggerItem } from "@/components/motion/StaggerList";
import FadeIn from "@/components/motion/FadeIn";
import LoanItem from "@/components/LoanItem";
import type { LoanWithRepayments } from "@/lib/types";

interface LoansListContentProps {
  loans: LoanWithRepayments[];
}

export default function LoansListContent({ loans }: LoansListContentProps) {
  const active = useMemo(
    () => loans.filter((l) => !l.is_settled),
    [loans],
  );
  const settled = useMemo(
    () => loans.filter((l) => l.is_settled),
    [loans],
  );

  return (
    <div className="space-y-4">
      <FadeIn>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Loans 🤝</h1>
          <Link
            href="/wallet/loans/add"
            className="flex items-center justify-center h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            + Add
          </Link>
        </div>
      </FadeIn>

      <Tabs defaultValue="active">
        <FadeIn delay={0.05}>
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">
              Active ({active.length})
            </TabsTrigger>
            <TabsTrigger value="settled" className="flex-1">
              Settled ({settled.length})
            </TabsTrigger>
          </TabsList>
        </FadeIn>

        <TabsContent value="active" className="mt-4">
          <LoanList loans={active} emptyMessage="No active loans" />
        </TabsContent>
        <TabsContent value="settled" className="mt-4">
          <LoanList loans={settled} emptyMessage="No settled loans" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoanList({
  loans,
  emptyMessage,
}: {
  loans: LoanWithRepayments[];
  emptyMessage: string;
}) {
  if (loans.length === 0) {
    return (
      <FadeIn>
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      </FadeIn>
    );
  }

  return (
    <StaggerList className="divide-y divide-border bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
      {loans.map((loan) => (
        <StaggerItem key={loan.id}>
          <Link href={`/wallet/loans/${loan.id}`}>
            <motion.div whileTap={{ scale: 0.98 }}>
              <LoanItem loan={loan} />
            </motion.div>
          </Link>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
