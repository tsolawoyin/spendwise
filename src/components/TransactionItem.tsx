"use client";

import type { Transaction } from "@/lib/types";
import {
  EXPENSE_CATEGORIES,
  INCOME_SOURCES,
} from "@/lib/categoryConfig";

function getEmoji(type: "income" | "expense", category: string): string {
  if (type === "income") {
    return INCOME_SOURCES.find((s) => s.name === category)?.emoji ?? "💵";
  }
  return EXPENSE_CATEGORIES.find((c) => c.name === category)?.emoji ?? "📦";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const emoji = getEmoji(transaction.type, transaction.category);
  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="text-sm font-medium">{transaction.category}</p>
          {transaction.note && (
            <p className="text-xs text-muted-foreground truncate max-w-40">
              {transaction.note}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            isIncome
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isIncome ? "+" : "-"}₦{transaction.amount.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(transaction.date)}
        </p>
      </div>
    </div>
  );
}
