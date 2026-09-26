/**
 * Genera los PDF del CV (ES y EN) a partir de /cv y /en/cv.
 * Uso:  npm run build && npm run cv:pdf
 *
 * Sirve dist/ con un servidor estático local, abre Chromium sin interfaz e imprime a PDF.
 * Los PDF quedan en public/cv/ (se versionan) y en dist/cv/ (listos para desplegar).
 *
 * Chromium: usa $CHROMIUM_PATH si existe; si no, busca uno instalado en el sistema.
 */
import { execSync } from 'node:child_process';
import { mkdirSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { serveDist } from './serve-dist.mjs';

const PORT = 4329;
const OUT = ['public/cv', 'dist/cv'];

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  // Entorno cloud de Claude Code
  const pw = '/opt/pw-browsers';
  if (existsSync(pw)) {
    for (const d of readdirSync(pw)) {
      const p = `${pw}/${d}/chrome-linux/chrome`;
      if (existsSync(p)) return p;
    }
  }
  for (const bin of ['chromium', 'chromium-browser', 'google-chrome-stable', 'google-chrome']) {
    try { return execSync(`command -v ${bin}`).toString().trim(); } catch { /* sigue */ }
  }
  throw new Error('No encontré Chromium. Instálalo (sudo pacman -S chromium) o define CHROMIUM_PATH.');
}

if (!existsSync('dist/cv/index.html')) throw new Error('No existe dist/. Corre primero: npm run build');
const server = await serveDist(PORT);

const browser = await chromium.launch({ executablePath: findChromium() });
try {
  for (const lang of ['es', 'en']) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${lang === 'es' ? '/cv/' : '/en/cv/'}`, { waitUntil: 'networkidle' });
    const file = `Rossmel-Abasto-CV-${lang.toUpperCase()}.pdf`;
    mkdirSync(OUT[0], { recursive: true });
    await page.pdf({ path: `${OUT[0]}/${file}`, format: 'A4', printBackground: false, preferCSSPageSize: true });
    if (existsSync('dist')) {
      mkdirSync(OUT[1], { recursive: true });
      copyFileSync(`${OUT[0]}/${file}`, `${OUT[1]}/${file}`);
    }
    console.log('✓', file);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
