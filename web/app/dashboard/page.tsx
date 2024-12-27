"use client";

import { QuickActions } from "@/components/quick-actions";
import { RecentNotes } from "@/components/recent-notes";
import { StatsCards } from "@/components/stats-card";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    let greetingMessage = "";

    if (currentHour >= 5 && currentHour < 12) {
      greetingMessage = "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      greetingMessage = "Good afternoon";
    } else {
      greetingMessage = "Good evening";
    }

    setGreeting(greetingMessage);
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {greeting}! Here&apos;s an overview of your notes.
        </p>
      </div>
      <StatsCards />
      <QuickActions />
      <RecentNotes />
    </div>
  );
}
