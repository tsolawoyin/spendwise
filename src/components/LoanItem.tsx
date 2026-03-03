"use client";

import type { LoanWithRepayments } from "@/lib/types";

interface LoanItemProps {
  loan: LoanWithRepayments;
}

export default function LoanItem({ loan }: LoanItemProps) {
  const emoji = loan.type === "lent" ? "🤝" : "🏦";
  const isLent = loan.type === "lent";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="text-sm font-medium">{loan.person_name}</p>
          <p className="text-xs text-muted-foreground">
            {isLent ? "You lent" : "You borrowed"} · ₦{Number(loan.amount).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            loan.is_settled
              ? "text-slate-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        >
          {loan.is_settled ? "Settled" : `₦${loan.remaining.toLocaleString()}`}
        </p>
        {!loan.is_settled && (
          <p className="text-xs text-muted-foreground">remaining</p>
        )}
      </div>
    </div>
  );
}
