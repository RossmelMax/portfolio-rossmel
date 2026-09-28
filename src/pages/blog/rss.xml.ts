import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postUrl } from '../../data/blog';

export async function GET(context: APIContext) {
  const posts = await getPosts('es');
  return rss({
    title: "Blog de Rossmel Abasto",
    description: 'Notas de lo que construyo: frontend, fullstack, IA y Linux.',
    site: context.site!,
    customData: '<language>es-bo</language>',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: postUrl(p),
      categories: p.data.tags,
    })),
  });
}
