-- 1. Enums
CREATE TYPE user_role AS ENUM ('exec', 'mentor', 'pro_racer', 'cadet', 'rider');
CREATE TYPE media_type AS ENUM ('none', 'image', 'youtube');

-- 2. Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(32) NOT NULL UNIQUE CHECK (username ~ '^[a-z0-9_]{3,32}$'),
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'rider',
    secondary_role user_role NULL,
    racing_number VARCHAR(10),
    bike_model VARCHAR(100),
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    banner_url TEXT DEFAULT '',
    whatsapp_number VARCHAR(20),
    must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_profiles_role ON public.profiles (role);

-- 3. Posts Table
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 1000),
    media_type media_type NOT NULL DEFAULT 'none',
    media_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_posts_created_at ON public.posts (created_at DESC);
CREATE INDEX idx_posts_author ON public.posts (author_id);

-- 4. Comments Table
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_comments_post_id ON public.comments (post_id, created_at ASC);

-- 5. Post Mentions Table
CREATE TABLE public.post_mentions (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (post_id, user_id)
);

CREATE INDEX idx_mentions_user ON public.post_mentions (user_id);
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
-- 1. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_mentions ENABLE ROW LEVEL SECURITY;

-- 2. Column Grants
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, racing_number, bike_model, bio, avatar_url, banner_url, whatsapp_number)
ON public.profiles TO authenticated;

-- 3. Profiles Policies
CREATE POLICY "Public read access for profiles"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update permitted fields on own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Posts Policies
CREATE POLICY "Public read access for posts"
ON public.posts FOR SELECT USING (true);

CREATE POLICY "Active members can create posts"
ON public.posts FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = author_id 
  AND public.is_active_member(auth.uid())
);

CREATE POLICY "Authors and Admins can delete posts"
ON public.posts FOR DELETE TO authenticated
USING (
  auth.uid() = author_id 
  OR public.is_club_exec(auth.uid())
);

-- 5. Comments Policies
CREATE POLICY "Public read access for comments"
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Active members can post comments"
ON public.comments FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = author_id 
  AND public.is_active_member(auth.uid())
);

CREATE POLICY "Authors and Admins can delete comments"
ON public.comments FOR DELETE TO authenticated
USING (
  auth.uid() = author_id 
  OR public.is_club_exec(auth.uid())
);

-- 6. Mentions Policies
CREATE POLICY "Public read access for mentions"
ON public.post_mentions FOR SELECT USING (true);

CREATE POLICY "Post authors can link mentions"
ON public.post_mentions FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE id = post_id AND author_id = auth.uid()
  )
);

-- 7. Supabase Storage Bucket & RLS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('paddock-media', 'paddock-media', true, 2097152, ARRAY['image/webp', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read for paddock media"
ON storage.objects FOR SELECT USING (bucket_id = 'paddock-media');

CREATE POLICY "Active members can upload paddock media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'paddock-media' 
  AND public.is_active_member(auth.uid())
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authors can delete their uploaded media"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'paddock-media' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
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
-- Members decide whether their WhatsApp number is public.
-- RLS filters rows, not columns, and profiles is world-readable, so the number
-- moves to its own table where a row is visible only to its owner or, once
-- the owner opts in, to everyone. Private by default.

CREATE TABLE public.profile_contacts (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    whatsapp_number VARCHAR(20) CHECK (whatsapp_number ~ '^\+?[0-9][0-9 -]{5,19}$'),
    whatsapp_public BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Existing numbers move over as private: nobody opted in yet.
INSERT INTO public.profile_contacts (profile_id, whatsapp_number)
SELECT id, whatsapp_number FROM public.profiles WHERE whatsapp_number IS NOT NULL;

ALTER TABLE public.profiles DROP COLUMN whatsapp_number;

ALTER TABLE public.profile_contacts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.profile_contacts FROM anon, authenticated;
GRANT SELECT ON public.profile_contacts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profile_contacts TO authenticated;

CREATE POLICY "Contacts visible to owner, or to all once public"
ON public.profile_contacts FOR SELECT
USING (whatsapp_public OR profile_id = auth.uid());

CREATE POLICY "Owner inserts own contact"
ON public.profile_contacts FOR INSERT TO authenticated
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Owner updates own contact"
ON public.profile_contacts FOR UPDATE TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Owner deletes own contact"
ON public.profile_contacts FOR DELETE TO authenticated
USING (profile_id = auth.uid());
