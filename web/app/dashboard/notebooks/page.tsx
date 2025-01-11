"use client";

import { GetSession } from "@/app/actions/get-session";
import { NotebooksGrid } from "@/components/notebooks/notebooks-grid";
import { NotebooksHeader } from "@/components/notebooks/notebooks-header";
import { fetchNotebooks } from "@/lib/notebooks";
import { ChevronDown, NotebookText } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Notebook {
  _id: string;
  title: string;
  author: string;
  description: string;
  notesCount: number;
  audiosCount: number;
  tags: string[];
  updatedAt: Date;
}

export default function NotebooksPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const hasFetchedRef = useRef(false);

  const getNotebooks = useCallback(async () => {
    const session = await GetSession();
    const token = session?.user?.accessToken as string;

    setLoading(true);

    await fetchNotebooks({ accessToken: token, page: currentPage, limit: 9 })
      .then((response) => {
        setNotebooks((prevNotebooks) => [...prevNotebooks, ...response.data]);
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
      getNotebooks();
      hasFetchedRef.current = true;
    }
  }, [getNotebooks]);

  useEffect(() => {
    if (hasFetchedRef.current && currentPage > 1) {
      getNotebooks();
    }
  }, [currentPage, getNotebooks]);

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
            Loading notebooks...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <NotebooksHeader viewMode={viewMode} onViewModeChange={setViewMode} />
      <NotebooksGrid notebooks={notebooks} view={viewMode} />

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
              You&apos;ve reached the end of your notebooks
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
            Loading more notebooks...
          </div>
        </div>
      )}
    </div>
  );
}
