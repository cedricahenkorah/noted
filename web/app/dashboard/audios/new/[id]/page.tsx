"use client";

import { GetSession } from "@/app/actions/get-session";
import { AudioRecorder } from "@/components/audio/audio-recorder";
import { uploadFiles } from "@/components/notes/editor-content";
import { saveAudioNote } from "@/lib/audio-notes";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewAudioPage() {
  const params = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const router = useRouter();

  useEffect(() => {
    async function setToken() {
      const session = await GetSession();
      const token = session?.user?.accessToken as string;

      setAccessToken(token);
    }

    setToken();
  }, []);

  const handleAudioSave = async () => {
    const id = params.id;

    const saveNotePromise = async () => {
      try {
        const audioFile = new File([audioBlob as Blob], `${id}-${title}.webm`, {
          type: "audio/webm",
        });

        const uploadResponse = await uploadFiles("imageUploader", {
          files: [audioFile],
        });

        const url = uploadResponse[0].serverData.fileUrl;

        const data = { id, title, url, recordingTime, accessToken };

        console.log(data);

        const response = await saveAudioNote(data);

        if (response.status !== "success") {
          throw new Error(
            response.message || "Failed to save audio note. Try again later."
          );
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    toast.promise(saveNotePromise(), {
      loading: "Saving audio note...",
      success: () => {
        router.push("/dashboard/audios/");
        return "Audio note saved successfully";
      },
      error: (error) => error?.message,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <AudioRecorder
        title={title}
        setTitle={setTitle}
        audioBlob={audioBlob}
        setAudioBlob={setAudioBlob}
        recordingTime={recordingTime}
        setRecordingTime={setRecordingTime}
        handleAudioSave={handleAudioSave}
      />
    </div>
  );
}
