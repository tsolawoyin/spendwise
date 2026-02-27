"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { Transaction } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaggerList, StaggerItem } from "@/components/motion/StaggerList";
import FadeIn from "@/components/motion/FadeIn";
import TransactionItem from "@/components/TransactionItem";

interface HistoryContentProps {
  transactions: Transaction[];
}

function formatGroupDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function groupByDate(transactions: Transaction[]) {
  const groups: { label: string; date: string; items: Transaction[] }[] = [];
  const map = new Map<string, Transaction[]>();

  for (const tx of transactions) {
    const existing = map.get(tx.date);
    if (existing) {
      existing.push(tx);
    } else {
      const items = [tx];
      map.set(tx.date, items);
      groups.push({ label: formatGroupDate(tx.date), date: tx.date, items });
    }
  }

  return groups;
}

function editPath(tx: Transaction): string {
  return tx.type === "income"
    ? `/income/${tx.id}/edit`
    : `/expenses/${tx.id}/edit`;
}

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const groups = useMemo(() => groupByDate(transactions), [transactions]);

  if (transactions.length === 0) {
    return (
      <FadeIn>
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm">No transactions found</p>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.date}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
            {group.label}
          </p>
          <StaggerList className="divide-y divide-border bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
            {group.items.map((tx) => (
              <StaggerItem key={tx.id}>
                <Link href={editPath(tx)}>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <TransactionItem transaction={tx} />
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      ))}
    </div>
  );
}

export default function HistoryContent({
  transactions,
}: HistoryContentProps) {
  const incomeOnly = useMemo(
    () => transactions.filter((tx) => tx.type === "income"),
    [transactions]
  );
  const expenseOnly = useMemo(
    () => transactions.filter((tx) => tx.type === "expense"),
    [transactions]
  );

  return (
    <div className="space-y-4">
      <FadeIn>
        <h1 className="text-2xl font-bold">History 📋</h1>
      </FadeIn>

      <Tabs defaultValue="all">
        <FadeIn delay={0.05}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="income" className="flex-1">
              Income
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex-1">
              Expenses
            </TabsTrigger>
          </TabsList>
        </FadeIn>

        <TabsContent value="all" className="mt-4">
          <TransactionList transactions={transactions} />
        </TabsContent>
        <TabsContent value="income" className="mt-4">
          <TransactionList transactions={incomeOnly} />
        </TabsContent>
        <TabsContent value="expenses" className="mt-4">
          <TransactionList transactions={expenseOnly} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
