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
