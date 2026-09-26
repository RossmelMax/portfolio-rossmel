import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Artículos publicados (sin borradores): fijados primero y luego del más nuevo al más viejo. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) =>
      Number(b.data.pinned) - Number(a.data.pinned) ||
      b.data.date.getTime() - a.data.date.getTime() ||
      a.data.title.localeCompare(b.data.title),
  );
}

/** Minutos de lectura aproximados (~200 palabras por minuto). */
export function readingTime(body = ''): number {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
}

export function fmtDate(d: Date, lang: 'es' | 'en') {
  return d.toLocaleDateString(lang === 'es' ? 'es-BO' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Minúsculas y sin tildes: "Búsqueda" y "busqueda" deben coincidir. Igual que en el buscador del cliente. */
export function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Texto plano del Markdown para el índice de búsqueda (sin sintaxis, con el código incluido). */
export function plainText(markdown = ''): string {
  return markdown
    .replace(/```[a-z]*\n/gi, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Etiquetas con su número de artículos, de la más usada a la menos. */
export function tagCounts(posts: Post[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const p of posts) for (const tag of p.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** Artículos relacionados: mismo proyecto pesa más que cada etiqueta compartida. */
export function relatedPosts(post: Post, posts: Post[], n = 3): Post[] {
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      const shared = p.data.tags.filter((tag) => post.data.tags.includes(tag)).length;
      const sameProject = post.data.project && p.data.project === post.data.project ? 3 : 0;
      return { p, score: shared + sameProject };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.date.getTime() - a.p.data.date.getTime())
    .slice(0, n)
    .map((x) => x.p);
}

/** Artículos que cuentan un proyecto del portafolio. */
export async function postsForProject(slug: string): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.data.project === slug);
}
