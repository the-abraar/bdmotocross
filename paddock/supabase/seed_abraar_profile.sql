-- =====================================================================
-- SEED SCRIPT: ABRAAR'S PERSONAL PADDOCK PROFILE
-- =====================================================================
-- Run this in your Supabase Dashboard > SQL Editor to create your
-- personal Executive & Rider account on BMCA Paddock.
--
-- Credentials:
--   Username: abraar
--   Email:    the.abraar.rar@gmail.com (or abraar@members.bdmotocross.com)
--   Password: BMCA_Racing_2026! (change anytime at /settings)
--   Profile:  https://paddock.bdmotocross.com/u/abraar
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  abraar_id UUID := gen_random_uuid();
BEGIN
  -- 1. Create auth user with executive authority
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'the.abraar.rar@gmail.com' OR email = 'abraar@members.bdmotocross.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      abraar_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'the.abraar.rar@gmail.com', crypt('BMCA_Racing_2026!', gen_salt('bf')), now(),
      '{"provider": "email", "providers": ["email"], "role": "exec"}'::jsonb,
      '{"username": "abraar", "full_name": "Abraar"}'::jsonb,
      now(), now()
    );

    -- 2. Configure personal profile attributes
    UPDATE public.profiles
    SET secondary_role = 'rider',
        racing_number = '#01',
        bike_model = 'Hero XPulse 200 4V Pro',
        bio = 'Software architect & moto-tech builder behind ThrottleIQ and BMCA digital platforms. Dual-sport trail & endurance rider on an XPulse 200 4V.',
        must_change_password = false
    WHERE id = abraar_id;

    -- 3. Initial inaugural welcome post to the paddock feed
    INSERT INTO public.posts (id, author_id, content, media_type, media_url, created_at)
    VALUES (
      gen_random_uuid(),
      abraar_id,
      'BMCA Paddock and real-time telemetry infrastructure are officially live! 🏁 Built to give Bangladesh riders grassroots racecraft analytics, secure profiles, and track community. Ride safe and train hard.',
      'none',
      '',
      now()
    );
  END IF;
END $$;
