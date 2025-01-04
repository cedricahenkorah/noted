import { formatDistanceToNow } from "date-fns";
import { FileText, MoreVertical, Pencil } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteCardProps {
  note: {
    _id: string;
    title: string;
    content: string;
    updatedAt: Date;
    tags: string[];
  };
  view: "grid" | "list";
}

export function NoteCard({ note, view }: NoteCardProps) {
  return (
    <Card className={view === "list" ? "flex" : ""}>
      <div className={view === "list" ? "flex-1" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between space-x-4">
            <div className="space-y-1">
              <Link
                href={`/dashboard/notes/new/${note._id}`}
                className="font-semibold hover:underline"
              >
                {note.title || "Untitled"}
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>
                  Updated{" "}
                  {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
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
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardFooter>
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
        </CardFooter>
      </div>
    </Card>
  );
}
