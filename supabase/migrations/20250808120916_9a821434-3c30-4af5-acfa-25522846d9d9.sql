-- Create profiles table for user information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  age int check (age >= 13),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Basic RLS policies for profiles
create policy if not exists "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy if not exists "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy if not exists "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy if not exists "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- Timestamp update trigger function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for profiles updated_at
create trigger if not exists update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- Groups for activity-based chats
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text,
  activity_type text not null,
  params jsonb not null default '{}'::jsonb,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  max_size int not null default 5,
  is_open boolean not null default true
);

alter table public.groups enable row level security;

-- Group members table
create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

alter table public.group_members enable row level security;

-- Messages table for group chat
create table if not exists public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.group_messages enable row level security;

-- Helpful indexes
create index if not exists idx_groups_is_open on public.groups (is_open);
create index if not exists idx_group_members_group on public.group_members (group_id);
create index if not exists idx_group_members_user on public.group_members (user_id);
create index if not exists idx_group_messages_group on public.group_messages (group_id);
create index if not exists idx_group_messages_created_at on public.group_messages (created_at);

-- Helper function for RLS to check membership
create or replace function public.is_group_member(uid uuid, gid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.group_members gm
    where gm.user_id = uid and gm.group_id = gid
  );
$$;

-- RLS policies for groups
create policy if not exists "Select open groups or groups I belong to"
  on public.groups for select to authenticated
  using (
    is_open = true or public.is_group_member(auth.uid(), id)
  );

create policy if not exists "Create group as self"
  on public.groups for insert to authenticated
  with check (created_by = auth.uid());

create policy if not exists "Owner can update group"
  on public.groups for update to authenticated
  using (created_by = auth.uid());

create policy if not exists "Owner can delete group"
  on public.groups for delete to authenticated
  using (created_by = auth.uid());

-- RLS policies for group_members
create policy if not exists "View memberships for my groups"
  on public.group_members for select to authenticated
  using (
    public.is_group_member(auth.uid(), group_id) or user_id = auth.uid()
  );

create policy if not exists "Join group as self"
  on public.group_members for insert to authenticated
  with check (user_id = auth.uid());

create policy if not exists "Leave group as self"
  on public.group_members for delete to authenticated
  using (user_id = auth.uid());

-- RLS policies for group_messages
create policy if not exists "Read messages from my groups"
  on public.group_messages for select to authenticated
  using (public.is_group_member(auth.uid(), group_id));

create policy if not exists "Send messages to my groups"
  on public.group_messages for insert to authenticated
  with check (
    user_id = auth.uid() and public.is_group_member(auth.uid(), group_id)
  );

create policy if not exists "Delete my own messages"
  on public.group_messages for delete to authenticated
  using (user_id = auth.uid());
