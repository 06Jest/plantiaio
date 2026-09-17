import Link from "next/link";
import { notFound } from "next/navigation";

import { PlantVisual } from "@/components/plant-visual";
import { StatusBadge } from "@/components/status-badge";
import { label } from "@/lib/plants";
import { createClient } from "@/lib/supabase/server";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, interests")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, content, plant_name, plant_status, created_at",
    )
    .eq("owner_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <Link
        className="text-sm text-emerald-700 underline"
        href="/feed"
      >
        ← Community feed
      </Link>

      <header className="mt-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <p className="text-sm text-stone-500">
          @{profile.username}
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          {profile.display_name || profile.username}
        </h1>

        {profile.bio && (
          <p className="mt-3 whitespace-pre-wrap text-stone-700">
            {profile.bio}
          </p>
        )}

        {profile.interests?.length ? (
          <p className="mt-4 text-sm text-stone-500">
            Interests: {profile.interests.map(label).join(", ")}
          </p>
        ) : null}
      </header>

      <h2 className="mt-10 text-2xl font-bold">
        Public updates
      </h2>

      <div className="mt-5 space-y-5">
        {posts?.map((post) => (
          <article
            key={post.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"
          >
            <div className="p-6">
              {post.plant_name && (
                <h3 className="text-xl font-bold">
                  {post.plant_name}
                </h3>
              )}

              {post.plant_status && (
                <div className="mt-2">
                  <StatusBadge status={post.plant_status} />
                </div>
              )}

              <p className="mt-4 whitespace-pre-wrap text-stone-700">
                {post.content}
              </p>
            </div>

            {post.plant_status && (
              <PlantVisual
                status={post.plant_status}
                className="h-44"
              />
            )}
          </article>
        ))}

        {!posts?.length && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-stone-600">
            No public updates yet.
          </div>
        )}
      </div>
    </main>
  );
}