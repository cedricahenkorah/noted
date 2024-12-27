import { NoteCard } from "./note-card";

interface NotesGridProps {
  notes: Array<{
    id: string;
    title: string;
    excerpt: string;
    updatedAt: Date;
    tags: string[];
  }>;
  view: "grid" | "list";
}

export function NotesGrid({ notes, view }: NotesGridProps) {
  return (
    <div
      className={
        view === "grid"
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          : "space-y-4"
      }
    >
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} view={view} />
      ))}
    </div>
  );
}
