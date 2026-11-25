-- RLS / privilege tests for every Paddock table and the paddock-media bucket.
-- Run locally: `supabase start` (applies supabase/migrations), then `npm run test:rls`.
-- One transaction, rolled back. Synthetic users only.
--
-- Actors (tests.id(tag) = 00000000-0000-0000-0000-00000000000<tag>):
--   anon  not logged in
--   a     rider; tried to self-assign exec through user_metadata
--   b     mentor (non-exec role)
--   c     cadet still on the temporary password (inactive)
--   e     exec (role)
--   f     mentor + secondary_role exec
-- A failing test here is a policy hole: each one states the secure behaviour.
begin;
create extension if not exists pgtap with schema extensions;
select plan(78);

create schema tests;
grant usage on schema tests to anon, authenticated, service_role;

create function tests.id(tag text) returns uuid language sql immutable
as $$ select ('00000000-0000-0000-0000-' || lpad(tag, 12, '0'))::uuid $$;

-- Switch DB role and JWT claims, as PostgREST does per request.
create function tests.act_as(db_role text, who text default null, jwt_role text default null) returns void language sql
as $$
  select set_config('role', db_role, true),
         set_config('request.jwt.claims', json_build_object('role', coalesce(jwt_role, db_role), 'sub', tests.id(who))::text, true);
$$;

-- Storage API sets this before deleting; without it a trigger blocks every SQL delete.
select set_config('storage.allow_delete_query', 'true', true);

-- ---------------------------------------------------------------- accounts
-- Profiles come from the on_auth_user_created trigger, the path admin provisioning uses.
insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, raw_app_meta_data) values
  (tests.id('a'), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a@test.local',
   '{"username":"rider_a","full_name":"A","role":"exec"}', '{}'),
  (tests.id('b'), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'b@test.local',
   '{"username":"mentor_b","full_name":"B"}', '{"role":"mentor"}'),
  (tests.id('c'), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'c@test.local',
   '{"username":"cadet_c","full_name":"C"}', '{"role":"cadet"}'),
  (tests.id('e'), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'e@test.local',
   '{"username":"exec_e","full_name":"E"}', '{"role":"exec"}'),
  (tests.id('f'), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'f@test.local',
   '{"username":"mentor_f","full_name":"F"}', '{"role":"mentor"}');

select is((select role::text from public.profiles where id = tests.id('a')), 'rider', 'signup: user_metadata cannot self-assign a role');
select is((select role::text from public.profiles where id = tests.id('e')), 'exec', 'signup: app_metadata role is applied');
select is((select count(*)::int from public.profiles where id::text like '00000000-0000-0000-0000-%' and must_change_password), 5,
  'signup: new accounts start on the temporary password');

-- Everyone but c changes their password.
update auth.users set encrypted_password = 'changed' where id in (tests.id('a'), tests.id('b'), tests.id('e'), tests.id('f'));
select is((select count(*)::int from public.profiles where id in (tests.id('a'), tests.id('b'), tests.id('e'), tests.id('f')) and not must_change_password), 4,
  'signup: changing the password activates the account');

select tests.act_as('service_role');
select lives_ok($$update public.profiles set secondary_role = 'exec' where id = tests.id('f')$$,
  'service_role: can assign roles (admin roster path)');

-- Defence in depth: the trigger blocks API callers even where column rights would allow it.
select tests.act_as('postgres', 'a', 'authenticated');
select throws_ok($$update public.profiles set role = 'exec' where id = tests.id('a')$$, 'P0001', null,
  'trigger: member JWT cannot change role, even with column rights');
select tests.act_as('postgres', null, 'anon');
select throws_ok($$update public.profiles set must_change_password = false where id = tests.id('c')$$, 'P0001', null,
  'trigger: anon JWT cannot change must_change_password, even with column rights');

-- ---------------------------------------------------------------- fixtures
select tests.act_as('postgres');
insert into public.posts (id, author_id, content) values
  (tests.id('a1'), tests.id('a'), 'post by a'),
  (tests.id('b1'), tests.id('b'), 'post by b'),
  (tests.id('b2'), tests.id('b'), 'second post by b');
