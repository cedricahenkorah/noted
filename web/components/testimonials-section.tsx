"use client";

import { motion } from "motion/react";
import Avatar from "boring-avatars";

const testimonials = [
  {
    quote:
      "It has transformed how I organize my thoughts and ideas. The voice recording feature is a game-changer.",
    author: "Sarah Johnson",
    title: "Content Creator",
  },
  {
    quote:
      "The canvas feature helps me visualize my ideas in ways that weren't possible before. It's intuitive and powerful.",
    author: "Michael Chen",
    title: "UX Designer",
  },
  {
    quote:
      "As a developer, I love how I can switch between text and drawing to document my system architectures.",
    author: "Alex Rivera",
    title: "Software Engineer",
  },
];

export function TestimonialsSection() {
  return (
    <section className="container mx-auto py-24 md:py-32">
      <div className="mx-auto text-center md:max-w-[58rem]">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Loved by creators worldwide
        </h2>
        <p className="mt-4 text-muted-foreground md:text-xl">
          Join thousands of users who trust noted for their daily note-taking
          needs.
        </p>
      </div>

      <div className="mx-auto mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: false }}
            className="relative overflow-hidden rounded-lg border bg-background p-8"
          >
            <div className="space-y-6">
              <p className="text-lg italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <Avatar name={testimonial.author} size={25} />
                <div>
                  <h3 className="font-semibold">{testimonial.author}</h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
