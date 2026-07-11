import { defineCollection } from "astro:content";

import { glob, file } from 'astro/loaders';

import { z } from 'astro/zod';

const workshops = defineCollection({
    loader: glob({base:'./src/content/workshops', pattern: '**/*.{md,mdx}'}),
    schema: () => z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  location: z.string(),
  priceEarly: z.number(),
  priceStandard: z.number(),
  seats: z.number(),
  featured: z.boolean().default(false),

  thumbnail: z.string(),

  included: z.array(z.string()),
  notIncluded: z.array(z.string()),
  instructor: z.string(),
})
});

const testimonials = defineCollection({
  loader: glob({base:'./src/content/testimonials',pattern: '**/*.{md,mdx}'}),
  schema: () => z.object({
    name: z.string(),
    country: z.string(),
    workshop: z.string(),
    featured: z.boolean().default(false),
    image: z.string(),
    instagram: z.string(),
    testimony: z.string(),
  })
});

const journals = defineCollection({
  loader: glob({base:'./src/content/journals',pattern:'**/*.{md,mdx}'}),
  schema: () => z.object({
    slug: z.string(),
    title: z.string(),
    subtitle: z.string(),
    dateCreated: z.string(),
    category: z.string(),
    author: z.string(),
    excerpt: z.string(),
  })
})

export const collections = {
  workshops,
  testimonials,
  journals
};