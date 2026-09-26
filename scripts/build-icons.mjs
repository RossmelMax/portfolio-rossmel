/**
 * Genera los íconos PNG a partir de public/favicon.svg (logo lima sobre fondo oscuro).
 * Uso: npm run icons  → public/apple-touch-icon.png, icon-192.png, icon-512.png, favicon-32.png
 */
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const pw = '/opt/pw-browsers';
  if (existsSync(pw)) for (const d of readdirSync(pw)) {
    const p = `${pw}/${d}/chrome-linux/chrome`;
    if (existsSync(p)) return p;
  }
  for (const bin of ['chromium', 'chromium-browser', 'google-chrome-stable', 'google-chrome']) {
    try { return execSync(`command -v ${bin}`).toString().trim(); } catch {}
  }
  throw new Error('No encontré Chromium. Define CHROMIUM_PATH.');
}

const svg = readFileSync('public/favicon.svg', 'utf8');
const sizes = { 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512, 'favicon-32.png': 32 };
const browser = await chromium.launch({ executablePath: findChromium() });
for (const [file, size] of Object.entries(sizes)) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  // apple-touch-icon sin esquinas redondeadas (iOS aplica su propia máscara)
  const src = file.startsWith('apple') ? svg.replace('rx="220"', 'rx="0"') : svg;
  await page.setContent(`<style>html,body{margin:0;background:transparent}</style>${src.replace('<svg ', `<svg width="${size}" height="${size}" `)}`);
  await page.screenshot({ path: `public/${file}`, omitBackground: true });
  await page.close();
  console.log('✓', file);
}
await browser.close();
