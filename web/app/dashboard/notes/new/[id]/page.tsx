"use client";

import { EditorContent } from "@/components/notes/editor-content";
import { EditorHeader } from "@/components/notes/editor-header";
import { fetchNote, saveNote } from "@/lib/notes";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function NewNotePage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [id, setID] = useState<string>("");
  const params = useParams<{ id: string }>();

  useEffect(() => {
    async function getNote() {
      await fetchNote({ id: params.id })
        .then((response) => {
          setID(response?.data?._id ?? "");
          setTitle(response?.data?.title ?? "");
          setContent(response?.data?.content ?? "");
          setTags(response?.data?.tags ?? []);
        })
        .catch((error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          }
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
