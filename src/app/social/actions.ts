"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { PLANT_CATEGORIES, isOneOf } from "@/lib/plants";

async function clientUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await clientUser();

  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();

  const displayName = String(
    formData.get("display_name") ?? "",
  ).trim();

  const bio = String(formData.get("bio") ?? "").trim();

  const interests = formData.getAll("interests").map(String);

  const isValidProfile =
    /^[a-z0-9_]{3,30}$/.test(username) &&
    displayName.length <= 80 &&
    bio.length <= 500 &&
    interests.every((interest) =>
      isOneOf(interest, PLANT_CATEGORIES),
    );

  if (!isValidProfile) {
    throw new Error("Please use a valid username and profile details.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      display_name: displayName || null,
      bio: bio || null,
      interests,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/u/${username}`);
}

export async function toggleReaction(postId: string) {
  const { supabase, user } = await clientUser();

  const { data: reaction } = await supabase
    .from("post_reactions")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = reaction
    ? await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
    : await supabase.from("post_reactions").insert({
        post_id: postId,
        user_id: user.id,
      });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/feed");
}

export async function addComment(
  postId: string,
  formData: FormData,
) {
  const { supabase, user } = await clientUser();

  const content = String(formData.get("content") ?? "").trim();

  if (!content || content.length > 2000) {
    throw new Error(
      "A comment must be between 1 and 2,000 characters.",
    );
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/feed");
}