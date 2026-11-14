"use server";

import { revalidatePath } from "next/cache";

export async function purgeEdgeProfileCache(username: string) {
  const cleanUser = username.toLowerCase().trim();

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
