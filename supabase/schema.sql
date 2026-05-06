-- ============================================================
-- Schema: Amigo Invisible
-- Ejecuta este SQL en el editor de Supabase (SQL Editor)
-- ============================================================

-- Extensiones necesarias
create extension if not exists "pgcrypto";

-- ============================================================
-- Tabla: usuarios
-- ============================================================
create table if not exists public.usuarios (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  telefono    text not null unique,
  creado_en   timestamptz default now()
);

-- ============================================================
-- Tabla: grupos
-- ============================================================
create table if not exists public.grupos (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  organizador_id  uuid not null references public.usuarios(id) on delete cascade,
  fecha_evento    date,
  presupuesto     numeric(10, 2),
  estado          text not null default 'pendiente' check (estado in ('pendiente', 'sorteado')),
  creado_en       timestamptz default now()
);

-- ============================================================
-- Tabla: participantes
-- ============================================================
create table if not exists public.participantes (
  id              uuid primary key default gen_random_uuid(),
  grupo_id        uuid not null references public.grupos(id) on delete cascade,
  usuario_id      uuid not null references public.usuarios(id) on delete cascade,
  asignado_a_id   uuid references public.usuarios(id),
  token_secreto   text unique default encode(gen_random_bytes(32), 'hex'),
  creado_en       timestamptz default now(),
  unique (grupo_id, usuario_id)
);

-- ============================================================
-- Tabla: exclusiones
-- ============================================================
create table if not exists public.exclusiones (
  id                uuid primary key default gen_random_uuid(),
  grupo_id          uuid not null references public.grupos(id) on delete cascade,
  de_usuario_id     uuid not null references public.usuarios(id) on delete cascade,
  a_usuario_id      uuid not null references public.usuarios(id) on delete cascade,
  unique (grupo_id, de_usuario_id, a_usuario_id)
);

-- ============================================================
-- Tabla: items_deseos (wishlist)
-- ============================================================
create table if not exists public.items_deseos (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references public.usuarios(id) on delete cascade,
  grupo_id    uuid not null references public.grupos(id) on delete cascade,
  titulo      text not null,
  url         text,
  notas       text,
  creado_en   timestamptz default now()
);

-- ============================================================
-- Row Level Security: desactivado (usamos service role en el backend)
-- Habilita RLS solo si expones el cliente anon al navegador con lógica propia
-- ============================================================
alter table public.usuarios disable row level security;
alter table public.grupos disable row level security;
alter table public.participantes disable row level security;
alter table public.exclusiones disable row level security;
alter table public.items_deseos disable row level security;

-- ============================================================
-- Índices de rendimiento
-- ============================================================
create index if not exists idx_grupos_organizador on public.grupos(organizador_id);
create index if not exists idx_participantes_grupo on public.participantes(grupo_id);
create index if not exists idx_participantes_usuario on public.participantes(usuario_id);
create index if not exists idx_participantes_token on public.participantes(token_secreto);
create index if not exists idx_exclusiones_grupo on public.exclusiones(grupo_id);
create index if not exists idx_items_deseos_usuario_grupo on public.items_deseos(usuario_id, grupo_id);
