-- Optional custom workout cross-device sync. Run in the SAME Supabase project.
create table if not exists public.custom_workout_data (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
alter table public.custom_workout_data enable row level security;
revoke all on public.custom_workout_data from anon;
grant select, insert, update on public.custom_workout_data to authenticated;
drop policy if exists "custom_read_own" on public.custom_workout_data;
create policy "custom_read_own" on public.custom_workout_data for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "custom_insert_own" on public.custom_workout_data;
create policy "custom_insert_own" on public.custom_workout_data for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "custom_update_own" on public.custom_workout_data;
create policy "custom_update_own" on public.custom_workout_data for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
NOTIFY pgrst, 'reload schema';
