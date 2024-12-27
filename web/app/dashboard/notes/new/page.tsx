import { EditorContent } from "@/components/notes/editor-content";
import { EditorHeader } from "@/components/notes/editor-header";
import { EditorToolbar } from "@/components/notes/editor-toolbar";

export default function NewNotePage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <EditorHeader />
      <EditorToolbar />
      <EditorContent />
    </div>
  );
}