insert into public.comments (id, post_id, author_id, content) values
  (tests.id('ac'), tests.id('b1'), tests.id('a'), 'a on b'),
  (tests.id('bc'), tests.id('a1'), tests.id('b'), 'b on a');
insert into public.post_mentions (post_id, user_id) values (tests.id('b1'), tests.id('a'));
insert into public.profile_contacts (profile_id, whatsapp_number, whatsapp_public) values
  (tests.id('a'), '+8801700000001', false),
  (tests.id('b'), '+8801700000002', true),
  (tests.id('e'), '+8801700000005', false);
insert into storage.objects (bucket_id, name, owner) values
  ('paddock-media', tests.id('a') || '/avatar.webp', tests.id('a')),
  ('paddock-media', tests.id('b') || '/avatar.webp', tests.id('b'));

-- ---------------------------------------------------------------- anon
select tests.act_as('anon');
select isnt_empty($$select 1 from public.profiles where id = tests.id('a')$$, 'anon: reads profiles');
select isnt_empty($$select 1 from public.posts where id = tests.id('a1')$$, 'anon: reads posts');
select isnt_empty($$select 1 from public.comments where id = tests.id('ac')$$, 'anon: reads comments');
select isnt_empty($$select 1 from public.post_mentions where post_id = tests.id('b1')$$, 'anon: reads mentions');
select results_eq($$select profile_id from public.profile_contacts where profile_id in (tests.id('a'), tests.id('b'), tests.id('e'))$$,
  array[tests.id('b')], 'anon: sees only opted-in WhatsApp numbers');
select throws_ok($$select must_change_password from public.profiles$$, null::char(5), null,
  'anon: cannot see which accounts are still on a temporary password');
select isnt_empty($$select 1 from storage.objects where bucket_id = 'paddock-media'$$, 'anon: reads the public media bucket');

select throws_ok($$insert into public.profiles (id, username, full_name) values (tests.id('d'), 'ghost_d', 'Ghost')$$, '42501', null,
  'anon: cannot create profiles');
select is_empty($$update public.profiles set role = 'exec', must_change_password = false, bio = 'x' returning 1$$,
  'anon: cannot edit profiles');
select is_empty($$delete from public.profiles returning 1$$, 'anon: cannot delete profiles');
select throws_ok($$insert into public.posts (author_id, content) values (tests.id('a'), 'x')$$, '42501', null, 'anon: cannot post');
select is_empty($$delete from public.posts returning 1$$, 'anon: cannot delete posts');
select throws_ok($$insert into public.comments (post_id, author_id, content) values (tests.id('a1'), tests.id('a'), 'x')$$, '42501', null,
  'anon: cannot comment');
select is_empty($$delete from public.comments returning 1$$, 'anon: cannot delete comments');
select throws_ok($$insert into public.post_mentions (post_id, user_id) values (tests.id('a1'), tests.id('c'))$$, '42501', null,
  'anon: cannot add mentions');
select throws_ok($$insert into public.profile_contacts (profile_id, whatsapp_number) values (tests.id('c'), '+8801700000003')$$, '42501', null,
  'anon: cannot add contacts');
select throws_ok($$update public.profile_contacts set whatsapp_public = true$$, '42501', null, 'anon: cannot edit contacts');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('paddock-media', tests.id('a') || '/x.webp')$$, '42501', null,
  'anon: cannot upload media');
select is_empty($$delete from storage.objects where bucket_id = 'paddock-media' returning 1$$, 'anon: cannot delete media');

-- ---------------------------------------------------------------- member a (rider)
select tests.act_as('authenticated', 'a');
-- profiles
select isnt_empty($$update public.profiles set full_name = 'A2', bio = 'hi', racing_number = '7', bike_model = 'KX', avatar_url = '', banner_url = ''
  where id = tests.id('a') returning 1$$, 'member: edits own profile fields');
select throws_ok($$update public.profiles set role = 'exec' where id = tests.id('a')$$, '42501', null, 'member: cannot change own role');
select throws_ok($$update public.profiles set secondary_role = 'exec' where id = tests.id('a')$$, '42501', null,
  'member: cannot change own secondary_role');
select throws_ok($$update public.profiles set username = 'someone_else' where id = tests.id('a')$$, '42501', null,
  'member: cannot change own username');
