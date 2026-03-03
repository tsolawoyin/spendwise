"use client";

import type { Transaction } from "@/lib/types";
import {
  EXPENSE_CATEGORIES,
  INCOME_SOURCES,
} from "@/lib/categoryConfig";

function getEmoji(type: Transaction["type"], category: string): string {
  if (type === "income") {
    return INCOME_SOURCES.find((s) => s.name === category)?.emoji ?? "💵";
  }
  if (type === "expense") {
    return EXPENSE_CATEGORIES.find((c) => c.name === category)?.emoji ?? "📦";
  }
  if (type === "loan") return category === "lent" ? "🤝" : "🏦";
  if (type === "loan_repayment") return "💱";
  if (type === "savings_deposit") return "🐷";
  if (type === "savings_withdraw") return "💱";
  return "📦";
}

function getColor(type: Transaction["type"]): string {
  if (type === "income") return "text-emerald-600 dark:text-emerald-400";
  if (type === "expense") return "text-red-600 dark:text-red-400";
  if (type === "loan" || type === "loan_repayment") return "text-blue-600 dark:text-blue-400";
  if (type === "savings_deposit") return "text-teal-600 dark:text-teal-400";
  if (type === "savings_withdraw") return "text-red-600 dark:text-red-400";
  return "text-slate-600";
}

function getSign(type: Transaction["type"]): string {
  if (type === "income" || type === "loan_repayment" || type === "savings_withdraw") return "+";
  return "-";
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
        <p className={`text-sm font-semibold ${getColor(transaction.type)}`}>
          {getSign(transaction.type)}₦{transaction.amount.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(transaction.date)}
        </p>
      </div>
    </div>
  );
}
