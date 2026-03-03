"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { LoanWithRepayments } from "@/lib/types";

interface LoanSummaryCardProps {
  loans: LoanWithRepayments[];
}

export default function LoanSummaryCard({ loans }: LoanSummaryCardProps) {
  const active = loans.filter((l) => !l.is_settled);
  const lentOut = active
    .filter((l) => l.type === "lent")
    .reduce((s, l) => s + l.remaining, 0);
  const borrowed = active
    .filter((l) => l.type === "borrowed")
    .reduce((s, l) => s + l.remaining, 0);

  return (
    <Link href="/wallet/loans">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🤝</span>
          <p className="text-sm font-semibold">Loans</p>
          <span className="ml-auto text-xs text-muted-foreground">
            {active.length} active
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Owed to you</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              ₦{lentOut.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">You owe</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              ₦{borrowed.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
