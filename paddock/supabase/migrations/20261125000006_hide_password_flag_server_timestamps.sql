-- Closes two holes found by supabase/tests/rls.test.sql. New migration so applied
-- databases pick it up. Deploy the app first: it no longer reads the hidden column.

-- 1. Who is still on a temporary password was public. profiles is world-readable and
--    RLS filters rows, not columns; with public usernames that is a target list for
--    guessing temp passwords. Hide the column from API roles...
REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, username, full_name, role, secondary_role, racing_number, bike_model,
              bio, avatar_url, banner_url, created_at, updated_at)
  ON public.profiles TO anon, authenticated;

--    ...and stop is_active_member() answering about other people: exposed as an RPC,
--    it took any id. Every policy passes auth.uid(), so policies behave the same.
CREATE OR REPLACE FUNCTION public.is_active_member(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND id = auth.uid() AND must_change_password = FALSE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

-- 2. created_at was client-settable on posts and comments, so a 2099 date pinned a
--    post atop the feed. The server sets it.
CREATE OR REPLACE FUNCTION public.set_created_at_now()
RETURNS trigger AS $$
BEGIN
  NEW.created_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

CREATE TRIGGER trg_posts_created_at_now
  BEFORE INSERT ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.set_created_at_now();

CREATE TRIGGER trg_comments_created_at_now
  BEFORE INSERT ON public.comments
  FOR EACH ROW EXECUTE PROCEDURE public.set_created_at_now();
