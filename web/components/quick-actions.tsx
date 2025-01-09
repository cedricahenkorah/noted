"use client";

import { Mic, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetSession } from "@/app/actions/get-session";
import { toast } from "sonner";
import { createAudioNote } from "@/lib/audio-notes";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
  router: ReturnType<typeof useRouter>;
}

export function QuickActions({ router }: QuickActionsProps) {
  const handleCreateAudioNote = async () => {
    const session = await GetSession();
    const accessToken = session?.user?.accessToken as string;

    if (!accessToken) {
      toast.error("Please sign in to create a new audio note");
      return;
    }

    const createNotePromise = async () => {
      try {
        const data = { accessToken };
        const response = await createAudioNote(data);

        if (response.status !== "success") {
          throw new Error(
            response.message || "Failed to create audio note. Try again later."
          );
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    toast.promise(createNotePromise(), {
      loading: "Creating new audio note...",
      success: (response) => {
        router.push(`/dashboard/audios/new/${response?.data?._id}`);
        return "Note created successfully";
      },
      error: (error) => {
        return error?.message;
      },
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-yellow-500">Quick Actions</CardTitle>
        <CardDescription>Create new content or start recording</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button className="h-20 justify-start gap-4" variant="outline" asChild>
          <Link href="/notes/new">
            <Plus className="h-5 w-5" />
            New Note
          </Link>
        </Button>

        <Button className="h-20 justify-start gap-4" variant="outline" asChild>
          <Link href="/notebooks/new">
            <Plus className="h-5 w-5" />
            New Notebook
          </Link>
        </Button>

        <Button className="h-20 justify-start gap-4" variant="outline" asChild>
          <Link href="/canvas/new">
            <Plus className="h-5 w-5" />
            New Canvas
          </Link>
        </Button>

        <Button
          className="h-20 justify-start gap-4"
          variant="outline"
          onClick={handleCreateAudioNote}
        >
          <Mic className="h-5 w-5" />
          Voice Note
        </Button>
      </CardContent>
    </Card>
  );
}
