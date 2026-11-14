import { describe, it, expect, vi, beforeEach } from "vitest";
import { deletePost, deleteComment } from "@/app/actions/moderation";
import { revalidatePath } from "next/cache";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const { mockGetUser, mockDelete, mockEq } = vi.hoisted(() => {
  const mockGetUser = vi.fn();
  const mockDelete = vi.fn();
  const mockEq = vi.fn();
  return { mockGetUser, mockDelete, mockEq };
});

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: { getUser: mockGetUser },
      from: vi.fn(() => ({
        delete: mockDelete.mockReturnValue({
          eq: mockEq,
        }),
      })),
    })
  ),
}));

describe("Moderation Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("deletePost", () => {
    it("throws Unauthorized if user is not logged in", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
      await expect(deletePost("post-1")).rejects.toThrow(/Unauthorized/);
    });

    it("deletes post and revalidates /feed when authorized", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
      mockEq.mockResolvedValue({ error: null });

      const res = await deletePost("post-1");
      expect(res).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith("/feed");
    });
  });

  describe("deleteComment", () => {
    it("throws Unauthorized if user is not logged in", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
      await expect(deleteComment("comment-1")).rejects.toThrow(/Unauthorized/);
    });

    it("deletes comment when authorized", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
      mockEq.mockResolvedValue({ error: null });

      const res = await deleteComment("comment-1");
      expect(res).toEqual({ success: true });
    });
  });
});
