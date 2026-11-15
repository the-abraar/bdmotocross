"use server";

import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { validateUsername } from "@/utils/validation";
import { revalidatePath } from "next/cache";

const ROLES = ["exec", "mentor", "pro_racer", "cadet", "rider"];

export async function provisionRiderAccount(formData: FormData) {
  // 1. Authenticate caller session & enforce executive authority
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: caller } = await supabase
    .from("profiles")
    .select("role, secondary_role")
    .eq("id", user.id)
    .single();

  if (caller?.role !== "exec" && caller?.secondary_role !== "exec") {
    throw new Error("Forbidden: Executive authority required.");
  }

  // 2. Validate and sanitize inputs
  const rawUsername = String(formData.get("username") ?? "").toLowerCase().trim();
  if (!validateUsername(rawUsername)) {
    throw new Error("Invalid username. Use 3-32 lowercase letters, numbers, or underscores.");
  }

  const fullName = (formData.get("fullName") as string)?.trim() || "BMCA Member";
  const role = String(formData.get("role") || "rider");
  if (!ROLES.includes(role)) throw new Error("Invalid role.");
  const tempPassword = formData.get("tempPassword") as string;
  if (!tempPassword || tempPassword.length < 8) {
    throw new Error("Temporary password must be at least 8 characters.");
  }

  const email = `${rawUsername}@members.bdmotocross.com`;

  // 3. Create auth user with service_role privileges
  const { error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { username: rawUsername, full_name: fullName },
    app_metadata: { role }, // server-only; user_metadata is client-writable
  });

  if (authError) throw new Error(authError.message);

  revalidatePath("/admin/roster");
  return { success: true, username: rawUsername, tempPassword };
}
