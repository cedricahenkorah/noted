"use client";

import { formatDistanceToNow } from "date-fns";
import { FileText, NotebookText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { fetchNotes } from "@/lib/notes";
import { GetSession } from "@/app/actions/get-session";
import { Note } from "@/app/dashboard/notes/page";
import { toast } from "sonner";

export function RecentNotes() {
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const getNotes = useCallback(async () => {
    const session = await GetSession();
    const token = session?.user?.accessToken as string;

    setLoading(true);

    await fetchNotes({ accessToken: token, page: 1, limit: 4 })
      .then((response) => {
        setRecentNotes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-yellow-500">Recent Notes</CardTitle>
          <CardDescription>Your latest updates and creations</CardDescription>
        </div>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/notes/">View all</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {loading ? (
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
          ) : recentNotes.length === 0 ? (
            <div className="flex-1 flex-col items-center justify-center bg-background">
              <div className="flex h-full justify-center items-center">
                <div className="flex items-center gap-2 self-center font-medium">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-500 text-primary-foreground">
                    <NotebookText className="size-4" />
                  </div>
                  No recent notes found.
                </div>
              </div>
            </div>
          ) : (
            recentNotes.map((note) => (
              <div
                key={note._id}
                className="flex items-start space-x-4 rounded-lg border p-3"
              >
                <FileText className="mt-1 h-5 w-5 text-primary" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/dashboard/notes/new/${note._id}`}
                      className="font-medium hover:underline"
                    >
                      {note.title || "Untitled"}
                    </Link>

                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(note.updatedAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {note.tags.length > 0 ? (
                      note.tags.map((tag) => (
                        <div
                          key={tag}
                          className="rounded-full bg-secondary px-2 py-1 text-xs"
                        >
                          {tag}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-full bg-secondary px-2 py-1 text-muted-foreground text-xs">
                        No tags
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
