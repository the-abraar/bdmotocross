-- Hardening for 0002/0003 (new migration so already-applied databases pick it up).

-- 1. Pin search_path on every SECURITY DEFINER function (blocks object-shadowing hijacks).
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_password_changed() SET search_path = public, pg_temp;
ALTER FUNCTION public.protect_profile_system_fields() SET search_path = public, pg_temp;
ALTER FUNCTION public.is_active_member(UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_club_exec(UUID) SET search_path = public, pg_temp;

-- 2. Role must come from app_metadata (service-role only). raw_user_meta_data is
--    client-writable (signUp / updateUser), so it let anyone self-assign 'exec'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role, must_change_password)
  VALUES (
    new.id,
    LOWER(COALESCE(NULLIF(new.raw_user_meta_data->>'username', ''), 'rider_' || SUBSTRING(new.id::text, 1, 8))),
    COALESCE(NULLIF(new.raw_user_meta_data->>'full_name', ''), 'BMCA Member'),
    COALESCE(NULLIF(new.raw_app_meta_data->>'role', '')::user_role, 'rider'::user_role),
    TRUE
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. The old check read the legacy GUC request.jwt.claim.role, which current PostgREST
--    no longer sets (NULL != 'service_role' is NULL, so it never raised). auth.role()
--    reads the JWT claims; block only API callers (anon/authenticated). GoTrue's direct
--    connection (password-change trigger) and service_role carry no such role.
CREATE OR REPLACE FUNCTION public.protect_profile_system_fields()
RETURNS trigger AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role) OR
     (NEW.secondary_role IS DISTINCT FROM OLD.secondary_role) OR
     (NEW.must_change_password IS DISTINCT FROM OLD.must_change_password) THEN
    IF auth.role() IN ('anon', 'authenticated') THEN
      RAISE EXCEPTION 'Unauthorized attempt to modify protected system fields.';
    END IF;
  END IF;
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 4. media_url feeds an iframe path / img src: constrain YouTube rows to a bare 11-char ID.
--    NOT VALID: enforced for new/changed rows without failing on any pre-existing data.
ALTER TABLE public.posts
  ADD CONSTRAINT posts_youtube_id_format
  CHECK (media_type <> 'youtube' OR media_url ~ '^[A-Za-z0-9_-]{11}$') NOT VALID;
