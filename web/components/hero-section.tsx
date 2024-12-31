"use client";

import { motion } from "motion/react";
import { Mic, Pencil, PenTool } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-background" />
      <div className="container relative mx-auto px-5 lg:px-0">
        <div className="flex flex-col items-center justify-center space-y-10 py-32 text-center md:py-36 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Your thoughts,{" "}
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                amplified
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Capture ideas instantly with text, voice, and canvas. Stay
              organized with powerful note-taking tools that adapt to your
              creative flow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4 min-[400px]:flex-row"
          >
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Start for free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">See how it works</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center gap-4 lg:gap-8"
          >
            <div className="flex items-center space-x-2">
              <Pencil className="h-4 w-4 text-primary" />
              <span className="text-sm">Text Notes</span>
            </div>

            <div className="flex items-center space-x-2">
              <Mic className="h-4 w-4 text-primary" />
              <span className="text-sm">Voice Recording</span>
            </div>

            <div className="flex items-center space-x-2">
              <PenTool className="h-4 w-4 text-primary" />
              <span className="text-sm">Canvas Drawing</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
