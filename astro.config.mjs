// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

const SITE = 'https://portfolio.rossmel.top';

/** Fecha de cada artículo (updated ?? date) para el <lastmod> del sitemap. */
function blogDates() {
  const dates = new Map();
  for (const [dir, prefix] of [['src/content/blog', '/blog/'], ['src/content/blog/en', '/en/blog/']]) {
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const fm = readFileSync(`${dir}/${f}`, 'utf-8').split('---')[1] ?? '';
      const d = fm.match(/^updated:\s*(\S+)/m)?.[1] ?? fm.match(/^date:\s*(\S+)/m)?.[1];
      if (d) dates.set(`${SITE}${prefix}${f.replace(/\.md$/, '')}/`, new Date(d).toISOString());
    }
  }
  return dates;
}
const postDates = blogDates();

// SITE: dominio final del portafolio. Ver README → "Despliegue".
export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize: (item) => {
        const lastmod = postDates.get(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
