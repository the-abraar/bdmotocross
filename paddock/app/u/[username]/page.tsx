import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { RoleBadge, UserRole } from "@/components/RoleBadge";
import { MentorContactButton } from "@/components/MentorContactButton";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

// Revalidate edge cache every 3600 seconds (1 hour)
export const revalidate = 3600;

// Empty list: no build-time pages, but each profile is cached (ISR) after its first request.
export function generateStaticParams() {
  return [];
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const cleanUser = username.toLowerCase();
  // Cookie-less anon client: reading cookies() would force dynamic rendering and defeat ISR.
  // Profiles and posts are public (RLS "Public read").
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", cleanUser)
    .single();

  if (!profile) notFound();

  // 2. Fetch User's Posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Banner */}
      <div className="h-48 md:h-64 bg-neutral-900 relative">
        {profile.banner_url && (
          <img
            src={profile.banner_url}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-black bg-neutral-800 overflow-hidden flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-neutral-500">
                    {profile.full_name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-wide">{profile.full_name}</h1>
                <p className="text-neutral-400 text-sm">@{profile.username}</p>
                <div className="flex gap-2 mt-2">
                  <RoleBadge role={profile.role as UserRole} />
                  {profile.secondary_role && (
                    <RoleBadge role={profile.secondary_role as UserRole} />
                  )}
                </div>
              </div>
            </div>

            {profile.whatsapp_number && (
              <MentorContactButton
                mentorName={profile.full_name}
                whatsappNumber={profile.whatsapp_number}
              />
            )}
          </div>

          {/* Bio & Bike Specs */}
          <div className="mt-6 pt-6 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Bio
              </h2>
              <p className="text-neutral-300 text-sm">{profile.bio || "Active BMCA Racer."}</p>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Track Machine
              </h2>
              <p className="text-sm font-semibold text-rose-500">
                {profile.bike_model || "Setup Pending"}
              </p>
              {profile.racing_number && (
                <p className="text-xs text-neutral-400 mt-1">Race No: #{profile.racing_number}</p>
              )}
            </div>
          </div>
        </div>

        {/* Posts Timeline */}
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-black italic tracking-wide text-rose-600">
            RACE LOG & POSTS
          </h2>
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4"
              >
                <p className="text-neutral-200">{post.content}</p>

                {post.media_type === "image" && post.media_url && (
                  <img
                    src={post.media_url}
                    alt="Track upload"
                    className="rounded-lg max-h-96 w-full object-cover"
                  />
                )}

                {post.media_type === "youtube" && post.media_url && (
                  <YouTubeEmbed videoId={post.media_url} />
                )}

                <div className="text-xs text-neutral-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-sm">No track updates posted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
