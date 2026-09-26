/**
 * Verificación rápida del sitio construido (correr después de `npm run build`):
 *   npm run verify            → revisa desborde horizontal, marcas ==…== / ((…)) sin procesar,
 *                               errores de JS y que el CV quepa en 2 páginas
 *   npm run verify -- --shots → además guarda capturas en shots/ (ignorado por git)
 * Usa Chromium del sistema o $CHROMIUM_PATH (igual que cv:pdf).
 */
import { existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { serveDist } from './serve-dist.mjs';

const PORT = 4399;
const shots = process.argv.includes('--shots');
const PAGES = [
  '/', '/en/', '/sobre-mi/', '/en/about/', '/blog/', '/en/blog/',
  '/blog/llm-sin-citas-inventadas/', '/en/blog/stopping-an-llm-from-inventing-legal-citations/',
  '/proyectos/advai/', '/proyectos/rubik/', '/en/projects/selflix/', '/cv/', '/en/cv/', '/404.html',
];
const VIEWPORTS = [{ width: 1440, height: 900 }, { width: 390, height: 800 }];

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  for (const c of ['chromium', 'chromium-browser', 'google-chrome-stable', 'google-chrome']) {
    try { return execSync(`command -v ${c}`).toString().trim(); } catch {}
  }
  throw new Error('No encontré Chromium: instala chromium o define CHROMIUM_PATH');
}

if (!existsSync('dist/index.html')) throw new Error('Falta dist/: corre `npm run build` antes');
if (shots) mkdirSync('shots', { recursive: true });

const server = await serveDist(PORT);
const browser = await chromium.launch({ executablePath: findChromium() });
const problems = [];

for (const vp of VIEWPORTS) {
  // reducedMotion: todo visible sin esperar animaciones; 'booted' salta la terminal de arranque
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => sessionStorage.setItem('booted', '1'));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => problems.push(`${vp.width}px ${page.url()}: error JS: ${e.message}`));
  for (const path of PAGES) {
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      leaks: document.body.innerText.match(/==[^=\n]{1,40}==|\(\([^)\n]{1,40}\)\)/g) ?? [],
    }));
    if (r.sw > vp.width) problems.push(`${vp.width}px ${path}: desborde horizontal (${r.sw}px)`);
    if (r.leaks.length) problems.push(`${vp.width}px ${path}: marcas sin procesar: ${r.leaks.join(', ')}`);
    if (shots) await page.screenshot({ path: `shots/${vp.width}${path.replace(/\W+/g, '_')}.png`, fullPage: true });
  }
  await ctx.close();
}

const page = await browser.newPage();
for (const path of ['/cv/', '/en/cv/']) {
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
  const pdf = await page.pdf({ format: 'A4', preferCSSPageSize: true });
  const n = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  if (n > 2) problems.push(`${path}: el CV ocupa ${n} páginas (máximo 2)`);
  else console.log(`✓ ${path} ${n} páginas`);
}

await browser.close();
server.close();
if (problems.length) {
  console.error('✗ Problemas:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`✓ ${PAGES.length} páginas × ${VIEWPORTS.length} anchos sin problemas${shots ? ' (capturas en shots/)' : ''}`);
