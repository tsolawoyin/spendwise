"use client";

import Link from "next/link";
import { motion } from "motion/react";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/StaggerList";
import SavingsProgressRing from "@/components/SavingsProgressRing";
import type { SavingsGoalWithProgress } from "@/lib/types";

interface SavingsGoalDetailContentProps {
  goal: SavingsGoalWithProgress;
}

export default function SavingsGoalDetailContent({ goal }: SavingsGoalDetailContentProps) {
  const remaining = Number(goal.target_amount) - goal.totalSaved;
  const deadlineStr = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-5">
      <FadeIn>
        <div className="flex items-center justify-between">
          <Link
            href="/wallet/savings"
            className="text-sm text-teal-600 dark:text-teal-400"
          >
            &larr; Savings
          </Link>
          <Link
            href={`/wallet/savings/${goal.id}/edit`}
            className="text-sm text-teal-600 dark:text-teal-400"
          >
            Edit
          </Link>
        </div>
      </FadeIn>

      {/* Hero */}
      <FadeIn>
        <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 text-white flex items-start gap-5">
          <SavingsProgressRing percent={goal.percent} size={80} strokeWidth={6} />
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-1">{goal.name}</p>
            <p className="text-3xl font-bold">
              ₦{goal.totalSaved.toLocaleString()}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              of ₦{Number(goal.target_amount).toLocaleString()} · ₦{remaining.toLocaleString()} to go
            </p>
            {deadlineStr && (
              <p className="text-xs text-slate-500 mt-1">
                Deadline: {deadlineStr}
              </p>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Actions */}
      <FadeIn delay={0.05}>
        <div className="flex gap-3">
          <Link
            href={`/wallet/savings/${goal.id}/deposit`}
            className="flex-1 flex items-center justify-center h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-colors"
          >
            Deposit
          </Link>
          <Link
            href={`/wallet/savings/${goal.id}/withdraw`}
            className={`flex-1 flex items-center justify-center h-12 font-semibold rounded-xl transition-colors ${
              goal.totalSaved > 0
                ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 pointer-events-none"
            }`}
          >
            Withdraw
          </Link>
        </div>
      </FadeIn>

      {/* Transaction History */}
      <FadeIn delay={0.1}>
        <h2 className="text-lg font-semibold mb-2">Transactions</h2>
        {goal.transactions.length > 0 ? (
          <StaggerList className="divide-y divide-border bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
            {goal.transactions.map((t) => (
              <StaggerItem key={t.id}>
                <div className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {t.type === "deposit" ? "🐷" : "💱"}
                    </span>
                    <div>
                      <p className="text-sm font-medium capitalize">{t.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.date).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      t.type === "deposit"
                        ? "text-teal-600 dark:text-teal-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {t.type === "deposit" ? "+" : "-"}₦{Number(t.amount).toLocaleString()}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-3xl mb-1">📭</p>
            <p className="text-sm">No transactions yet</p>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
