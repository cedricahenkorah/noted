"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-t">
      <div className="container mx-auto py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to amplify your productivity?
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Join thousands of users who trust noted for capturing and organizing
            their ideas.
          </p>
          <div className="mt-8 flex flex-col gap-4 min-[400px]:flex-row justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Get started for free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact sales</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
