"use client";

import { useEffect, useRef, useState } from "react";
import { NewNoteComposer } from "./new-note-composer";
import { NotesSidebar } from "./notes-sidebar";
import { SelectedNotePanel } from "./selected-note-panel";
import type { NoteWithActions } from "./types";

type MobileView = "list" | "note" | "compose";

export function NotesWorkspace({
  plantName,
  notes,
  createNoteAction,
}: {
  plantName: string;
  notes: NoteWithActions[];
  createNoteAction: (formData: FormData) => void | Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id ?? null);
  const [mobileView, setMobileView] = useState<MobileView>(notes[0] ? "note" : "list");
  const prevIdsRef = useRef<string[]>(notes.map((n) => n.id));
  const composerRef = useRef<HTMLTextAreaElement>(null);

  // Keep the selection valid as the server-provided `notes` list changes
  // (a note is created, edited, or deleted elsewhere and the page revalidates).
  useEffect(() => {
    const currentIds = notes.map((n) => n.id);
    const stillExists = selectedId !== null && currentIds.includes(selectedId);

    if (!stillExists) {
      if (notes.length === 0) {
        setSelectedId(null);
      } else {
        const prevIndex = selectedId ? prevIdsRef.current.indexOf(selectedId) : -1;
        const targetIndex = prevIndex >= 0 ? Math.min(prevIndex, notes.length - 1) : 0;
        setSelectedId(notes[targetIndex].id);
      }
    }

    prevIdsRef.current = currentIds;
    // Only re-run when the notes list itself changes; selectedId is read, not depended on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  function handleSelectNote(id: string) {
    setSelectedId(id);
    setMobileView("note");
  }

  function handleFocusComposer() {
    setMobileView("compose");
    requestAnimationFrame(() => composerRef.current?.focus());
  }

  return (
    <div className="mt-8">
      {/* Mobile panel switcher */}
      <div
        role="group"
        aria-label="Switch notes panel"
        className="mb-4 flex gap-1 rounded-lg border border-stone-200 bg-white p-1 md:hidden"
      >
        <button
          type="button"
          aria-pressed={mobileView === "list"}
          onClick={() => setMobileView("list")}
          className={`flex-1 !rounded-md !px-3 !py-1.5 text-sm !font-medium transition-colors ${
            mobileView === "list" ? "!bg-stone-800 !text-white" : "!bg-transparent !text-stone-600 hover:!bg-stone-100"
          }`}
        >
          Notes
        </button>
        <button
          type="button"
          aria-pressed={mobileView === "note"}
          onClick={() => setMobileView("note")}
          disabled={!selectedNote}
          className={`flex-1 !rounded-md !px-3 !py-1.5 text-sm !font-medium transition-colors disabled:opacity-40 ${
            mobileView === "note" ? "!bg-stone-800 !text-white" : "!bg-transparent !text-stone-600 hover:!bg-stone-100"
          }`}
        >
          Note
        </button>
        <button
          type="button"
          aria-pressed={mobileView === "compose"}
          onClick={handleFocusComposer}
          className={`flex-1 !rounded-md !px-3 !py-1.5 text-sm !font-medium transition-colors ${
            mobileView === "compose" ? "!bg-stone-800 !text-white" : "!bg-transparent !text-stone-600 hover:!bg-stone-100"
          }`}
        >
          New
        </button>
      </div>

      <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)_260px] md:items-stretch md:gap-4 lg:grid-cols-[260px_minmax(0,1fr)_320px] lg:gap-6">
        <div
          className={`${mobileView === "list" ? "block" : "hidden"} min-h-[650px] md:sticky md:top-6 md:block`}
        >
          <NotesSidebar
            plantName={plantName}
            notes={notes}
            selectedId={selectedId}
            onSelect={handleSelectNote}
            onNewNote={handleFocusComposer}
          />
        </div>

        <div
          className={`${mobileView === "note" ? "block" : "hidden"} min-h-[650px] md:block`}
        >
          {selectedNote ? (
            <SelectedNotePanel key={selectedNote.id} note={selectedNote} />
          ) : (
            <EmptyNoteState hasNotes={notes.length > 0} />
          )}
        </div>

        <div
          className={`${mobileView === "compose" ? "block" : "hidden"} min-h-[650px] md:sticky md:top-6 md:block`}
        >
          <NewNoteComposer
            action={createNoteAction}
            textareaRef={composerRef}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyNoteState({ hasNotes }: { hasNotes: boolean }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
      <p className="text-lg font-semibold text-stone-800">{hasNotes ? "Select a note" : "Your plant journal is empty"}</p>
      <p className="mt-1 max-w-sm text-sm leading-6 text-stone-500">
        {hasNotes
          ? "Choose a note from the list on the left to read or edit it."
          : "Record observations, care experiments, questions, and discoveries to build a history for this plant."}
      </p>
    </div>
  );
}