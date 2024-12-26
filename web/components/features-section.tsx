"use client";

import { motion } from "motion/react";
import { FileText, Mic, PenTool } from "lucide-react";

const features = [
  {
    title: "Rich Text Editor",
    description:
      "Write, format, and organize your thoughts with our powerful text editor. Support for markdown, code blocks, and more.",
    icon: FileText,
  },
  {
    title: "Voice Notes",
    description:
      "Record your ideas on the go. Our voice notes feature includes automatic transcription and easy organization.",
    icon: Mic,
  },
  {
    title: "Canvas Creation",
    description:
      "Draw, sketch, and visualize your ideas with our digital canvas. Perfect for diagrams, mind maps, and artistic expression.",
    icon: PenTool,
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="container mx-auto space-y-16 py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto text-center md:max-w-[58rem]">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Powerful features for every thought
        </h2>
        <p className="mt-4 text-muted-foreground md:text-xl">
          Choose how you want to capture your ideas. Write, speak, or draw -
          we&apos;ve got you covered.
        </p>
      </div>

      <div className="mx-auto grid gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: false }}
            className="relative overflow-hidden rounded-lg border bg-background p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
