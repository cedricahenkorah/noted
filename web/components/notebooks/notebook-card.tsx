"use client";

import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Notebook, Pencil } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotebookCardProps {
  notebook: {
    _id: string;
    title: string;
    author: string;
    description: string;
    notesCount: number;
    audiosCount: number;
    tags: string[];
    updatedAt: Date;
  };
  view: "grid" | "list";
}

export function NotebookCard({ notebook, view }: NotebookCardProps) {
  function handleDeleteNote(_id: string): void {
    console.log(_id);
    throw new Error("Function not implemented.");
  }

  return (
    <Card className={view === "list" ? "flex" : ""}>
      <div className={view === "list" ? "flex-1" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between space-x-4">
            <div className="space-y-1">
              <Link
                href={`/dashboard/notebooks/${notebook._id}`}
                className="font-semibold hover:underline"
              >
                {notebook.title || "Untitled"}
              </Link>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Notebook className="h-4 w-4" />
                <span>
                  Updated{" "}
                  {formatDistanceToNow(notebook.updatedAt, { addSuffix: true })}
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem>Share</DropdownMenuItem>

                <DropdownMenuItem>Add to notebook</DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDeleteNote(notebook._id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm">
            <span className="font-semibold">Notes:</span> {notebook.notesCount}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Audio Recordings:</span>{" "}
            {notebook.audiosCount}
          </p>
        </CardContent>

        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {notebook?.tags?.length > 0 ? (
              notebook?.tags?.map((tag: string) => (
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
        </CardFooter>
      </div>
    </Card>
  );
}
