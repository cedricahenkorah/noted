"use client";

import { useCallback, useEffect, useState } from "react";
import { Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "@/components/notes/editor.css";
import { EditorToolbar } from "./editor-toolbar";
import { compressImage } from "@/utils/image-compression";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { uploadFiles } = genUploader<OurFileRouter>({
  package: "",
});

export function EditorContent({
  editorRef,
  content,
  setContent,
  title,
  setTitle,
  tags,
  setTags,
  id,
}: {
  editorRef: React.RefObject<HTMLDivElement | null>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  id: string;
}) {
  const [newTag, setNewTag] = useState("");
  const initialNote = { id, title, content, tags };
  const [isEmpty, setIsEmpty] = useState(!initialNote);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;

      // Reapply resize handles and remove button functionality to images
      const images = editorRef.current.querySelectorAll("img");
      images.forEach((img) => {
        addResizeHandles(img as HTMLImageElement);
      });

      const removeButtons = editorRef.current.querySelectorAll(
        ".remove-image-button"
      );

      removeButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();

          const wrapper = (button.parentElement as HTMLElement)?.closest(
            ".image-wrapper"
          );

          wrapper?.remove();
          updateEditorState();
        });
      });

      placeCursorAtEnd();
    }
  }, [content]);

  const placeCursorAtEnd = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags((prevTags) => [...prevTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const formatText = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      formatText("bold");
    }
    if (e.key === "i" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      formatText("italic");
    }
    if (e.key === "u" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      formatText("underline");
    }
  };

  const handleInsert = (type: "image" | "table" | "code" | "divider") => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    const range = selection.getRangeAt(0);
    const newElement = document.createElement("div");

    switch (type) {
      case "image":
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";

        fileInput.onchange = async () => {
          const file = fileInput.files?.[0];

          if (file) {
            const compressedFile = await compressImage(file as File);
            const uploadResponse = await uploadFiles("imageUploader", {
              files: [compressedFile],
            });

            const reader = new FileReader();
            reader.onload = () => {
              const img = document.createElement("img");

              img.src = uploadResponse[0].serverData.fileUrl;
              img.alt = "Uploaded image";
              img.style.width = "300px";
              img.style.height = "auto";

              const selection = window.getSelection();
              if (selection && editorRef.current) {
                const range = selection.getRangeAt(0);
                range.deleteContents();

                // Insert the image
                range.insertNode(img);

                // Create a new line element after the image
                const newLine = document.createElement("div");
                newLine.innerHTML = "<br>";
                range.setStartAfter(img);
                range.insertNode(newLine);

                // Move cursor to the new line
                range.setStart(newLine, 0);
                range.setEnd(newLine, 0);
                selection.removeAllRanges();
                selection.addRange(range);

                // Add resize handles
                addResizeHandles(img);
                updateEditorState();
              }
            };
            reader.readAsDataURL(file);
          }
        };

        // Simulate a click on the file input
        fileInput.click();
        return; // Exit here to wait for file selection

      case "table":
        newElement.innerHTML = `
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Header 1</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Header 2</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Row 1, Cell 1</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Row 1, Cell 2</td>
            </tr>
          </table>
        `;
        break;
      case "code":
        newElement.innerHTML =
          '<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px;"><code>// Your code here</code></pre>';
        break;
      case "divider":
        newElement.innerHTML =
          '<hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;" />';
        break;
    }

    range.deleteContents();
    range.insertNode(newElement);

    range.setStartAfter(newElement);
    range.setEndAfter(newElement);
    selection.removeAllRanges();
    selection.addRange(range);

    updateEditorState();
  };

  const addResizeHandles = (img: HTMLImageElement) => {
    if ((img.parentNode as HTMLElement)?.classList.contains("image-wrapper")) {
      // Resize handles are already added
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    img.parentNode?.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    const handles = ["nw", "ne", "sw", "se"];
    handles.forEach((pos) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle ${pos}`;
      wrapper.appendChild(handle);
    });

    const removeButton = document.createElement("button");
    removeButton.className = "remove-image-button";
    removeButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    removeButton.setAttribute("aria-label", "Remove image");
    removeButton.onclick = (e) => {
      e.preventDefault();
      wrapper.remove();

      updateEditorState();
    };
    wrapper.appendChild(removeButton);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    let resizedImage: HTMLImageElement | null = null;
    let startX: number, startY: number, startWidth: number, startHeight: number;

    const handleMouseDown = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.classList.contains("resize-handle")
      ) {
        e.preventDefault();
        resizedImage =
          e.target.closest(".image-wrapper")?.querySelector("img") || null;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = resizedImage?.width || 0;
        startHeight = resizedImage?.height || 0;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizedImage) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      resizedImage.style.width = `${startWidth + dx}px`;
      resizedImage.style.height = `${startHeight + dy}px`;
    };

    const handleMouseUp = () => {
      resizedImage = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      updateEditorState();
    };

    editor.addEventListener("mousedown", handleMouseDown);

    return () => {
      editor.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const updateEditorState = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      console.log(newContent);
      setContent(newContent);
      setIsEmpty(newContent.trim() === "");
    }
  };

  const handleInput = () => {
    updateEditorState();
  };
  return (
    <div className="flex flex-col flex-1">
      <EditorToolbar onInsert={handleInsert} />
      <div className="flex flex-col flex-1 p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="text-3xl font-bold bg-transparent border-none outline-none mb-4 placeholder:text-muted-foreground"
        />

        <div
          ref={editorRef}
          contentEditable
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          className={`flex-1 min-h-[200px] outline-none whitespace-pre-wrap break-words ${
            isEmpty ? "is-empty" : ""
          }`}
          data-placeholder="Start writing, drag files or start from a template"
        />

        <div className="flex items-center gap-4 mt-4 mb-10">
          <Button variant="outline" className="gap-2">
            My templates
          </Button>

          <Button variant="outline" className="gap-2">
            Discover more templates
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-secondary px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              <Input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag"
                className="w-20 h-6 bg-transparent border-none text-sm p-0 placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
