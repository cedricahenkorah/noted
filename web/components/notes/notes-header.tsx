import { Grid, List, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createNote } from "@/lib/notes";
import { useRouter } from "next/navigation";
import { GetSession } from "@/app/actions/get-session";

interface NotesHeaderProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  router: ReturnType<typeof useRouter>;
}

export function NotesHeader({
  viewMode,
  onViewModeChange,
  router,
}: NotesHeaderProps) {
  const handleCreateNote = async () => {
    const session = await GetSession();
    const accessToken = session?.user?.accessToken as string;

    if (!accessToken) {
      toast.error("Please sign in to create a new note");
      return;
    }

    const createNotePromise = async () => {
      try {
        const data = { accessToken };
        const response = await createNote(data);

        if (response.status !== "success") {
          throw new Error(
            response.message || "Failed to create note. Try again later."
          );
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    toast.promise(createNotePromise(), {
      loading: "Creating new note...",
      success: (response) => {
        router.push(`/dashboard/notes/new/${response?.data?._id}`);
        return "Note created successfully";
      },
      error: (error) => {
        return error?.message;
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">
            Create, edit and manage your notes
          </p>
        </div>

        <Button onClick={handleCreateNote}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-4 sm:w-auto">
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search notes..." className="pl-8" />
          </div>

          <Select defaultValue="updated">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last updated</SelectItem>
              <SelectItem value="created">Created date</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>

          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
