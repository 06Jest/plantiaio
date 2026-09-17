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
    .select("id, name, species, status, planted_on, description")
    .eq("id", plantId)
    .eq("owner_id", user.id)
    .single();

  if (!plant) {
    throw new Error("Plant not found.");
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  const { data: createdNote, error: insertError } = await supabase
    .from("notes")
    .insert({
      plant_id: plantId,
      owner_id: user.id,
      original_content: content,
      current_content: content,
    })
    .select("id")
    .single();

  if (insertError || !createdNote) {
    throw new Error(insertError?.message ?? "Unable to create note.");
  }

  let aiAnalysis: string | null = null;

  if (accessToken) {
    try {
      const aiServiceUrl =
        process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? "http://localhost:8000";

      const aiResponse = await fetch(`${aiServiceUrl}/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          plant_id: plantId,
          message: `
Analyze this plant-care journal note.

Plant:
- Name: ${plant.name}
- Species: ${plant.species ?? "Unknown"}
- Current status: ${plant.status}
- Planted on: ${plant.planted_on ?? "Unknown"}
- Description: ${plant.description ?? "None"}

User note:
${content}

Return a concise, useful care insight. Mention any detected care activity,
important observation, possible concern, or practical follow-up. Do not invent
facts that are not present in the plant details or note. If there is not
enough information for a specific recommendation, say so briefly.
          `.trim(),
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (aiResponse.ok) {
        const aiResult = (await aiResponse.json()) as {
          answer?: unknown;
        };

        if (
          typeof aiResult.answer === "string" &&
          aiResult.answer.trim().length > 0
        ) {
          aiAnalysis = aiResult.answer.trim();
        }
      }
    } catch (error) {
      console.error("Note AI analysis failed:", error);
    }
  }

  if (aiAnalysis) {
    const { error: analysisError } = await supabase
      .from("notes")
      .update({
        ai_analysis: aiAnalysis,
      })
      .eq("id", createdNote.id)
      .eq("plant_id", plantId)
      .eq("owner_id", user.id);

    if (analysisError) {
      console.error("Unable to save note AI analysis:", analysisError);
    }
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