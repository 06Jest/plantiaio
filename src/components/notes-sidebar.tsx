

import { formatNoteDate, getNotePreview, getNoteTitle } from "./note-text";
import type { NoteWithActions } from "./types";

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 4.5v11M4.5 10h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NotesSidebar({
  plantName,
  notes,
  selectedId,
  onSelect,
  onNewNote,
}: {
  plantName: string;
  notes: NoteWithActions[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewNote: () => void;
}) {
  return (
    <nav aria-label="Notes list" className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white">
      <div className="border-b border-stone-100 p-4">
        <p className="truncate text-xs font-medium text-stone-400">{plantName}</p>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-stone-900">Notes</h2>
          {notes.length > 0 && <span className="text-xs text-stone-400">{notes.length}</span>}
        </div>
        <button
          type="button"
          onClick={onNewNote}
          className="mt-3 flex w-full items-center justify-center gap-1.5 !rounded-lg !border !border-stone-300 !bg-stone-50 !px-3 !py-2 text-sm !font-medium !text-stone-700 transition-colors hover:!bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
        >
          <PlusIcon className="h-4 w-4" />
          New note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
          <p className="text-sm font-medium text-stone-600">No notes yet</p>
          <p className="mt-1 text-xs leading-5 text-stone-400">Your first note will appear here.</p>
        </div>
      ) : (
        <ul className="max-h-[50vh] overflow-y-auto p-2 md:max-h-[calc(100vh-16rem)]">
          {notes.map((note) => {
            const isSelected = note.id === selectedId;
            const title = getNoteTitle(note.currentContent);
            const preview = getNotePreview(note.currentContent);
            return (
              <li key={note.id}>
                <button
                  type="button"
                  onClick={() => onSelect(note.id)}
                  aria-current={isSelected ? "true" : undefined}
                  className={`mb-1 block w-full rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 ${
                    isSelected ? "bg-stone-100" : "hover:bg-stone-50"
                  }`}
                >
                  <span className={`block truncate text-sm font-medium ${isSelected ? "text-stone-900" : "text-stone-800"}`}>
                    {title}
                  </span>
                  {preview && <span className="mt-0.5 block truncate text-xs text-stone-500">{preview}</span>}
                  <span className="mt-1 block text-[11px] text-stone-400">{formatNoteDate(note.updatedAt)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}