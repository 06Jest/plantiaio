"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const pathWithMessage = (path: string, message: string) => `${path}?message=${encodeURIComponent(message)}`;

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect(pathWithMessage("/login", "Email and password are required."));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(pathWithMessage("/login", error.message));
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 8) redirect(pathWithMessage("/signup", "Use an email and a password of at least 8 characters."));
  const supabase = await createClient();
  const origin = String(formData.get("origin") ?? "");
  const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/auth/confirm` } });
  if (error) redirect(pathWithMessage("/signup", error.message));
  redirect(pathWithMessage("/login", "Check your email to confirm your account before logging in."));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
