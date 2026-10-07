-- =====================================================================
-- Mémoire du CSS : structure de la base de données (Supabase)
-- À copier-coller dans Supabase > SQL Editor > New query > Run
-- =====================================================================

-- 1) Tables
create table if not exists public.inscriptions (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  email      text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 200),
  city       text not null check (city in ('Grand Sfax','Autre région en Tunisie','À l''étranger')),
  consent    boolean not null check (consent = true)
);

create table if not exists public.contributions (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  piece_type  text not null check (length(piece_type) <= 60),
  period      text not null check (length(period) <= 30),
  description text not null check (length(description) between 10 and 2000),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 200),
  consent     boolean not null check (consent = true),
  status      text not null default 'à étudier'
);

create table if not exists public.reservations (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  product     text not null check (length(product) <= 60),
  size        text not null check (size in ('S','M','L','XL','XXL')),
  price_range text not null check (length(price_range) <= 40),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 200)
);

create table if not exists public.socios_clicks (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now()
);

-- 2) Sécurité : personne ne peut LIRE les tables depuis le site.
--    Les visiteurs peuvent seulement AJOUTER une ligne (insert).
alter table public.inscriptions  enable row level security;
alter table public.contributions enable row level security;
alter table public.reservations  enable row level security;
alter table public.socios_clicks enable row level security;

drop policy if exists "ajout public" on public.inscriptions;
drop policy if exists "ajout public" on public.contributions;
drop policy if exists "ajout public" on public.reservations;
drop policy if exists "ajout public" on public.socios_clicks;

create policy "ajout public" on public.inscriptions  for insert to anon with check (true);
create policy "ajout public" on public.contributions for insert to anon with check (true);
create policy "ajout public" on public.reservations  for insert to anon with check (true);
create policy "ajout public" on public.socios_clicks for insert to anon with check (true);

-- 3) Compteurs du pilote : seulement des NOMBRES, jamais les emails.
create or replace function public.get_counts()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'inscriptions',  (select count(*) from public.inscriptions),
    'contributions', (select count(*) from public.contributions),
    'reservations',  (select count(*) from public.reservations),
    'socios',        (select count(*) from public.socios_clicks),
    'diaspora',      (select count(*) from public.inscriptions where city = 'À l''étranger')
  );
$$;

revoke all on function public.get_counts() from public;
grant execute on function public.get_counts() to anon;
