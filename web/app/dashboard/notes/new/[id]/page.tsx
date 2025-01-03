"use client";

import { EditorContent } from "@/components/notes/editor-content";
import { EditorHeader } from "@/components/notes/editor-header";
import { fetchNote, saveNote } from "@/lib/notes";
import { NotebookText } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function NewNotePage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<boolean>(false);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    async function getNote() {
      await fetchNote({ id: params.id })
        .then((response) => {
          setTitle(response?.data?.title ?? "");
          setContent(response?.data?.content ?? "");
          setTags(response?.data?.tags ?? []);
          setId(response?.data?._id ?? "");
          setLoading(false);
          setErrorState(false);
        })
        .catch((error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          }
          setErrorState(true);
        });
    }

    if (params.id) {
      getNote();
    }
  }, [params.id]);

  const handleSave = async () => {
    const data = { id, title, content, tags };

    const saveNotePromise = async () => {
      try {
        const response = await saveNote(data);

        if (response.status !== "success") {
          throw new Error(
            response.message || "Failed to save note. Try again later."
          );
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    toast.promise(saveNotePromise(), {
      loading: "Saving note...",
      success: "Note saved successfully",
      error: (error) => error?.message,
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex-col items-center justify-center bg-background">
        <div className="flex h-full justify-center items-center">
          <div className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <NotebookText className="size-4" />
            </div>
            Loading note...
          </div>
        </div>
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="flex-1 flex-col items-center justify-center bg-background">
        <div className="flex h-full justify-center items-center">
          <div className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <NotebookText className="size-4" />
            </div>
            Error loading note. Try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <EditorHeader handleSave={handleSave} />
      <EditorContent
        editorRef={editorRef}
        content={content}
        setContent={setContent}
        title={title}
        setTitle={setTitle}
        tags={tags}
        setTags={setTags}
        id={id}
      />
    </div>
  );
}
