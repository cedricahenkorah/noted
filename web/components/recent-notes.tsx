import { formatDistanceToNow } from "date-fns";
import { FileText, Mic, PenTool } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const recentNotes = [
  {
    id: 1,
    title: "Meeting Notes - Product Review",
    type: "text",
    updatedAt: new Date(2024, 11, 26, 14, 30),
    excerpt: "Discussed new feature roadmap and prioritization...",
  },
  {
    id: 2,
    title: "Project Architecture",
    type: "canvas",
    updatedAt: new Date(2024, 11, 26, 12, 15),
    excerpt: "System design diagram for the new backend...",
  },
  {
    id: 3,
    title: "Interview Questions",
    type: "voice",
    updatedAt: new Date(2024, 11, 26, 10, 0),
    excerpt: "Recorded preparation for tomorrow's interview...",
  },
  {
    id: 4,
    title: "Weekly Goals",
    type: "text",
    updatedAt: new Date(2024, 11, 25, 16, 45),
    excerpt: "Set priorities for the upcoming sprint...",
  },
];

const noteTypeIcons = {
  text: FileText,
  canvas: PenTool,
  voice: Mic,
};

export function RecentNotes() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Notes</CardTitle>
          <CardDescription>Your latest updates and creations</CardDescription>
        </div>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/notes">View all</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {recentNotes.length === 0 && (
            <div className="text-muted-foreground text-sm">
              No recent notes found.
            </div>
          )}

          {recentNotes.map((note) => {
            const Icon = noteTypeIcons[note.type as keyof typeof noteTypeIcons];
            return (
              <div
                key={note.id}
                className="flex items-start space-x-4 rounded-lg border p-3"
              >
                <Icon className="mt-1 h-5 w-5 text-primary" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/notes/${note.id}`}
                      className="font-medium hover:underline"
                    >
                      {note.title}
                    </Link>

                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {note.excerpt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
