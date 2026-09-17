create extension if not exists vector;

create table public.plant_tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  plant_id uuid references public.plants(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 200),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.plant_guides (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.guide_chunks (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.plant_guides(id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  embedding vector(1536),
  unique (guide_id, chunk_index)
);

create index plant_tasks_owner_id_idx on public.plant_tasks(owner_id);
create index guide_chunks_embedding_idx on public.guide_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

alter table public.plant_tasks enable row level security;
alter table public.plant_guides enable row level security;
alter table public.guide_chunks enable row level security;

create policy "owners manage own tasks" on public.plant_tasks for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid() and (plant_id is null or public.owns_plant(plant_id)));
create policy "anyone reads published guides" on public.plant_guides for select to anon, authenticated using (true);
create policy "anyone reads guide chunks" on public.guide_chunks for select to anon, authenticated using (true);
grant select on public.plant_guides, public.guide_chunks to anon, authenticated;
grant select, insert, update, delete on public.plant_tasks to authenticated;

create or replace function public.match_guide_chunks(query_embedding vector(1536), match_count integer default 5)
returns table (guide_id uuid, title text, slug text, content text, similarity double precision)
language sql stable security invoker set search_path = public as $$
  select c.guide_id, g.title, g.slug, c.content, 1 - (c.embedding <=> query_embedding) as similarity
  from public.guide_chunks c join public.plant_guides g on g.id = c.guide_id
  where c.embedding is not null
  order by c.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 10);
$$;

insert into public.plant_guides (slug, title, content) values
('seed-to-sprout', 'From seed to sprout', 'Start with clean containers and a seed-starting mix. Keep medium evenly moist rather than saturated. Provide warmth appropriate to the species and bright light after germination. Increase airflow as seedlings grow to reduce damping-off risk.'),
('watering-basics', 'Watering basics', 'Check moisture near the root zone before watering. Water thoroughly when the plant needs it, then allow the medium to drain. Pot size, light, airflow, soil mix, and season change water needs; avoid a fixed calendar without checking the plant.'),
('light-soil-and-feeding', 'Light, soil, and feeding', 'Match light exposure to the species and acclimate plants gradually to stronger sun. Use a well-draining mix suited to the plant. Fertilize only during active growth and follow product dilution directions. Do not fertilize a severely stressed or dry plant before stabilizing its care.'),
('pests-and-problems', 'Pests and common problems', 'Inspect leaf undersides, stems, and soil surface before diagnosing. Isolate a plant with suspected pests when practical. Look for patterns such as spotting, curling, webbing, scale, or unusual discoloration. Many symptoms have multiple causes, so state uncertainty and gather observations before recommending treatment.')
on conflict (slug) do nothing;
