export interface Budget {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Income {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  date: string;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  date: string;
  note: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense" | "loan" | "loan_repayment" | "savings_deposit" | "savings_withdraw";
  amount: number;
  category: string;
  note: string | null;
  date: string;
  created_at: string;
}

// --- Loans ---

export interface Loan {
  id: string;
  user_id: string;
  person_name: string;
  type: "lent" | "borrowed";
  amount: number;
  date: string;
  note: string | null;
  is_settled: boolean;
  created_at: string;
}

export interface LoanRepayment {
  id: string;
  loan_id: string;
  user_id: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface LoanWithRepayments extends Loan {
  repayments: LoanRepayment[];
  totalRepaid: number;
  remaining: number;
}

// --- Savings ---

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  deadline: string | null;
  created_at: string;
}

export interface SavingsTransaction {
  id: string;
  goal_id: string;
  user_id: string;
  type: "deposit" | "withdraw";
  amount: number;
  date: string;
  created_at: string;
}

export interface SavingsGoalWithProgress extends SavingsGoal {
  transactions: SavingsTransaction[];
  totalSaved: number;
  percent: number;
}
