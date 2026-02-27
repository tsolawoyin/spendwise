export const EXPENSE_CATEGORIES = [
  { name: "Food", emoji: "🍔" },
  { name: "Transport", emoji: "🚌" },
  { name: "Data", emoji: "📱" },
  { name: "School", emoji: "📚" },
  { name: "Airtime", emoji: "📞" },
  { name: "Personal", emoji: "🛍️" },
  { name: "Other", emoji: "📦" },
] as const;

export const INCOME_SOURCES = [
  { name: "Allowance", emoji: "💵" },
  { name: "Gift", emoji: "🎁" },
  { name: "Work", emoji: "💼" },
  { name: "Other", emoji: "📦" },
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["name"];
export type IncomeSource = (typeof INCOME_SOURCES)[number]["name"];
