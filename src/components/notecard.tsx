"use client";

import { useId, useState } from "react";

const fmtDate = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));

function ChevronIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      className={`${className ?? ""} transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type NoteCardProps = {
  originalContent: string;
  currentContent: string;
  createdAt: string;
  updatedAt: string;
  updateAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
  publishAction: (formData: FormData) => void | Promise<void>;
};

export function NoteCard({ originalContent, currentContent, createdAt, updatedAt, updateAction, deleteAction, publishAction }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [confirmingPublish, setConfirmingPublish] = useState(false);
  const originalPanelId = useId();

  const wasEdited = originalContent.trim() !== currentContent.trim();
  const isRecentlyUpdated = new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 60_000;

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-6">
      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
        <span className="font-medium text-stone-600">Plant note</span>
        <span aria-hidden="true">·</span>
        <span>Created {fmtDate(createdAt)}</span>
        {isRecentlyUpdated && (
          <>
            <span aria-hidden="true">·</span>
            <span>Updated {fmtDate(updatedAt)}</span>
          </>
        )}
        <span aria-hidden="true">·</span>
        <span>Private note</span>
      </div>

      {/* Body: read view or edit view */}
      {isEditing ? (
        <form
          action={(formData) => {
            updateAction(formData);
            setIsEditing(false);
          }}
          className="mt-4"
        >
          <label htmlFor={`content-${originalPanelId}`} className="sr-only">
            Edit note content
          </label>
          <textarea
            id={`content-${originalPanelId}`}
            name="content"
            defaultValue={currentContent}
            maxLength={10000}
            required
            className="min-h-32 w-full rounded-lg border border-stone-300 p-3 text-sm leading-6 text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              className="!rounded-lg !bg-stone-800 !px-4 !py-2 text-sm !font-semibold !text-white transition-colors hover:!bg-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
            >
              Save changes
            </button>
           <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="!rounded-lg !border !border-stone-300 !bg-white !px-4 !py-2 text-sm !font-medium !text-stone-700 transition-colors hover:!bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 whitespace-pre-wrap break-words text-[15px] leading-7 text-stone-800">{currentContent}</p>
      )}

      {/* Original version, collapsed by default */}
      {wasEdited && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowOriginal((v) => !v)}
            aria-expanded={showOriginal}
            aria-controls={originalPanelId}
            className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-800"
          >
            <ChevronIcon open={showOriginal} className="h-3.5 w-3.5" />
            {showOriginal ? "Hide original text" : "View original text"}
          </button>
          {showOriginal && (
            <div id={originalPanelId} className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Original version · preserved, read-only</p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-stone-600">{originalContent}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="!rounded-lg !border !border-stone-300 !bg-white !px-3.5 !py-1.5 text-sm !font-medium !text-stone-700 transition-colors hover:!bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
          >
            Edit
          </button>

          {!confirmingPublish ? (
            <button
              type="button"
              onClick={() => setConfirmingPublish(true)}
              className="!rounded-lg !bg-transparent !px-3.5 !py-1.5 text-sm !font-medium !text-stone-500 transition-colors hover:!bg-stone-100 hover:!text-stone-800"
            >
              Publish publicly
            </button>
          ) : (
            <span className="flex flex-wrap items-center gap-2 rounded-lg bg-stone-50 px-3 py-1.5 text-sm text-stone-600">
              Publishing creates a public plant update. Continue?
              <form
                action={(formData) => {
                  publishAction(formData);
                  setConfirmingPublish(false);
                }}
              >
                <button
                  type="submit"
                  className="!rounded-md !bg-stone-800 !px-2.5 !py-1 text-xs !font-semibold !text-white transition-colors hover:!bg-stone-900"
                >
                  Yes, publish
                </button>
              </form>
              <button
                type="button"
                onClick={() => setConfirmingPublish(false)}
                className="!rounded-md !border !border-stone-300 !bg-white !px-2.5 !py-1 text-xs !font-medium !text-stone-700 transition-colors hover:!bg-stone-100"
              >
                Cancel
              </button>
            </span>
          )}

          <form
            action={deleteAction}
            onSubmit={(e) => {
              if (!window.confirm("Delete this note? This can't be undone.")) e.preventDefault();
            }}
            className="ml-auto"
          >
            <button
              type="submit"
              className="!rounded-lg !bg-transparent !px-3.5 !py-1.5 text-sm !font-medium !text-red-700 transition-colors hover:!bg-red-50"
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </article>
  );
}