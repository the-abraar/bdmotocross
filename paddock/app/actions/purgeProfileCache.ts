"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { validateUsername } from "@/utils/validation";

export async function purgeEdgeProfileCache(username: string) {
  const cleanUser = String(username ?? "").toLowerCase().trim();
  if (!validateUsername(cleanUser)) throw new Error("Invalid username.");

  // Server actions are public endpoints: only the profile's owner may trigger a purge.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: owner } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", cleanUser)
    .eq("id", user.id)
    .maybeSingle();
  if (!owner) throw new Error("Forbidden");

  // 1. Invalidate Next.js internal ISR cache
  revalidatePath(`/u/${cleanUser}`);

  // 2. Invalidate Cloudflare Edge CDN Cache
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "paddock.bdmotocross.com";
  const url = `https://${appDomain}/u/${cleanUser}`;

  if (!zoneId || !apiToken) return;

  try {
    await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ files: [url] }),
    });
  } catch (error) {
    console.error("Cloudflare purge error:", error);
  }
}
