-- =============================================
-- Loans & Savings tables for SpendWise
-- =============================================

-- 1. Loans
create table if not exists loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person_name text not null,
  type text not null check (type in ('lent', 'borrowed')),
  amount numeric(10,2) not null check (amount > 0),
  date date not null default current_date,
  note text,
  is_settled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table loans enable row level security;

create policy "Users can manage own loans"
  on loans for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 2. Loan Repayments
create table if not exists loan_repayments (
  id uuid primary key default gen_random_uuid(),
  loan_id uuid not null references loans(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table loan_repayments enable row level security;

create policy "Users can manage own loan repayments"
  on loan_repayments for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 3. Savings Goals
create table if not exists savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric(10,2) not null check (target_amount > 0),
  deadline date,
  created_at timestamptz not null default now()
);

alter table savings_goals enable row level security;

create policy "Users can manage own savings goals"
  on savings_goals for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 4. Savings Transactions
create table if not exists savings_transactions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references savings_goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('deposit', 'withdraw')),
  amount numeric(10,2) not null check (amount > 0),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table savings_transactions enable row level security;

create policy "Users can manage own savings transactions"
  on savings_transactions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
