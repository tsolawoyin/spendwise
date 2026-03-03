"use client";

import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/StaggerList";
import SavingsGoalCard from "@/components/SavingsGoalCard";
import type { SavingsGoalWithProgress } from "@/lib/types";

interface SavingsGoalsListProps {
  goals: SavingsGoalWithProgress[];
}

export default function SavingsGoalsList({ goals }: SavingsGoalsListProps) {
  const totalSaved = goals.reduce((s, g) => s + g.totalSaved, 0);

  return (
    <div className="space-y-4">
      <FadeIn>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Savings 🎯</h1>
          <Link
            href="/wallet/savings/add"
            className="flex items-center justify-center h-9 px-4 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            + New Goal
          </Link>
        </div>
      </FadeIn>

      {/* Total saved banner */}
      <FadeIn delay={0.05}>
        <div className="bg-teal-500/10 rounded-xl p-4 text-center">
          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
            Total Saved
          </p>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            ₦{totalSaved.toLocaleString()}
          </p>
        </div>
      </FadeIn>

      {/* Goals grid */}
      {goals.length > 0 ? (
        <StaggerList className="space-y-3">
          {goals.map((goal) => (
            <StaggerItem key={goal.id}>
              <SavingsGoalCard goal={goal} />
            </StaggerItem>
          ))}
        </StaggerList>
      ) : (
        <FadeIn>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-2">🎯</p>
            <p className="text-sm">No savings goals yet</p>
            <p className="text-xs mt-1">Create your first goal to start saving!</p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
