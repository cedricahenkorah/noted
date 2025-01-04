"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function QuickActions() {
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

        <Button className="h-20 justify-start gap-4" variant="outline" asChild>
          <Link href="/voice/new">
            <Plus className="h-5 w-5" />
            Voice Note
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
