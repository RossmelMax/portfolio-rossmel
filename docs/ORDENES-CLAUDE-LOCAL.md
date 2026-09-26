# Órdenes para Claude Code local: publicar en Cloudflare Pages

Contexto: el portafolio y el CV viven en **este repo** (`rossmelabasto/portfolio-rossmel`, Astro 7),
construido en sesiones de Claude Code web. Se publica con **un solo** proyecto de Cloudflare Pages
conectado a Git, con dos dominios. Todo el detalle está en `README.md` → "Despliegue".

Pega esto en Claude Code local:

```text
Lee README.md (sección "Despliegue"), CLAUDE.md y este archivo del repo rossmelabasto/portfolio-rossmel.
Vamos a publicarlo en Cloudflare Pages. Haz esto en orden y pídeme confirmación antes de cualquier
paso irreversible o que toque producción:

1. Repo "rossmel-web": ya no se usa (duplicaba el sitio). No crees proyectos de Pages para él.
   Propónme archivarlo en GitHub (no borrarlo) y actualiza tu memoria: el sitio vive en
   portfolio-rossmel.

2. Clona/actualiza portfolio-rossmel en ~/code/portfolio-rossmel. Verifica en local:
   npm ci && npm run check && npm run build && npm run cv:pdf
   (cv:pdf usa Chromium del sistema o $CHROMIUM_PATH). Si los PDF de public/cv/ cambian, avísame.
   Abre `npx astro preview` y revisa /, /en/, /cv/, /en/cv/ y un caso de estudio.

3. Lleva la rama de trabajo a main (main solo tiene el commit inicial, debe ser fast-forward):
   git fetch origin && git checkout main && git merge --ff-only origin/claude/magical-davinci-m366bp
   Muéstrame el log y, con mi OK, git push origin main. No toques la rama master (es la v1 de 2022).

4. Cloudflare (en mi Chrome o guiándome paso a paso): Workers & Pages → Create → Pages →
   Connect to Git (NUNCA Direct Upload). Autoriza solo el repo portfolio-rossmel.
   - Nombre: rossmel-portfolio · rama de producción: main
   - Build: npm run build · Output: dist · Root: vacío · Variable NODE_VERSION=22
   Espera el primer deploy y revisa el log de build.

5. Custom domains del proyecto: portfolio.rossmel.top y cv.rossmel.top (desde Pages, sin crear
   CNAME a mano).

6. Redirect Rule: rossmel.top y www.rossmel.top → 301 a https://portfolio.rossmel.top (conservar
   la ruta). Si el apex no tiene un registro DNS proxied, crea el mínimo necesario para que la
   regla aplique y explícame qué creaste.

7. Verifica y repórtame:
   curl -sI https://portfolio.rossmel.top           → 200
   curl -s  https://cv.rossmel.top | grep -o "<title>[^<]*"   → debe ser el CV
   curl -sI https://cv.rossmel.top/cv/Rossmel-Abasto-CV-ES.pdf → 200, application/pdf
   curl -sI https://rossmel.top                     → 301 a portfolio
   Y abre una PR de prueba o push a otra rama para confirmar que crea una URL de vista previa.

8. Capturas para el portafolio (no las subas al repo todavía, déjalas en
   ~/Pictures/portfolio/ para que yo las revise): AdvAI, SGPG, Link'u (sin datos reales de
   vecinos) y rOS (escritorio, fastfetch, pantalla de arranque). Ancho ≥ 1600 px, 16:10.

Al final dame un resumen corto: qué quedó, URLs y cualquier error.
```

Después de publicar: cada push a `main` despliega solo. Si cambia contenido del CV, antes del push:
`npm run build && npm run cv:pdf` y commitear `public/cv/*.pdf`.
