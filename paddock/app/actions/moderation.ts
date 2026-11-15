"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Supabase RLS enforces auth.uid() = author_id OR public.is_club_exec()
  const { data, error } = await supabase.from("posts").delete().eq("id", postId).select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("Not found or not permitted.");

  revalidatePath("/feed");
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase.from("comments").delete().eq("id", commentId).select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("Not found or not permitted.");

  return { success: true };
}
