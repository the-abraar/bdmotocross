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
