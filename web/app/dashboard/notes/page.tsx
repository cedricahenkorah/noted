"use client";

import { NotesGrid } from "@/components/notes/notes-grid";
import { NotesHeader } from "@/components/notes/notes-header";
import { useState } from "react";

const notes = [
  {
    id: "1",
    title: "Project Kickoff Meeting Notes",
    excerpt:
      "Key points from the project kickoff meeting including timeline, deliverables, and team responsibilities...",
    updatedAt: new Date(2024, 11, 27, 14, 30),
    tags: ["work", "project-alpha", "meeting"],
  },
  {
    id: "2",
    title: "React Component Architecture",
    excerpt:
      "Best practices for structuring React components, including state management and prop drilling solutions...",
    updatedAt: new Date(2024, 11, 27, 12, 15),
    tags: ["development", "react", "architecture"],
  },
  {
    id: "3",
    title: "Weekly Goals and Tasks",
    excerpt:
      "Personal and professional goals for the week, including deadlines and priority assignments...",
    updatedAt: new Date(2024, 11, 27, 10, 0),
    tags: ["personal", "goals", "planning"],
  },
  {
    id: "4",
    title: "Book Notes: Design Patterns",
    excerpt:
      "Summary and key takeaways from the Design Patterns book, including practical examples and use cases...",
    updatedAt: new Date(2024, 11, 26, 16, 45),
    tags: ["reading", "development", "learning"],
  },
  {
    id: "5",
    title: "Client Meeting Agenda",
    excerpt:
      "Agenda items and discussion points for upcoming client meeting, including project status updates...",
    updatedAt: new Date(2024, 11, 26, 15, 30),
    tags: ["work", "client", "meeting"],
  },
  {
    id: "6",
    title: "Feature Implementation Plan",
    excerpt:
      "Detailed plan for implementing new features, including technical requirements and testing strategy...",
    updatedAt: new Date(2024, 11, 26, 14, 0),
    tags: ["development", "planning", "project-beta"],
  },
];

export default function NotesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex-1 space-y-6 p-6">
      <NotesHeader viewMode={viewMode} onViewModeChange={setViewMode} />
      <NotesGrid notes={notes} view={viewMode} />
    </div>
  );
}
