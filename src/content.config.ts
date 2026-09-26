import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog: un archivo Markdown por artículo en src/content/blog/<slug>.md
 * El nombre del archivo es la URL: /blog/<slug>/
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(), // 1–2 frases: aparece en el listado, en Google y al compartir
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['es', 'en']).default('es'),
    project: z.string().optional(), // slug del proyecto en src/data/profile.ts (enlaza artículo ↔ caso de estudio)
    draft: z.boolean().default(false), // true = no se publica
    pinned: z.boolean().default(false), // true = aparece primero en el blog y en la portada
  }),
});

export const collections = { blog };
