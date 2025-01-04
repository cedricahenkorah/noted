"use client";

import { GetSession } from "@/app/actions/get-session";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NotesHeader } from "@/components/notes/notes-header";
import { fetchNotes } from "@/lib/notes";
import { NotebookText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NotesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getNotes() {
      const session = await GetSession();
      const token = session?.user?.accessToken as string;

      await fetchNotes({ accessToken: token })
        .then((response) => {
          setNotes(response.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          }

          setLoading(false);
        });
    }

    getNotes();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex-col items-center justify-center bg-background">
        <div className="flex h-full justify-center items-center">
          <div className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <NotebookText className="size-4" />
            </div>
            Loading notes...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <NotesHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        router={router}
      />
      <NotesGrid notes={notes} view={viewMode} />
    </div>
  );
}
