-- Run once in your Supabase project SQL Editor.
-- Private per-user history; public users cannot read anyone else's records.
create table if not exists public.workout_history (
 user_id uuid primary key references auth.users(id) on delete cascade,
 history jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
alter table public.workout_history enable row level security;
revoke all on public.workout_history from anon;
grant select, insert, update on public.workout_history to authenticated;
drop policy if exists "Read only own history" on public.workout_history;
create policy "Read only own history" on public.workout_history for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Insert only own history" on public.workout_history;
create policy "Insert only own history" on public.workout_history for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Update only own history" on public.workout_history;
create policy "Update only own history" on public.workout_history for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
