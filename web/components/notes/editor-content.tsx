"use client";

import { useState } from "react";
import { Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EditorContent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="text-3xl font-bold bg-transparent border-none outline-none mb-4 placeholder:text-muted-foreground"
      />

      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing, drag files or start from a template"
          className="w-full h-full min-h-[200px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground"
        />
      </div>

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
              <span key={index} className="bg-secondary px-2 py-1 rounded-full">
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
  );
}
