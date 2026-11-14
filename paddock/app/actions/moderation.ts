"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Supabase RLS enforces auth.uid() = author_id OR public.is_club_exec()
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw new Error(error.message);

  revalidatePath("/feed");
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) throw new Error(error.message);

  return { success: true };
}
