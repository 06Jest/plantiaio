"use client";

import type { RefObject } from "react";

export function NewNoteComposer({
  action,
  textareaRef,
}: {
  action: (formData: FormData) => void | Promise<void>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-stone-50/60 p-5">
      <h2 className="text-base font-semibold text-stone-900">New note</h2>
      <p className="mt-1 text-xs leading-5 text-stone-500">Private by default - nothing here is shared unless you publish it.</p>
      <form action={action} className="mt-4">
        <label htmlFor="new-note-content" className="sr-only">
          New note content
        </label>
        <textarea
          ref={textareaRef}
          id="new-note-content"
          name="content"
          maxLength={10000}
          required
          placeholder="Write an observation, care decision, growth update, or question…"
          className="min-h-[535px] w-full rounded-lg border border-stone-300 bg-white p-3.5 text-[15px] leading-6 text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
        />
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-xs text-stone-400">Up to 10,000 characters</p>
          <button
            type="submit"
            className="!rounded-lg !bg-stone-800 !px-4 !py-2 text-sm !font-semibold !text-white transition-colors hover:!bg-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
          >
            Save note
          </button>
        </div>
      </form>
    </section>
  );
}