select is_empty($$update public.profiles set bio = 'hacked' where id = tests.id('b') returning 1$$, 'member: cannot edit another profile');
select is_empty($$delete from public.profiles where id in (tests.id('a'), tests.id('b')) returning 1$$, 'member: cannot delete profiles');
select throws_ok($$insert into public.profiles (id, username, full_name) values (tests.id('d'), 'ghost_d', 'Ghost')$$, '42501', null,
  'member: cannot create profiles');
-- profile_contacts
select results_eq($$select profile_id from public.profile_contacts where profile_id in (tests.id('a'), tests.id('b'), tests.id('e')) order by 1$$,
  array[tests.id('a'), tests.id('b')], 'member: sees own and opted-in numbers, not other private ones');
select isnt_empty($$update public.profile_contacts set whatsapp_number = '+8801700000011' where profile_id = tests.id('a') returning 1$$,
  'member: edits own contact');
select throws_ok($$insert into public.profile_contacts (profile_id, whatsapp_number) values (tests.id('c'), '+8801700000003')$$, '42501', null,
  'member: cannot create another member''s contact');
select is_empty($$update public.profile_contacts set whatsapp_number = '+8801700000099', whatsapp_public = true
  where profile_id in (tests.id('b'), tests.id('e')) returning 1$$, 'member: cannot edit another member''s contact');
select throws_ok($$update public.profile_contacts set profile_id = tests.id('c') where profile_id = tests.id('a')$$, '42501', null,
  'member: cannot move own contact row to another member');
select is_empty($$delete from public.profile_contacts where profile_id in (tests.id('b'), tests.id('e')) returning 1$$,
  'member: cannot delete another member''s contact');
-- posts
select lives_ok($$insert into public.posts (id, author_id, content) values (tests.id('a3'), tests.id('a'), 'mine')$$, 'member: posts as self');
select throws_ok($$insert into public.posts (author_id, content) values (tests.id('b'), 'x')$$, '42501', null,
  'member: cannot post as someone else');
select is_empty($$update public.posts set content = 'edited' where id in (tests.id('a1'), tests.id('b1')) returning 1$$,
  'member: posts are not editable (no UPDATE policy)');
select is_empty($$delete from public.posts where id = tests.id('b1') returning 1$$, 'member: cannot delete another member''s post');
select isnt_empty($$delete from public.posts where id = tests.id('a3') returning 1$$, 'member: deletes own post');
do $$ begin
  insert into public.posts (id, author_id, content, created_at) values (tests.id('a4'), tests.id('a'), 'pinned', '2099-01-01');
exception when insufficient_privilege then null;
end $$;
select ok(not exists (select 1 from public.posts where id = tests.id('a4') and created_at > now() + interval '1 day'),
  'member: cannot future-date a post to pin it atop the feed');
-- comments
select lives_ok($$insert into public.comments (id, post_id, author_id, content) values (tests.id('a5'), tests.id('b1'), tests.id('a'), 'mine')$$,
  'member: comments as self');
select throws_ok($$insert into public.comments (post_id, author_id, content) values (tests.id('b1'), tests.id('b'), 'x')$$, '42501', null,
  'member: cannot comment as someone else');
select is_empty($$update public.comments set content = 'edited' where id in (tests.id('ac'), tests.id('bc')) returning 1$$,
  'member: comments are not editable (no UPDATE policy)');
select is_empty($$delete from public.comments where id = tests.id('bc') returning 1$$,
  'member: cannot delete another member''s comment, even on own post');
select isnt_empty($$delete from public.comments where id = tests.id('ac') returning 1$$, 'member: deletes own comment');
-- post_mentions
select lives_ok($$insert into public.post_mentions (post_id, user_id) values (tests.id('a1'), tests.id('b'))$$, 'member: mentions on own post');
select throws_ok($$insert into public.post_mentions (post_id, user_id) values (tests.id('b1'), tests.id('c'))$$, '42501', null,
  'member: cannot add mentions to someone else''s post');
