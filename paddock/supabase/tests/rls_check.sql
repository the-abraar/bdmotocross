-- Self-check for role assignment, protected fields and WhatsApp privacy.
-- Run against a LOCAL database after `supabase db reset`:
--   docker exec -i supabase_db_<project_id> psql -U postgres -v ON_ERROR_STOP=1 < supabase/tests/rls_check.sql
-- Everything runs in one transaction and is rolled back. Any failed check raises.
BEGIN;

-- Two members. A tries to self-assign exec through user_metadata; B gets exec via app_metadata.
INSERT INTO auth.users (id, instance_id, aud, role, email, raw_user_meta_data, raw_app_meta_data)
VALUES
  ('00000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'a@test.local', '{"username":"rider_a","full_name":"A","role":"exec"}', '{}'),
  ('00000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'b@test.local', '{"username":"rider_b","full_name":"B"}', '{"role":"exec"}');

DO $$ BEGIN
  ASSERT (SELECT role FROM public.profiles WHERE username = 'rider_a') = 'rider', 'user_metadata role must be ignored';
  ASSERT (SELECT role FROM public.profiles WHERE username = 'rider_b') = 'exec', 'app_metadata role must apply';
END $$;

-- As member A.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}', true);

DO $$ BEGIN
  BEGIN
    UPDATE public.profiles SET role = 'exec' WHERE id = auth.uid();
    RAISE EXCEPTION 'FAIL: member changed own role';
  EXCEPTION WHEN insufficient_privilege OR raise_exception THEN
    IF SQLERRM LIKE 'FAIL:%' THEN RAISE; END IF;
  END;
  BEGIN
    INSERT INTO public.profile_contacts (profile_id, whatsapp_number)
    VALUES ('00000000-0000-0000-0000-00000000000b', '+8801700000000');
    RAISE EXCEPTION 'FAIL: member wrote another member''s contact';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END $$;

INSERT INTO public.profile_contacts (profile_id, whatsapp_number) VALUES (auth.uid(), '+8801711111111');
DO $$ BEGIN
  ASSERT (SELECT count(*) FROM public.profile_contacts) = 1, 'owner must see own private number';
END $$;

-- As member B: A's private number is hidden and can't be changed.
SELECT set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}', true);
DO $$ DECLARE n int; BEGIN
  ASSERT (SELECT count(*) FROM public.profile_contacts) = 0, 'private number visible to another member';
  UPDATE public.profile_contacts SET whatsapp_public = true WHERE profile_id = '00000000-0000-0000-0000-00000000000a';
  GET DIAGNOSTICS n = ROW_COUNT;
  ASSERT n = 0, 'member flipped another member''s visibility';
END $$;

-- As anon: hidden while private.
RESET ROLE;
SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claims', '{"role":"anon"}', true);
DO $$ BEGIN
  ASSERT (SELECT count(*) FROM public.profile_contacts) = 0, 'private number visible to anon';
END $$;

-- A opts in: now public.
RESET ROLE;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}', true);
UPDATE public.profile_contacts SET whatsapp_public = true WHERE profile_id = auth.uid();
RESET ROLE;
SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claims', '{"role":"anon"}', true);
DO $$ BEGIN
  ASSERT (SELECT whatsapp_number FROM public.profile_contacts) = '+8801711111111', 'opted-in number not public';
END $$;

RESET ROLE;
SELECT 'rls_check: all passed' AS result;
ROLLBACK;
