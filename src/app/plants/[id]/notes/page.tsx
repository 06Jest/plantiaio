import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createNote, deleteNote, publishNote, updateNote } from "@/app/notes/actions";
import { createClient } from "@/lib/supabase/server";
import { NotesWorkspace } from "@/components/notes-workspace";
import type { NoteWithActions } from "@/components/types";

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12.5 15.5 7 10l5.5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: plant }, { data: notes }] = await Promise.all([
    supabase.from("plants").select("id, name").eq("id", id).single(),
    supabase
      .from("notes")
      .select("id, original_content, current_content, created_at, updated_at")
      .eq("plant_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!plant) notFound();

  const notesWithActions: NoteWithActions[] = (notes ?? []).map((note) => ({
    id: note.id,
    originalContent: note.original_content,
    currentContent: note.current_content,
    createdAt: note.created_at,
    updatedAt: note.updated_at,
    updateAction: updateNote.bind(null, id, note.id),
    deleteAction: deleteNote.bind(null, id, note.id),
    publishAction: publishNote.bind(null, id, note.id),
  }));

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        {/* Back navigation */}
        <Link
          href={`/plants/${id}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 -ml-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to {plant.name}
        </Link>

        {/* Header */}
        <header className="mt-6">
          <p className="text-xs font-medium text-stone-400">Private journal</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">Notes for {plant.name}</h1>
          <p className="mt-2 max-w-prose leading-6 text-stone-600">
            Record observations, care decisions, questions, and discoveries about this plant. Your notes remain private unless you
            explicitly publish one.
          </p>
        </header>

        {/* Three-panel workspace: notes list, selected note, composer */}
        <NotesWorkspace plantName={plant.name} notes={notesWithActions} createNoteAction={createNote.bind(null, id)} />
      </div>
    </main>
  );
}