select is_empty($$delete from public.post_mentions returning 1$$, 'member: cannot delete mentions (no DELETE policy)');
-- storage
select lives_ok($$insert into storage.objects (bucket_id, name, owner) values ('paddock-media', tests.id('a') || '/post.webp', tests.id('a'))$$,
  'member: uploads into own folder');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('paddock-media', tests.id('b') || '/evil.webp')$$, '42501', null,
  'member: cannot upload into another member''s folder');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('paddock-media', 'loose.webp')$$, '42501', null,
  'member: cannot upload outside a user folder');
select is_empty($$update storage.objects set name = tests.id('a') || '/stolen.webp' where name = tests.id('b') || '/avatar.webp' returning 1$$,
  'member: cannot rename another member''s media');
select is_empty($$delete from storage.objects where name = tests.id('b') || '/avatar.webp' returning 1$$,
  'member: cannot delete another member''s media');
select isnt_empty($$delete from storage.objects where name = tests.id('a') || '/avatar.webp' returning 1$$, 'member: deletes own media');

-- ---------------------------------------------------------------- member b (mentor: no extra rights)
select tests.act_as('authenticated', 'b');
select is_empty($$delete from public.posts where id = tests.id('a1') returning 1$$, 'mentor: cannot delete others'' posts');
select is_empty($$delete from public.comments where id = tests.id('a5') returning 1$$, 'mentor: cannot delete others'' comments');
select results_eq($$select profile_id from public.profile_contacts where profile_id in (tests.id('a'), tests.id('b'), tests.id('e'))$$,
  array[tests.id('b')], 'mentor: cannot read private numbers');

-- ---------------------------------------------------------------- member c (inactive: temp password)
select tests.act_as('authenticated', 'c');
select throws_ok($$insert into public.posts (author_id, content) values (tests.id('c'), 'x')$$, '42501', null,
  'inactive: cannot post before changing the temporary password');
select throws_ok($$insert into public.comments (post_id, author_id, content) values (tests.id('b1'), tests.id('c'), 'x')$$, '42501', null,
  'inactive: cannot comment');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('paddock-media', tests.id('c') || '/x.webp')$$, '42501', null,
  'inactive: cannot upload media');
select throws_ok($$update public.profiles set must_change_password = false where id = tests.id('c')$$, '42501', null,
  'inactive: cannot skip the password change');
select isnt_empty($$update public.profiles set bio = 'new here' where id = tests.id('c') returning 1$$, 'inactive: can still edit own profile');

-- ---------------------------------------------------------------- exec e
select tests.act_as('authenticated', 'e');
select isnt_empty($$delete from public.comments where id = tests.id('bc') returning 1$$, 'exec: deletes any comment');
select isnt_empty($$delete from public.posts where id = tests.id('b2') returning 1$$, 'exec: deletes any post');
select throws_ok($$insert into public.posts (author_id, content) values (tests.id('a'), 'x')$$, '42501', null,
  'exec: cannot post as someone else');
select is_empty($$update public.profiles set bio = 'x' where id = tests.id('a') returning 1$$, 'exec: cannot edit another profile');
select throws_ok($$update public.profiles set role = 'exec' where id = tests.id('a')$$, '42501', null,
  'exec: cannot promote members through the API (service role only)');
select throws_ok($$update public.profiles set must_change_password = false where id = tests.id('c')$$, '42501', null,
  'exec: cannot unlock other accounts');
select results_eq($$select profile_id from public.profile_contacts where profile_id in (tests.id('a'), tests.id('b'), tests.id('e')) order by 1$$,
  array[tests.id('b'), tests.id('e')], 'exec: cannot read other members'' private numbers');
select is_empty($$update public.profile_contacts set whatsapp_public = true where profile_id = tests.id('a') returning 1$$,
  'exec: cannot publish another member''s number');
select is_empty($$delete from storage.objects where name = tests.id('b') || '/avatar.webp' returning 1$$,
  'exec: storage delete is own-folder only');

-- ---------------------------------------------------------------- exec via secondary_role f
select tests.act_as('authenticated', 'f');
select isnt_empty($$delete from public.posts where id = tests.id('a1') returning 1$$, 'secondary exec: deletes any post');
select isnt_empty($$delete from public.comments where id = tests.id('a5') returning 1$$, 'secondary exec: deletes any comment');

select * from finish();
rollback;
