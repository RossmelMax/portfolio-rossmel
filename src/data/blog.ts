import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Artículos publicados (sin borradores), del más nuevo al más viejo. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Minutos de lectura aproximados (~200 palabras por minuto). */
export function readingTime(body = ''): number {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
}

export function fmtDate(d: Date, lang: 'es' | 'en') {
  return d.toLocaleDateString(lang === 'es' ? 'es-BO' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
