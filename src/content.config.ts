import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const documentSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  summary: z.string(),
  featured: z.boolean().optional().default(false),
  status: z.string().optional(),
  category: z.string().optional(),
});

export const collections = {
  research: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
    schema: documentSchema,
  }),
  projects: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
    schema: documentSchema,
  }),
  commercial: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/commercial' }),
    schema: documentSchema,
  }),
  notes: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
    schema: documentSchema,
  }),
};
