import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { purgeEdgeProfileCache } from "@/app/actions/purgeProfileCache";
import { revalidatePath } from "next/cache";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("purgeEdgeProfileCache Server Action", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLOUDFLARE_ZONE_ID = "test-zone-123";
    process.env.CLOUDFLARE_API_TOKEN = "test-token-xyz";
    process.env.NEXT_PUBLIC_APP_DOMAIN = "paddock.bdmotocross.com";
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("calls revalidatePath and Cloudflare cache purge API", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    global.fetch = mockFetch;

    await purgeEdgeProfileCache("MR99");

    expect(revalidatePath).toHaveBeenCalledWith("/u/mr99");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.cloudflare.com/client/v4/zones/test-zone-123/purge_cache",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token-xyz",
        },
        body: JSON.stringify({
          files: ["https://paddock.bdmotocross.com/u/mr99"],
        }),
      }
    );
  });

  it("safely handles missing Cloudflare credentials by only calling revalidatePath", async () => {
    delete process.env.CLOUDFLARE_ZONE_ID;
    delete process.env.CLOUDFLARE_API_TOKEN;
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    await purgeEdgeProfileCache("baundal_bulbul");

    expect(revalidatePath).toHaveBeenCalledWith("/u/baundal_bulbul");
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
