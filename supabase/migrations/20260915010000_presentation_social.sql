-- Consolidated track 2: immutable originals, explicit public posts, and community data.
alter table public.profiles add column if not exists interests text[] not null default '{}';
alter table public.notes add column if not exists current_content text;
update public.notes set current_content = original_content where current_content is null;
alter table public.notes alter column current_content set not null;
alter table public.notes add constraint notes_current_content_length check (char_length(trim(current_content)) between 1 and 10000);

-- Preserve the first user-authored version forever while allowing later edits to current_content.
create function public.protect_original_note() returns trigger language plpgsql security invoker set search_path = public as $$
begin
  if new.original_content is distinct from old.original_content then
    raise exception 'original note content cannot be changed';
  end if;
  return new;
end;
$$;
create trigger notes_original_immutable before update on public.notes for each row execute function public.protect_original_note();

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  plant_id uuid references public.plants(id) on delete set null,
  note_id uuid references public.notes(id) on delete set null,
  content text not null check (char_length(trim(content)) between 1 and 10000),
  plant_name text check (char_length(plant_name) <= 100),
  plant_status public.plant_status,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_note_or_plant check (note_id is not null or plant_id is not null)
);

create table public.post_reactions (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  content text not null check (char_length(trim(content)) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_created_at_idx on public.posts(created_at desc);
create index posts_owner_id_idx on public.posts(owner_id);
create index comments_post_id_idx on public.comments(post_id, created_at);
create trigger posts_updated_at before update on public.posts for each row execute function public.set_updated_at();
create trigger comments_updated_at before update on public.comments for each row execute function public.set_updated_at();

alter table public.posts enable row level security;
alter table public.post_reactions enable row level security;
alter table public.comments enable row level security;

-- Public profile fields have no email or private plant/care/note data.
create policy "public read completed profiles" on public.profiles for select to anon, authenticated using (username is not null);

create policy "anyone reads public posts" on public.posts for select to anon, authenticated using (true);
create policy "owners create posts" on public.posts for insert to authenticated with check (
  owner_id = auth.uid()
  and (plant_id is null or public.owns_plant(plant_id))
  and (note_id is null or exists (select 1 from public.notes where id = note_id and owner_id = auth.uid()))
);
create policy "owners update posts" on public.posts for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners delete posts" on public.posts for delete to authenticated using (owner_id = auth.uid());

create policy "anyone reads reactions" on public.post_reactions for select to anon, authenticated using (true);
create policy "users add own reaction" on public.post_reactions for insert to authenticated with check (user_id = auth.uid());
create policy "users remove own reaction" on public.post_reactions for delete to authenticated using (user_id = auth.uid());

create policy "anyone reads comments" on public.comments for select to anon, authenticated using (true);
create policy "users add own comments" on public.comments for insert to authenticated with check (author_id = auth.uid());
create policy "users update own comments" on public.comments for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "users delete own comments" on public.comments for delete to authenticated using (author_id = auth.uid());

grant select on public.posts, public.post_reactions, public.comments to anon;
grant select, insert, update, delete on public.posts, public.post_reactions, public.comments to authenticated;
