// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// SITE: dominio final del portafolio. Ver README → "Despliegue".
export default defineConfig({
  site: 'https://portfolio.rossmel.top',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'vitesse-dark' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
