"use client";

import {
  Calendar,
  Plus,
  Undo,
  Redo,
  Wand2,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  MoreHorizontal,
  Table,
  Code,
  Minus,
  Images,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { useCallback } from "react";

interface EditorToolbarProps {
  onInsert: (type: "image" | "table" | "code" | "divider") => void;
}

export function EditorToolbar({ onInsert }: EditorToolbarProps) {
  const formatText = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
  }, []);

  const handleFontChange = (value: string) => {
    formatText("fontName", value);
  };

  const handleFontSizeChange = (value: string) => {
    const sizeMap: { [key: string]: number } = {
      12: 1,
      14: 2,
      16: 3,
      18: 4,
      24: 5,
      30: 6,
      36: 7,
    };

    const fontSizeValue = sizeMap[parseInt(value)];
    if (fontSizeValue) {
      formatText("fontSize", fontSizeValue.toString());
    } else {
      console.error("Invalid font size value");
    }
  };

  const handleLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      formatText("createLink", url);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b px-4 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Insert
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => onInsert("image")}>
            <Images className="mr-2 h-4 w-4" />
            Image
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onInsert("table")}>
            <Table className="mr-2 h-4 w-4" />
            Table
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onInsert("code")}>
            <Code className="mr-2 h-4 w-4" />
            Code Block
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onInsert("divider")}>
            <Minus className="mr-2 h-4 w-4" />
            Divider
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="icon">
        <Calendar className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant="ghost" size="icon" onClick={() => formatText("undo")}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => formatText("redo")}>
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant="ghost" size="sm" className="gap-2">
        <Wand2 className="h-4 w-4" />
        AI Edit
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Select defaultValue="sans" onValueChange={handleFontChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sans">Sans Serif</SelectItem>
          <SelectItem value="serif">Serif</SelectItem>
          <SelectItem value="mono">Monospace</SelectItem>
          <SelectItem value="Arial">Arial</SelectItem>
          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
          <SelectItem value="Courier New">Courier New</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="15" onValueChange={handleFontSizeChange}>
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[12, 14, 16, 18, 24, 30, 36].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        aria-label="Toggle bold"
        onPressedChange={() => formatText("bold")}
      >
        <span className="font-bold">B</span>
      </Toggle>
      <Toggle
        aria-label="Toggle italic"
        onPressedChange={() => formatText("italic")}
      >
        <span className="italic">I</span>
      </Toggle>
      <Toggle
        aria-label="Toggle underline"
        onPressedChange={() => formatText("underline")}
      >
        <span className="underline">U</span>
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant="ghost" size="icon" onClick={handleLink}>
        <Link2 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        aria-label="Align left"
        onPressedChange={() => formatText("JustifyLeft")}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Align center"
        onPressedChange={() => formatText("JustifyCenter")}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Align right"
        onPressedChange={() => formatText("JustifyRight")}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Justify"
        onPressedChange={() => formatText("JustifyFull")}
      >
        <AlignJustify className="h-4 w-4" />
      </Toggle>

      <Button variant="ghost" size="icon" className="ml-auto">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
