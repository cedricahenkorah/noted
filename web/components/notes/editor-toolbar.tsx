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

export function EditorToolbar() {
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
          <DropdownMenuItem>Image</DropdownMenuItem>
          <DropdownMenuItem>Table</DropdownMenuItem>
          <DropdownMenuItem>Code Block</DropdownMenuItem>
          <DropdownMenuItem>Divider</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="icon">
        <Calendar className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant="ghost" size="icon">
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant="ghost" size="sm" className="gap-2">
        <Wand2 className="h-4 w-4" />
        AI Edit
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Select defaultValue="sans">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sans">Sans Serif</SelectItem>
          <SelectItem value="serif">Serif</SelectItem>
          <SelectItem value="mono">Monospace</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="15">
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[12, 14, 15, 16, 18, 20, 24, 30, 36].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle aria-label="Toggle bold">
        <span className="font-bold">B</span>
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <span className="italic">I</span>
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <span className="underline">U</span>
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant="ghost" size="icon">
        <Link2 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Justify">
        <AlignJustify className="h-4 w-4" />
      </Toggle>

      <Button variant="ghost" size="icon" className="ml-auto">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
