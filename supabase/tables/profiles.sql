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