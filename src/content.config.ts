import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog: un archivo Markdown por artículo.
 *   ES → src/content/blog/<slug>.md     → /blog/<slug>/
 *   EN → src/content/blog/en/<slug>.md  → /en/blog/<slug>/  (con `lang: 'en'` y `translationOf: '<slug ES>'`)
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
    translationOf: z.string().optional(), // solo en artículos EN (src/content/blog/en/): id del artículo ES original
    project: z.string().optional(), // slug del proyecto en src/data/profile.ts (enlaza artículo ↔ caso de estudio)
    draft: z.boolean().default(false), // true = no se publica
    pinned: z.boolean().default(false), // true = aparece primero en el blog y en la portada
  }),
});

export const collections = { blog };
