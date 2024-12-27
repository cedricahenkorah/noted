import { formatDistanceToNow } from "date-fns";
import { FileText, MoreVertical, Pencil } from "lucide-react";
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

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    excerpt: string;
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
                href={`/notes/${note.id}`}
                className="font-semibold hover:underline"
              >
                {note.title}
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
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {note.excerpt}
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <div
                key={tag}
                className="rounded-full bg-secondary px-2 py-1 text-xs"
              >
                {tag}
              </div>
            ))}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
