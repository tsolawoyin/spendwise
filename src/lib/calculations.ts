export function calcBalance(totalIncome: number, totalExpenses: number): number {
  return totalIncome - totalExpenses;
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
