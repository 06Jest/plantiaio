

import Link from "next/link";

import { addComment, toggleReaction } from "@/app/social/actions";
import { formatRelativeTime, getInitials } from "@/app/social/feed-utils";
import { PostActions } from "@/app/social/post-actions";
import { PlantVisual } from "@/components/plant-visual";
import { StatusBadge } from "@/components/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function FeedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, owner_id, content, plant_name, plant_status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(30);

  const ownerIds = [
    ...new Set(posts?.map((post) => post.owner_id) ?? []),
  ];

  const postIds = posts?.map((post) => post.id) ?? [];

  const [
    { data: profiles },
    { data: reactions },
    { data: comments },
  ] = await Promise.all([
    ownerIds.length
      ? supabase
          .from("profiles")
          .select("id, username, display_name")
          .in("id", ownerIds)
      : Promise.resolve({ data: [] }),

    postIds.length
      ? supabase
          .from("post_reactions")
          .select("post_id, user_id")
          .in("post_id", postIds)
      : Promise.resolve({ data: [] }),

    postIds.length
      ? supabase
          .from("comments")
          .select(
            "id, post_id, author_id, content, created_at",
          )
          .in("post_id", postIds)
          .order("created_at")
      : Promise.resolve({ data: [] }),
  ]);

  const people = new Map(
    profiles?.map((profile) => [profile.id, profile]) ?? [],
  );

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-col gap-4 border-b border-stone-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Community
          </p>

          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            Plant updates
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
            Browse public progress and care updates shared by other plant
            owners.
          </p>
        </div>

        <Link
          className="inline-flex w-fit shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
          href={user ? "/dashboard" : "/login"}
        >
          {user ? "Dashboard" : "Log in"}
        </Link>
      </header>

      {posts?.length ? (
        <div className="mt-8 space-y-5">
          {posts.map((post) => {
            const author = people.get(post.owner_id);

            const postReactions =
              reactions?.filter(
                (reaction) => reaction.post_id === post.id,
              ) ?? [];

            const postComments =
              comments?.filter(
                (comment) => comment.post_id === post.id,
              ) ?? [];

            const hasReacted = postReactions.some(
              (reaction) => reaction.user_id === user?.id,
            );

            const commentsForCard = postComments.map((comment) => {
              const commentAuthor = people.get(comment.author_id);

              return {
                id: comment.id,
                content: comment.content,
                authorName:
                  commentAuthor?.display_name ||
                  commentAuthor?.username || "Plant owner"
              };
            });

            return (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold text-stone-700">
                      {getInitials(author?.display_name || author?.username)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm">
                        {author?.username ? (
                          <Link
                            className="font-medium text-stone-900 hover:text-stone-600 hover:underline"
                            href={`/u/${author.username}`}
                          >
                            {author.display_name || author.username}
                          </Link>
                        ) : (
                          <span className="font-medium text-stone-900">
                            A plant owner
                          </span>
                        )}
                      </p>

                      <p className="text-xs text-stone-400">
                        {formatRelativeTime(post.created_at)}
                      </p>
                    </div>
                  </div>

                  {(post.plant_name || post.plant_status) && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {post.plant_name && (
                        <h2 className="break-words text-lg font-semibold text-stone-900">
                          {post.plant_name}
                        </h2>
                      )}

                      {post.plant_status && (
                        <StatusBadge status={post.plant_status} />
                      )}
                    </div>
                  )}

                  <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-stone-700">
                    {post.content}
                  </p>
                </div>

                {post.plant_status && (
                  <div className="border-t border-stone-100">
                    <PlantVisual
                      status={post.plant_status}
                      className="h-56 w-full"
                    />
                  </div>
                )}

                <PostActions
                  reactionCount={postReactions.length}
                  hasReacted={hasReacted}
                  comments={commentsForCard}
                  isAuthenticated={Boolean(user)}
                  reactAction={toggleReaction.bind(null, post.id)}
                  commentAction={addComment.bind(null, post.id)}
                />
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
          <p className="text-base font-medium text-stone-900">
            No public plant updates yet
          </p>

          <p className="mt-1 text-sm text-stone-600">
            Once plant owners start sharing progress, their updates will show
            up here.
          </p>

          {!user && (
            <Link
              className="mt-4 inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
              href="/login"
            >
              Log in to get started
            </Link>
          )}
        </div>
      )}
    </main>
  );
}