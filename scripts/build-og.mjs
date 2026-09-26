/**
 * Genera public/og.png (1200×630), la imagen que se ve al compartir el link.
 * Uso: npm run og   (usa el mismo Chromium que cv:pdf)
 * Los textos están aquí (no en profile.ts) para no depender de TypeScript en Node.
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

// Fuentes incrustadas en base64 (setContent no puede leer file://).
const font = (pkg, file) => `data:font/woff2;base64,${readFileSync(`node_modules/${pkg}/files/${file}`).toString('base64')}`;
const html = `<!doctype html><html><head><style>
@font-face { font-family: SG; src: url(${font('@fontsource-variable/space-grotesk', 'space-grotesk-latin-wght-normal.woff2')}); font-weight: 300 700; }
@font-face { font-family: JB; src: url(${font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff2')}); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #0a0a0b; color: #ededea; font-family: SG; position: relative; overflow: hidden; }
.glow { position: absolute; inset: 0; background:
  radial-gradient(60% 80% at 85% 10%, rgba(200,255,46,.35), transparent 60%),
  radial-gradient(50% 60% at 100% 100%, rgba(200,255,46,.12), transparent 70%); }
.wrap { position: absolute; inset: 64px; display: flex; flex-direction: column; justify-content: space-between; }
.k { font-family: JB; font-size: 22px; letter-spacing: .08em; text-transform: uppercase; color: #8a8a86; display: flex; align-items: center; gap: 14px; }
.dot { width: 14px; height: 14px; border-radius: 50%; background: #c8ff2e; }
h1 { font-size: 150px; line-height: .88; letter-spacing: -.045em; font-weight: 700; text-transform: uppercase; }
.row { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(237,237,234,.15); padding-top: 24px; }
.role { font-size: 34px; } .role b { color: #c8ff2e; font-weight: 600; }
.url { font-family: JB; font-size: 22px; color: #8a8a86; }
</style></head><body><div class="glow"></div><div class="wrap">
<div class="k"><span class="dot"></span>Portfolio · Cochabamba, Bolivia</div>
<h1>Rossmel<br>Abasto</h1>
<div class="row"><div class="role">Frontend <b>→</b> Fullstack · IA</div><div class="url">portfolio.rossmel.top</div></div>
</div></body></html>`;

const browser = await chromium.launch({ executablePath: findChromium() });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('✓ public/og.png');
