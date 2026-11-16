-- =====================================================================
-- BMCA PADDOCK DEMO CREDENTIALS & CORE ROSTER SEED SCRIPT
-- =====================================================================
-- Run this script in the Supabase Dashboard > SQL Editor to seed
-- initial official accounts for BMCA leadership and riders.
--
-- Password for all accounts: BMCA_Racing_2026!
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  mr99_id UUID := gen_random_uuid();
  bulbul_id UUID := gen_random_uuid();
  sharif_id UUID := gen_random_uuid();
  cadet_id UUID := gen_random_uuid();
BEGIN
  -- 1. Md. Mahabubur Rahman Hafiz (MR99) - Executive & Pro Track Champion
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mr99@members.bdmotocross.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      mr99_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'mr99@members.bdmotocross.com', crypt('BMCA_Racing_2026!', gen_salt('bf')), now(),
      '{"provider": "email", "providers": ["email"], "role": "exec"}'::jsonb,
      '{"username": "mr99", "full_name": "Md. Mahabubur Rahman Hafiz"}'::jsonb,
      now(), now()
    );

    UPDATE public.profiles
    SET secondary_role = 'pro_racer',
        racing_number = 'MR99',
        bike_model = 'Honda CRF450R',
        bio = 'Director & Pro Track Champion at Bangladesh Motocross Club & Academy.',
        must_change_password = false
    WHERE id = mr99_id;
  END IF;

  -- 2. Salauddin Ahmed Bulbul (Baundal Bulbul #07) - Certified Mentor
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'baundal_bulbul@members.bdmotocross.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      bulbul_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'baundal_bulbul@members.bdmotocross.com', crypt('BMCA_Racing_2026!', gen_salt('bf')), now(),
      '{"provider": "email", "providers": ["email"], "role": "mentor"}'::jsonb,
      '{"username": "baundal_bulbul", "full_name": "Salauddin Ahmed Bulbul"}'::jsonb,
      now(), now()
    );

    UPDATE public.profiles
    SET racing_number = '#07',
        bike_model = 'Yamaha YZ250F',
        bio = 'Certified Enduro & Motocross Mentor (TWM Academy of Moto Adventure).',
        must_change_password = false
    WHERE id = bulbul_id;
  END IF;

  -- 3. Sharif ON Track (#05) - Pro Track Racer
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sharif_on_track@members.bdmotocross.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      sharif_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'sharif_on_track@members.bdmotocross.com', crypt('BMCA_Racing_2026!', gen_salt('bf')), now(),
      '{"provider": "email", "providers": ["email"], "role": "pro_racer"}'::jsonb,
      '{"username": "sharif_on_track", "full_name": "Sharif ON Track"}'::jsonb,
      now(), now()
    );

    UPDATE public.profiles
    SET racing_number = '#05',
        bike_model = 'Kawasaki KX250',
        bio = 'Pro Category Track Racer at BMCA.',
        must_change_password = false
    WHERE id = sharif_id;
  END IF;

  -- 4. Demo Cadet (Testing Account)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo_cadet@members.bdmotocross.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      cadet_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'demo_cadet@members.bdmotocross.com', crypt('BMCA_Racing_2026!', gen_salt('bf')), now(),
      '{"provider": "email", "providers": ["email"], "role": "cadet"}'::jsonb,
      '{"username": "demo_cadet", "full_name": "BMCA Academy Cadet"}'::jsonb,
      now(), now()
    );

    UPDATE public.profiles
    SET racing_number = '#99C',
        bio = 'Academy cadet rider in Stage 1 training.',
        must_change_password = false
    WHERE id = cadet_id;
  END IF;
END $$;
