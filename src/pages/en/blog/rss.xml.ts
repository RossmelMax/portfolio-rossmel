import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postUrl } from '../../../data/blog';

export async function GET(context: APIContext) {
  const posts = await getPosts('en');
  return rss({
    title: "Rossmel Abasto's blog",
    description: 'Notes on what I build: frontend, fullstack, AI and Linux.',
    site: context.site!,
    customData: '<language>en-us</language>',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: postUrl(p),
      categories: p.data.tags,
    })),
  });
}
