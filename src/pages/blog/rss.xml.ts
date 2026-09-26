import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../../data/blog';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Blog de Rossmel Abasto',
    description: 'Notas de lo que construyo: frontend, fullstack, IA y Linux.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.id}/`,
      categories: p.data.tags,
    })),
  });
}
