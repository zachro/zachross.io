import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences, used on cards and as the meta description. */
    summary: z.string(),
    /** What Zach did on the project, e.g. "Solo developer" or "Backend lead". */
    role: z.string(),
    stack: z.array(z.string()).nonempty(),
    date: z.coerce.date(),
    links: z
      .object({
        repo: z.url().optional(),
        demo: z.url().optional(),
        writeup: z.url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
