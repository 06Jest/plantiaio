"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function userClient() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

const noteContent = (formData: FormData) => {
  const content = String(formData.get("content") ?? "").trim();

  if (!content || content.length > 10000) {
    throw new Error(
      "A note must be between 1 and 10,000 characters.",
    );
  }

  return content;
};

export async function createNote(
  plantId: string,
  formData: FormData,
) {
  const { supabase, user } = await userClient();
  const content = noteContent(formData);

  const { data: plant } = await supabase
    .from("plants")
    .select("id")
    .eq("id", plantId)
    .eq("owner_id", user.id)
    .single();

  if (!plant) {
    throw new Error("Plant not found.");
  }

  const { error } = await supabase.from("notes").insert({
    plant_id: plantId,
    owner_id: user.id,
    original_content: content,
    current_content: content,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/plants/${plantId}/notes`);
}

export async function updateNote(
  plantId: string,
  noteId: string,
  formData: FormData,
) {
  const { supabase, user } = await userClient();
  const content = noteContent(formData);

  const { error } = await supabase
    .from("notes")
    .update({
      current_content: content,
    })
    .eq("id", noteId)
    .eq("plant_id", plantId)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/plants/${plantId}/notes`);
}

export async function deleteNote(
  plantId: string,
  noteId: string,
) {
  const { supabase, user } = await userClient();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("plant_id", plantId)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/plants/${plantId}/notes`);
}

export async function publishNote(
  plantId: string,
  noteId: string,
) {
  const { supabase, user } = await userClient();

  const [{ data: note }, { data: plant }] = await Promise.all([
    supabase
      .from("notes")
      .select("id, current_content")
      .eq("id", noteId)
      .eq("plant_id", plantId)
      .eq("owner_id", user.id)
      .single(),

    supabase
      .from("plants")
      .select("id, name, status")
      .eq("id", plantId)
      .eq("owner_id", user.id)
      .single(),
  ]);

  if (!note || !plant) {
    throw new Error("Note or plant not found.");
  }

  const { error } = await supabase.from("posts").insert({
    owner_id: user.id,
    note_id: note.id,
    plant_id: plant.id,
    content: note.current_content,
    plant_name: plant.name,
    plant_status: plant.status,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/plants/${plantId}/notes`);
  revalidatePath("/feed");
}