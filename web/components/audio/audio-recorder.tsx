"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AudioRecorder({
  title,
  setTitle,
  audioBlob,
  setAudioBlob,
  recordingTime,
  setRecordingTime,
  handleAudioSave,
}: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  audioBlob: Blob | null;
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  recordingTime: number;
  setRecordingTime: React.Dispatch<React.SetStateAction<number>>;
  handleAudioSave: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        console.log("url", url);
        setAudioUrl(url);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();

      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const togglePause = () => {
    if (isRecording) {
      if (isPaused) {
        mediaRecorderRef.current?.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current?.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  // const saveRecording = () => {
  //   if (audioBlob && title) {
  //     const a = document.createElement("a");
  //     a.href = audioUrl as string;
  //     a.download = `${title}.webm`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   }
  // };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Audio Recorder</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-bold">{formatTime(recordingTime)}</div>
          <div className="flex space-x-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button onClick={togglePause}>
                  {isPaused ? (
                    <Play className="mr-2 h-4 w-4" />
                  ) : (
                    <Pause className="mr-2 h-4 w-4" />
                  )}
                  {isPaused ? "Resume" : "Pause"}
                </Button>

                <Button onClick={stopRecording} variant="destructive">
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </>
            )}
          </div>

          {audioUrl && <audio controls src={audioUrl} className="w-full" />}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="w-full">
          <Label htmlFor="title">Recording Title</Label>

          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your recording"
          />
        </div>

        <Button onClick={handleAudioSave} disabled={!audioBlob || !title}>
          <Save className="mr-2 h-4 w-4" />
          Save Recording
        </Button>
      </CardFooter>
    </Card>
  );
}
