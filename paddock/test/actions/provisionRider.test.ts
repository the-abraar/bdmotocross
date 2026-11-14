import { describe, it, expect, vi, beforeEach } from "vitest";
import { provisionRiderAccount } from "@/app/actions/provisionRider";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const { mockGetUser, mockSingle, mockCreateUser } = vi.hoisted(() => {
  const mockGetUser = vi.fn();
  const mockSingle = vi.fn();
  const mockCreateUser = vi.fn();
  return { mockGetUser, mockSingle, mockCreateUser };
});

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: { getUser: mockGetUser },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: mockSingle,
          })),
        })),
      })),
    })
  ),
}));

vi.mock("@/utils/supabase/admin", () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        createUser: mockCreateUser,
      },
    },
  },
}));

describe("provisionRiderAccount Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC-SA-01: throws Unauthorized when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const formData = new FormData();
    formData.append("username", "cadet_shuvo");
    formData.append("fullName", "Shuvo");
    formData.append("role", "cadet");
    formData.append("tempPassword", "TempPass123!");

    await expect(provisionRiderAccount(formData)).rejects.toThrow(/Unauthorized/);
  });

  it("TC-SA-02: throws Forbidden when caller is not an executive", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-123" } } });
    mockSingle.mockResolvedValue({ data: { role: "rider", secondary_role: null } });

    const formData = new FormData();
    formData.append("username", "cadet_shuvo");
    formData.append("fullName", "Shuvo");
    formData.append("role", "cadet");
    formData.append("tempPassword", "TempPass123!");

    await expect(provisionRiderAccount(formData)).rejects.toThrow(/Forbidden: Executive authority required/);
  });

  it("TC-SA-03: throws error when username format is invalid", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "exec-123" } } });
    mockSingle.mockResolvedValue({ data: { role: "exec", secondary_role: null } });

    const formData = new FormData();
    formData.append("username", "bad-username!");
    formData.append("fullName", "Shuvo");
    formData.append("role", "cadet");
    formData.append("tempPassword", "TempPass123!");

    await expect(provisionRiderAccount(formData)).rejects.toThrow(/Invalid username/);
  });

  it("TC-SA-04: successfully provisions a rider account when called by exec", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "exec-123" } } });
    mockSingle.mockResolvedValue({ data: { role: "exec", secondary_role: null } });
    mockCreateUser.mockResolvedValue({
      data: { user: { id: "new-user-456" } },
      error: null,
    });

    const formData = new FormData();
    formData.append("username", "test_rider");
    formData.append("fullName", "Test Cadet");
    formData.append("role", "cadet");
    formData.append("tempPassword", "TempPass123!");

    const result = await provisionRiderAccount(formData);

    expect(result).toEqual({
      success: true,
      username: "test_rider",
      tempPassword: "TempPass123!",
    });

    expect(mockCreateUser).toHaveBeenCalledWith({
      email: "test_rider@members.bdmotocross.com",
      password: "TempPass123!",
      email_confirm: true,
      user_metadata: {
        username: "test_rider",
        full_name: "Test Cadet",
        role: "cadet",
      },
    });
  });
});
