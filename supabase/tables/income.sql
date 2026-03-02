-- 3. Income
create table income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  amount numeric(10,2) not null,
  source text,
  date date not null default current_date,
  created_at timestamptz default now()
);

alter table income enable row level security;

create policy "Users can view their own income"
  on income for select
  using (user_id = auth.uid());

create policy "Users can insert their own income"
  on income for insert
  with check (user_id = auth.uid());

create policy "Users can update their own income"
  on income for update
  using (user_id = auth.uid());

create policy "Users can delete their own income"
  on income for delete
  using (user_id = auth.uid());