"use client";

import { GetSession } from "@/app/actions/get-session";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NotesHeader } from "@/components/notes/notes-header";
import { fetchNotes } from "@/lib/notes";
import { ChevronDown, NotebookText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface Note {
  _id: string;
  title: string;
  content: string;
  updatedAt: Date;
  tags: string[];
}

export default function NotesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const hasFetchedRef = useRef(false);

  const getNotes = useCallback(async () => {
    const session = await GetSession();
    const token = session?.user?.accessToken as string;

    setLoading(true);

    await fetchNotes({ accessToken: token, page: currentPage, limit: 9 })
      .then((response) => {
        setNotes((prevNotes) => [...prevNotes, ...response.data]);
        setHasMore(response.data.length > 0);
        setLoading(false);
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      getNotes();
      hasFetchedRef.current = true;
    }
  }, [getNotes]);

  useEffect(() => {
    if (hasFetchedRef.current && currentPage > 1) {
      getNotes();
    }
  }, [currentPage, getNotes]);

  const handleShowMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex-1 flex-col items-center justify-center bg-background">
        <div className="flex h-full justify-center items-center">
          <div className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-500 text-primary-foreground">
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

      {hasMore && !loading ? (
        <div className="flex justify-center mt-4">
          <div
            className="flex items-center gap-x-2 text-sm font-semibold cursor-pointer animate-bounce text-yellow-500"
            onClick={handleShowMore}
          >
            Show More <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      ) : (
        !hasMore &&
        !loading && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 self-center font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-500 text-primary-foreground">
                <NotebookText className="size-4" />
              </div>
              You&apos;ve reached the end of your notes
            </div>
          </div>
        )
      )}

      {loading && currentPage > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-500 text-primary-foreground">
              <NotebookText className="size-4" />
            </div>
            Loading more notes...
          </div>
        </div>
      )}
    </div>
  );
}
