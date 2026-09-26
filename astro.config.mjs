// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// SITE: dominio final del portafolio. Ver README → "Despliegue".
export default defineConfig({
  site: 'https://portfolio.rossmel.top',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});
