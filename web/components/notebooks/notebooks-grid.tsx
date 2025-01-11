import { NotebookCard } from "./notebook-card";

interface NotebooksGridProps {
  notebooks: Array<{
    _id: string;
    title: string;
    author: string;
    description: string;
    notesCount: number;
    audiosCount: number;
    tags: string[];
    updatedAt: Date;
  }>;
  view: "grid" | "list";
}

export function NotebooksGrid({ notebooks, view }: NotebooksGridProps) {
  return (
    <div
      className={
        view === "grid"
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          : "space-y-4"
      }
    >
      {notebooks.map((notebook) => (
        <NotebookCard key={notebook._id} notebook={notebook} view={view} />
      ))}
    </div>
  );
}
