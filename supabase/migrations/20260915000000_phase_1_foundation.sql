-- Phase 1 foundation. Run with `supabase db push` after linking your project.
create extension if not exists "pgcrypto";

create type public.plant_category as enum ('vegetable', 'fruit', 'flower', 'herb', 'indoor', 'other');
create type public.plant_status as enum ('growing', 'healthy', 'needs_water', 'sick', 'pest_infestation', 'damaged', 'sunburned', 'dormant');
create type public.care_activity_type as enum ('watering', 'feeding', 'pruning', 'repotting', 'pest_treatment', 'other');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique check (username is null or username ~ '^[a-z0-9_]{3,30}$'),
  display_name text check (char_length(display_name) <= 80),
  avatar_url text,
  bio text check (char_length(bio) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  name text not null check (char_length(trim(name)) between 1 and 100),
  species text check (char_length(species) <= 150),
  category public.plant_category not null default 'other',
  planted_on date,
  description text check (char_length(description) <= 5000),
  status public.plant_status not null default 'growing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.care_records (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  activity_type public.care_activity_type not null,
  details text check (char_length(details) <= 5000),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  original_content text not null check (char_length(trim(original_content)) between 1 and 10000),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index plants_owner_id_idx on public.plants(owner_id);
create index care_records_plant_occurred_at_idx on public.care_records(plant_id, occurred_at desc);
create index care_records_owner_id_idx on public.care_records(owner_id);
create index notes_plant_id_idx on public.notes(plant_id);
create index notes_owner_id_idx on public.notes(owner_id);

create function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger plants_updated_at before update on public.plants for each row execute function public.set_updated_at();
create trigger notes_updated_at before update on public.notes for each row execute function public.set_updated_at();

-- Create the owner profile atomically as each auth user is created.
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id) values (new.id); return new; end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- This cross-table check prevents a caller from attaching care or notes to someone else's plant.
create function public.owns_plant(target_plant_id uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.plants where id = target_plant_id and owner_id = auth.uid());
$$;

alter table public.profiles enable row level security;
alter table public.plants enable row level security;
alter table public.care_records enable row level security;
alter table public.notes enable row level security;

create policy "users read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "users read own plants" on public.plants for select to authenticated using (owner_id = auth.uid());
create policy "users create own plants" on public.plants for insert to authenticated with check (owner_id = auth.uid());
create policy "users update own plants" on public.plants for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "users delete own plants" on public.plants for delete to authenticated using (owner_id = auth.uid());
create policy "users read own care" on public.care_records for select to authenticated using (owner_id = auth.uid());
create policy "users create care for own plant" on public.care_records for insert to authenticated with check (owner_id = auth.uid() and public.owns_plant(plant_id));
create policy "users update own care" on public.care_records for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid() and public.owns_plant(plant_id));
create policy "users delete own care" on public.care_records for delete to authenticated using (owner_id = auth.uid());
create policy "users read own notes" on public.notes for select to authenticated using (owner_id = auth.uid());
create policy "users create notes for own plant" on public.notes for insert to authenticated with check (owner_id = auth.uid() and public.owns_plant(plant_id));
create policy "users update own notes" on public.notes for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid() and public.owns_plant(plant_id));
create policy "users delete own notes" on public.notes for delete to authenticated using (owner_id = auth.uid());

-- No service-role key is used in the browser. RLS is the final authorization boundary.
grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.plants, public.care_records, public.notes to authenticated;
