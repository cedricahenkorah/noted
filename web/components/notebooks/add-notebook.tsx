import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { GetSession } from "@/app/actions/get-session";
import { toast } from "sonner";
import { createNotebook } from "@/lib/notebooks";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";

export function AddNotebook() {
  const router = useRouter();

  const handleCreateNotebook = async (formData: FormData) => {
    const session = await GetSession();
    const accessToken = session?.user?.accessToken as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!accessToken) {
      toast.error("Please sign in to create a new audio note");
      return;
    }

    if (!title) {
      toast.error("Missing required fields");
      return;
    }

    const createNotebookPromise = async () => {
      try {
        const data = { title, description, accessToken };
        const response = await createNotebook(data);

        if (response.status !== "success") {
          throw new Error(
            response.message || "Failed to create notebook. Try again later."
          );
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    toast.promise(createNotebookPromise(), {
      loading: "Creating new notebook...",
      success: () => {
        router.push(`/dashboard/notebooks/`);
        return "Notebook created successfully";
      },
      error: (error) => {
        return error?.message;
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button className="bg-yellow-500 hover:bg-yellow-600">
            <Plus className="mr-2 h-4 w-4" />
            New Notebook
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Notebook</DialogTitle>
          <DialogDescription>
            Create a new notebook for your notes and audio.
          </DialogDescription>
        </DialogHeader>

        <form action={(formData) => handleCreateNotebook(formData)}>
          <div className="w-full flex flex-col gap-y-2 lg:gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Title</Label>

              <Input type="text" id="title" required name="title" />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="Type your notebook description here"
                id="description"
                name="description"
              />
            </div>
          </div>
          <DialogFooter className="mt-3">
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
              Add Notebook
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
