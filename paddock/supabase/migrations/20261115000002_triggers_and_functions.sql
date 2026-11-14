-- 1. Automated New User Profile Provisioning Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    role,
    must_change_password
  )
  VALUES (
    new.id,
    LOWER(COALESCE(NULLIF(new.raw_user_meta_data->>'username', ''), 'rider_' || SUBSTRING(new.id::text, 1, 8))),
    COALESCE(NULLIF(new.raw_user_meta_data->>'full_name', ''), 'BMCA Member'),
    COALESCE(NULLIF(new.raw_user_meta_data->>'role', '')::user_role, 'rider'::user_role),
    TRUE
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Automated Password Reset Unlocking Trigger
CREATE OR REPLACE FUNCTION public.handle_password_changed()
RETURNS trigger AS $$
BEGIN
  IF (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password) THEN
    UPDATE public.profiles
    SET must_change_password = FALSE
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_password_changed
  AFTER UPDATE OF encrypted_password ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_password_changed();

-- 3. System Fields Protection Trigger
CREATE OR REPLACE FUNCTION public.protect_profile_system_fields()
RETURNS trigger AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role) OR 
     (NEW.secondary_role IS DISTINCT FROM OLD.secondary_role) OR 
     (NEW.must_change_password IS DISTINCT FROM OLD.must_change_password) THEN
    IF (current_setting('request.jwt.claim.role', true) != 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized attempt to modify protected system fields.';
    END IF;
  END IF;
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_protect_profile_system_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.protect_profile_system_fields();

-- 4. Permission Helpers
CREATE OR REPLACE FUNCTION public.is_active_member(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND must_change_password = FALSE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_club_exec(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND (role = 'exec' OR secondary_role = 'exec')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
