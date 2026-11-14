"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { RoleBadge, UserRole } from "@/components/RoleBadge";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

interface PostItem {
  id: string;
  author_id: string;
  content: string;
  media_type: "none" | "image" | "youtube";
  media_url: string;
  created_at: string;
  profiles?: {
    username: string;
    full_name: string;
    role: UserRole;
    avatar_url: string;
  };
}

export default function FeedPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadFeed() {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          author_id,
          content,
          media_type,
          media_url,
          created_at,
          profiles:author_id (
            username,
            full_name,
            role,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setPosts(data as unknown as PostItem[]);
      }
      setLoading(false);
    }

    loadFeed();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        () => {
          loadFeed();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-3xl font-black italic tracking-wider text-rose-600">
              BMCA PADDOCK FEED
            </h1>
            <p className="text-neutral-400 text-sm">Live Trackside Community Stream</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/settings"
              className="px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors font-semibold"
            >
              Settings
            </Link>
            <Link
              href="/admin/roster"
              className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors font-semibold"
            >
              Roster Admin
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-12 text-neutral-500">Loading paddock updates...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-400">
            No track updates posted yet. Check back soon!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4"
              >
                {post.profiles && (
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/u/${post.profiles.username}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-neutral-400 overflow-hidden">
                        {post.profiles.avatar_url ? (
                          <img
                            src={post.profiles.avatar_url}
                            alt={post.profiles.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          post.profiles.full_name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          <span>{post.profiles.full_name}</span>
                          <RoleBadge role={post.profiles.role} />
                        </div>
                        <span className="text-xs text-neutral-400">@{post.profiles.username}</span>
                      </div>
                    </Link>
                    <span className="text-xs text-neutral-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <p className="text-neutral-200 text-sm md:text-base whitespace-pre-line">
                  {post.content}
                </p>

                {post.media_type === "image" && post.media_url && (
                  <img
                    src={post.media_url}
                    alt="Paddock media"
                    className="rounded-xl max-h-96 w-full object-cover"
                  />
                )}

                {post.media_type === "youtube" && post.media_url && (
                  <YouTubeEmbed videoId={post.media_url} />
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
