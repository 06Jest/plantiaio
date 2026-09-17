"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CARE_ACTIVITIES, isOneOf, PLANT_CATEGORIES, PLANT_STATUSES } from "@/lib/plants";

function readText(formData: FormData, key: string, max: number, required = false) {
  const value = String(formData.get(key) ?? "").trim();
  if (required && !value) throw new Error(`${key} is required.`);
  if (value.length > max) throw new Error(`${key} is too long.`);
  return value || null;
}

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function ownedPlant(id: string) {
  const { supabase, user } = await currentUser();
  const { data, error } = await supabase.from("plants").select("id").eq("id", id).eq("owner_id", user.id).single();
  if (error || !data) throw new Error("Plant not found or you do not have permission to change it.");
  return { supabase, user };
}

export async function createPlant(formData: FormData) {
  const { supabase, user } = await currentUser();
  const name = readText(formData, "name", 100, true)!;
  const category = String(formData.get("category") ?? "other");
  const status = String(formData.get("status") ?? "growing");
  if (!isOneOf(category, PLANT_CATEGORIES) || !isOneOf(status, PLANT_STATUSES)) throw new Error("Invalid plant category or status.");
  const { data, error } = await supabase.from("plants").insert({
    owner_id: user.id, name, category, status,
    species: readText(formData, "species", 150), description: readText(formData, "description", 5000),
    planted_on: readText(formData, "planted_on", 10)
  }).select("id").single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  redirect(`/plants/${data.id}`);
}

export async function updatePlant(id: string, formData: FormData) {
  const { supabase } = await ownedPlant(id);
  const name = readText(formData, "name", 100, true)!;
  const category = String(formData.get("category") ?? "other");
  const status = String(formData.get("status") ?? "growing");
  if (!isOneOf(category, PLANT_CATEGORIES) || !isOneOf(status, PLANT_STATUSES)) throw new Error("Invalid plant category or status.");
  const { error } = await supabase.from("plants").update({ name, category, status, species: readText(formData, "species", 150), description: readText(formData, "description", 5000), planted_on: readText(formData, "planted_on", 10) }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard"); revalidatePath(`/plants/${id}`);
  redirect(`/plants/${id}`);
}

export async function deletePlant(id: string) {
  const { supabase } = await ownedPlant(id);
  const { error } = await supabase.from("plants").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createCareRecord(plantId: string, formData: FormData) {
  const { supabase, user } = await ownedPlant(plantId);
  const activityType = String(formData.get("activity_type") ?? "");
  if (!isOneOf(activityType, CARE_ACTIVITIES)) throw new Error("Invalid care activity.");
  const occurredAt = readText(formData, "occurred_at", 40) ?? new Date().toISOString();
  if (Number.isNaN(Date.parse(occurredAt))) throw new Error("Invalid care date.");
  const { error } = await supabase.from("care_records").insert({ owner_id: user.id, plant_id: plantId, activity_type: activityType, details: readText(formData, "details", 5000), occurred_at: occurredAt });
  if (error) throw new Error(error.message);
  revalidatePath(`/plants/${plantId}`);
}

export async function deleteCareRecord(plantId: string, recordId: string) {
  const { supabase, user } = await ownedPlant(plantId);
  const { error } = await supabase.from("care_records").delete().eq("id", recordId).eq("plant_id", plantId).eq("owner_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/plants/${plantId}`);
}
