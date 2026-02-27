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
  type: "income" | "expense";
  amount: number;
  category: string;
  note: string | null;
  date: string;
  created_at: string;
}
