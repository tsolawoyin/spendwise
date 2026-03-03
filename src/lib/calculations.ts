export function calcBalance(
  totalIncome: number,
  totalExpenses: number,
  loanImpact: number = 0,
  totalSaved: number = 0,
): number {
  return totalIncome - totalExpenses - loanImpact - totalSaved;
}

export function calcDaysLeft(endDate: string | Date): number {
  const end = new Date(endDate);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function calcDailyAllowance(
  balance: number,
  daysLeft: number,
): number {
  if (daysLeft <= 0) return 0;
  return Math.max(0, Math.floor(balance / daysLeft));
}

export function calcBudgetPercent(
  daysLeft: number,
  totalBudgetDays: number,
): number {
  if (totalBudgetDays <= 0) return 0;
  return Math.round(((totalBudgetDays - daysLeft) / totalBudgetDays) * 100);
}

export function computeStreak(expenseDates: string[]): number {
  if (expenseDates.length === 0) return 0;

  const uniqueDates = [...new Set(expenseDates)].sort().reverse();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mostRecent = new Date(uniqueDates[0]);
  mostRecent.setHours(0, 0, 0, 0);

  // Streak must include today or yesterday
  const diffFromToday = Math.floor(
    (today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffFromToday > 1) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    prev.setHours(0, 0, 0, 0);
    curr.setHours(0, 0, 0, 0);

    const diff = Math.floor(
      (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// --- Loan helpers ---

import type {
  Loan,
  LoanRepayment,
  LoanWithRepayments,
  SavingsGoal,
  SavingsTransaction,
  SavingsGoalWithProgress,
} from "@/lib/types";

export function enrichLoan(
  loan: Loan,
  repayments: LoanRepayment[],
): LoanWithRepayments {
  const loanRepayments = repayments.filter((r) => r.loan_id === loan.id);
  const totalRepaid = loanRepayments.reduce((s, r) => s + Number(r.amount), 0);
  return {
    ...loan,
    amount: Number(loan.amount),
    repayments: loanRepayments,
    totalRepaid,
    remaining: Number(loan.amount) - totalRepaid,
  };
}

/** Outstanding lent minus outstanding borrowed */
export function calcLoanImpact(loans: LoanWithRepayments[]): number {
  let lent = 0;
  let borrowed = 0;
  for (const loan of loans) {
    if (loan.is_settled) continue;
    if (loan.type === "lent") lent += loan.remaining;
    else borrowed += loan.remaining;
  }
  return lent - borrowed;
}

// --- Savings helpers ---

export function enrichSavingsGoal(
  goal: SavingsGoal,
  transactions: SavingsTransaction[],
): SavingsGoalWithProgress {
  const goalTxns = transactions.filter((t) => t.goal_id === goal.id);
  const totalSaved = goalTxns.reduce((s, t) => {
    const amt = Number(t.amount);
    return t.type === "deposit" ? s + amt : s - amt;
  }, 0);
  const target = Number(goal.target_amount);
  return {
    ...goal,
    target_amount: target,
    transactions: goalTxns,
    totalSaved: Math.max(0, totalSaved),
    percent: target > 0 ? Math.min(100, Math.round((totalSaved / target) * 100)) : 0,
  };
}

export function calcTotalSaved(goals: SavingsGoalWithProgress[]): number {
  return goals.reduce((s, g) => s + g.totalSaved, 0);
}
