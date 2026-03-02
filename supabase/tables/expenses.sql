-- 4. Expenses
create table expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  amount numeric(10,2) not null,
  category text not null,
  date date not null default current_date,
  note text,
  created_at timestamptz default now()
);

alter table expenses enable row level security;

create policy "Users can view their own expenses"
  on expenses for select
  using (user_id = auth.uid());

create policy "Users can insert their own expenses"
  on expenses for insert
  with check (user_id = auth.uid());

create policy "Users can update their own expenses"
  on expenses for update
  using (user_id = auth.uid());

create policy "Users can delete their own expenses"
  on expenses for delete
  using (user_id = auth.uid());