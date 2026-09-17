"use client";

import { useId, useState } from "react";

type CommentItem = {
  id: string;
  content: string;
  authorName: string;
};

type PostActionsProps = {
  reactionCount: number;
  hasReacted: boolean;
  comments: CommentItem[];
  isAuthenticated: boolean;
  reactAction: () => Promise<void>;
  commentAction: (formData: FormData) => Promise<void>;
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20s-7-4.35-9.5-8.5C.8 8 2 4.5 5.5 4c2-.3 3.7.8 4.5 2.2C10.8 4.8 12.5 3.7 14.5 4c3.5.5 4.7 4 3 7.5C19 15.65 12 20 12 20z"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
      />
    </svg>
  );
}

export function PostActions({
  reactionCount,
  hasReacted,
  comments,
  isAuthenticated,
  reactAction,
  commentAction,
}: PostActionsProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const commentCount = comments.length;

  const commentLabel = open
    ? "Hide comments"
    : commentCount > 0
      ? `View ${commentCount} comment${commentCount === 1 ? "" : "s"}`
      : isAuthenticated
        ? "Add a comment"
        : "No comments yet";

  return (
    <div className="border-t border-stone-100 px-4 pb-4 pt-3 sm:px-6 sm:pb-6">
      <div className="flex items-center gap-1">
        {isAuthenticated ? (
          <form action={reactAction}>
            <button
              type="submit"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                hasReacted
                  ? "bg-stone-200 text-stone-900"
                  : "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <HeartIcon filled={hasReacted} />
              {reactionCount} like{reactionCount === 1 ? "" : "s"}
            </button>
          </form>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-stone-500">
            <HeartIcon filled={false} />
            {reactionCount} like{reactionCount === 1 ? "" : "s"}
          </span>
        )}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex items-center gap-1.5 rounded-full bg-transparent px-3 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
        >
          <CommentIcon />
          {commentLabel}
        </button>
      </div>

      <div
        id={panelId}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "mt-3 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-3 rounded-xl bg-stone-50 p-3 sm:p-4">
          {commentCount > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-semibold text-stone-900">
                  {comment.authorName}
                </span>
                <p className="mt-0.5 whitespace-pre-wrap break-words leading-6 text-stone-700">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-500">No comments yet.</p>
          )}

          {isAuthenticated && (
            <form action={commentAction} className="flex items-center gap-2 pt-1">
              <input
                name="content"
                maxLength={2000}
                placeholder="Add a comment…"
                required
                className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                Post
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}