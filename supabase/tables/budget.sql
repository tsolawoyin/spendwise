-- 2. Budgets
create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

alter table budgets enable row level security;

create policy "Users can view their own budgets"
  on budgets for select
  using (user_id = auth.uid());

create policy "Users can insert their own budgets"
  on budgets for insert
  with check (user_id = auth.uid());

create policy "Users can update their own budgets"
  on budgets for update
  using (user_id = auth.uid());

create policy "Users can delete their own budgets"
  on budgets for delete
  using (user_id = auth.uid());