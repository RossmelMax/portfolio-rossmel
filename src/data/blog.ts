import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './profile';
import { paths } from './i18n';

export type Post = CollectionEntry<'blog'>;

const byPinnedThenDate = (a: Post, b: Post) =>
  Number(b.data.pinned) - Number(a.data.pinned) ||
  b.data.date.getTime() - a.data.date.getTime() ||
  a.data.title.localeCompare(b.data.title);

async function allPosts(): Promise<Post[]> {
  return getCollection('blog', ({ data }) => !data.draft);
}

/** Artículos publicados de un idioma: fijados primero y luego del más nuevo al más viejo. */
export async function getPosts(lang: Lang = 'es'): Promise<Post[]> {
  return (await allPosts()).filter((p) => p.data.lang === lang).sort(byPinnedThenDate);
}

/** Slug de la URL: los artículos EN viven en src/content/blog/en/ (id "en/<slug>"). */
export const postSlug = (p: Post) => p.id.replace(/^en\//, '');
export const postUrl = (p: Post) => paths.post(postSlug(p), p.data.lang);

/** El mismo artículo en el otro idioma, si existe. */
export async function getTranslation(p: Post): Promise<Post | undefined> {
  const all = await allPosts();
  return p.data.lang === 'es' ? all.find((x) => x.data.translationOf === p.id) : all.find((x) => x.id === p.data.translationOf);
}

/** URL de un artículo (por su id en español) en el idioma pedido; cae a la versión ES si no hay traducción. */
export async function postUrlById(esId: string, lang: Lang): Promise<string> {
  const all = await allPosts();
  const es = all.find((x) => x.id === esId);
  const target = lang === 'en' ? all.find((x) => x.data.translationOf === esId) ?? es : es;
  return target ? postUrl(target) : paths.blog(lang);
}

/** Minutos de lectura aproximados (~200 palabras por minuto). */
export function readingTime(body = ''): number {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
}

export function fmtDate(d: Date, lang: Lang) {
  return d.toLocaleDateString(lang === 'es' ? 'es-BO' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
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

/** Artículos relacionados del mismo idioma: mismo proyecto pesa más que cada etiqueta compartida. */
export function relatedPosts(post: Post, posts: Post[], n = 3): Post[] {
  return posts
    .filter((p) => p.id !== post.id && p.data.lang === post.data.lang)
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

/** Artículos que cuentan un proyecto del portafolio, en el idioma de la página. */
export async function postsForProject(slug: string, lang: Lang): Promise<Post[]> {
  return (await getPosts(lang)).filter((p) => p.data.project === slug);
}

/** Índice de búsqueda y RSS: compartidos por /blog/ y /en/blog/. */
export async function searchIndex(lang: Lang) {
  return (await getPosts(lang)).map((p) => ({ id: p.id, text: normalize(plainText(p.body)) }));
}
