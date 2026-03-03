"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/StaggerList";
import type { LoanWithRepayments } from "@/lib/types";

interface LoanDetailContentProps {
  loan: LoanWithRepayments;
}

export default function LoanDetailContent({ loan }: LoanDetailContentProps) {
  const { supabase } = useApp();
  const router = useRouter();
  const isLent = loan.type === "lent";
  const percent = loan.amount > 0
    ? Math.round((loan.totalRepaid / loan.amount) * 100)
    : 0;

  const toggleSettle = async () => {
    const action = loan.is_settled ? "reopen this loan" : "mark this loan as settled";
    if (!window.confirm(`Are you sure you want to ${action}?`)) return;

    const { error } = await supabase
      .from("loans")
      .update({ is_settled: !loan.is_settled })
      .eq("id", loan.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(loan.is_settled ? "Loan reopened" : "Loan marked as settled");
    router.replace(`/wallet/loans/${loan.id}`);
  };

  const deleteRepayment = async (repaymentId: string) => {
    if (!window.confirm("Delete this repayment?")) return;

    const { error } = await supabase
      .from("loan_repayments")
      .delete()
      .eq("id", repaymentId);

    if (error) {
      toast.error(error.message);
      return;
    }

    // Un-settle the loan if it was auto-settled
    if (loan.is_settled) {
      await supabase
        .from("loans")
        .update({ is_settled: false })
        .eq("id", loan.id);
    }

    toast.success("Repayment deleted");
    router.replace(`/wallet/loans/${loan.id}`);
  };

  return (
    <div className="space-y-5">
      <FadeIn>
        <div className="flex items-center justify-between">
          <Link
            href="/wallet/loans"
            className="text-sm text-blue-600 dark:text-blue-400"
          >
            &larr; Loans
          </Link>
          <Link
            href={`/wallet/loans/${loan.id}/edit`}
            className="text-sm text-blue-600 dark:text-blue-400"
          >
            Edit
          </Link>
        </div>
      </FadeIn>

      {/* Header */}
      <FadeIn>
        <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{isLent ? "🤝" : "🏦"}</span>
            <span className="text-sm text-slate-400">
              {isLent ? "You lent to" : "You borrowed from"}
            </span>
          </div>
          <p className="text-xl font-bold">{loan.person_name}</p>
          <p className="text-3xl font-bold mt-2">
            ₦{Number(loan.amount).toLocaleString()}
          </p>

          {/* Progress bar */}
          <div className="mt-4 bg-slate-700 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-blue-400 h-full rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-400">
            <span>₦{loan.totalRepaid.toLocaleString()} repaid</span>
            <span>₦{loan.remaining.toLocaleString()} left</span>
          </div>
        </div>
      </FadeIn>

      {/* Status + Actions */}
      <FadeIn delay={0.05}>
        <div className="flex gap-3">
          {!loan.is_settled && (
            <Link
              href={`/wallet/loans/${loan.id}/repay`}
              className="flex-1 flex items-center justify-center h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
            >
              Record Repayment
            </Link>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={toggleSettle}
            className={`flex-1 h-12 font-semibold rounded-xl transition-colors ${
              loan.is_settled
                ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            }`}
          >
            {loan.is_settled ? "Reopen" : "Mark Settled"}
          </motion.button>
        </div>
      </FadeIn>

      {/* Loan info */}
      <FadeIn delay={0.1}>
        <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4 space-y-2">
          {loan.note && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Note</span>
              <span>{loan.note}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span>{new Date(loan.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={loan.is_settled ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}>
              {loan.is_settled ? "Settled" : "Active"}
            </span>
          </div>
        </div>
      </FadeIn>

      {/* Repayment History */}
      <FadeIn delay={0.15}>
        <h2 className="text-lg font-semibold mb-2">Repayments</h2>
        {loan.repayments.length > 0 ? (
          <StaggerList className="divide-y divide-border bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
            {loan.repayments.map((r) => (
              <StaggerItem key={r.id}>
                <div className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💱</span>
                    <p className="text-sm text-muted-foreground">
                      {new Date(r.date).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      ₦{Number(r.amount).toLocaleString()}
                    </p>
                    <button
                      onClick={() => deleteRepayment(r.id)}
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-3xl mb-1">📭</p>
            <p className="text-sm">No repayments yet</p>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
