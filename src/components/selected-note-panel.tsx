"use client";

import { useId, useState } from "react";
import { formatNoteDate, getNoteTitle, wasNoteEdited, wasNoteRecentlyUpdated } from "./note-text";
import type { NoteWithActions } from "./types"

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

/**
 * Renders one note at a time. Mount with `key={note.id}` from the parent so
 * edit/preview/confirm state resets cleanly when the selection changes.
 */
export function SelectedNotePanel({ note }: { note: NoteWithActions }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [confirmingPublish, setConfirmingPublish] = useState(false);
  const originalPanelId = useId();

  const edited = wasNoteEdited(note.originalContent, note.currentContent);
  const wasUpdated = wasNoteRecentlyUpdated(note.createdAt, note.updatedAt);
  const title = getNoteTitle(note.currentContent);

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
      {/* Header */}
      <header className="border-b border-stone-100 pb-4">
        <h1 className="text-xl font-semibold leading-snug text-stone-900 md:text-2xl">{title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
          <span>Created {formatNoteDate(note.createdAt)}</span>
          {wasUpdated && (
            <>
              <span aria-hidden="true">·</span>
              <span>Updated {formatNoteDate(note.updatedAt)}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>Private note</span>
        </div>
      </header>

      {/* Body: read view or edit view */}
      {isEditing ? (
        <form
          action={(formData) => {
            note.updateAction(formData);
            setIsEditing(false);
          }}
          className="mt-5"
        >
          <label htmlFor={`content-${originalPanelId}`} className="sr-only">
            Edit note content
          </label>
          <textarea
            id={`content-${originalPanelId}`}
            name="content"
            defaultValue={note.currentContent}
            maxLength={10000}
            required
            className="min-h-[16rem] w-full rounded-lg border border-stone-300 p-4 text-[15px] leading-7 text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
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
       <p className="mt-5 min-h-[450px] max-w-prose whitespace-pre-wrap break-words text-[15px] leading-8 text-stone-800">
        {note.currentContent}
      </p>
      )}

      {/* Original version, collapsed by default */}
      {edited && (
        <div className="mt-5">
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
              <p className="text-xs font-medium text-stone-400">Original version · preserved, read-only</p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-stone-600">{note.originalContent}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-5">
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
                  note.publishAction(formData);
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

          {note.aiAnalysis && (
            <section className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-800">
                  AI care insight
                </span>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-600">
                {note.aiAnalysis}
              </p>
            </section>
          )}

          <form
            action={note.deleteAction}
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