import { AudioCard } from "./audio-card";

interface AudiosGridProps {
  audios: Array<{
    _id: string;
    title: string;
    url: string;
    recordingTime: number;
    updatedAt: Date;
  }>;
  view: "grid" | "list";
}

export function AudiosGrid({ audios, view }: AudiosGridProps) {
  return (
    <div
      className={
        view === "grid"
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          : "space-y-4"
      }
    >
      {audios.map((audio) => (
        <AudioCard key={audio._id} audio={audio} view={view} />
      ))}
    </div>
  );
}
