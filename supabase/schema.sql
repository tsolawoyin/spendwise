-- ===========================================
-- SpendWise Database Schema
-- Run this in the Supabase SQL Editor
-- ===========================================

-- 1. Profiles (auto-populated on signup via trigger)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (id = auth.uid());

create policy "Users can update their own profile"
  on profiles for update
  using (id = auth.uid());

-- Trigger: auto-create profile row on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

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
