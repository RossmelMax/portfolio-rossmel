# CLAUDE.md — portfolio-rossmel

Portafolio + CV de Rossmel Abasto. Idioma de trabajo: **español** (el sitio es ES/EN).
**Para retomar el proyecto: `docs/CONTINUAR.md`** (guía de traspaso). `README.md` = referencia completa.

## Comandos
- `npm run dev` — desarrollo (http://localhost:4321)
- `npm run build` — build estático a `dist/`
- `npm run cv:pdf` — PDFs del CV (después de `build`); usa Chromium del sistema o `$CHROMIUM_PATH`
- `npm run check` — tipos
- `npm run verify` — tras el build: desborde móvil, marcas sin procesar, errores JS, CV ≤ 2 páginas

Antes de dar algo por terminado: `npm run build`, `npm run check` y `npm run verify` sin errores, y si cambió contenido del CV,
`npm run cv:pdf` y commitear los PDF de `public/cv/`.

## Reglas
- **Contenido solo en `src/data/profile.ts`** (textos `{ es, en }`). Nunca hardcodear textos de
  contenido en componentes. Textos de interfaz → `src/data/i18n.ts`.
- Cualquier dato no confirmado por Rossmel va con `// TODO(confirmar)`. No inventar métricas,
  fechas ni logros: preguntar.
- Nunca poner en el sitio información personal/familiar ni secretos (ver repos privados con cuidado:
  los proyectos de clientes se marcan `confidential: true` y no se enlaza código).
- Animaciones: usar los atributos `data-*` de `src/scripts/animations.ts`; respetar
  `prefers-reduced-motion`. Nuevos efectos → añadirlos allí y documentarlos en README.
- El CV (`Resume.astro`) debe seguir siendo ATS-friendly: una columna, sin tablas/íconos/imágenes,
  encabezados estándar, fuente estándar.
- Estilo: tokens de color en `src/styles/global.css` (`--bg`, `--fg`, `--accent`…) → clases
  Tailwind `bg-bg`, `text-fg`, `text-accent`, etc.
- Mantener README.md al día (sección "Estado actual y pendientes" e "Historial de decisiones").
- Artículos nuevos del blog: escribir las dos versiones (ES en `src/content/blog/`, EN en `src/content/blog/en/` con `translationOf`).

## Estado (actualizar al terminar cada sesión)
- v3.3 (sept. 2026): PUBLICADO en portfolio.rossmel.top y cv.rossmel.top. Contenido confirmado (sin TODOs).
- v3.4: foto, menú móvil, sitemap, 404, formulario (/api/contact con Resend + Turnstile).
- v3.5: terminal de arranque, terminal de envío del formulario, arreglos de foto/título/inglés.
- Formulario de contacto y Search Console: configurados y funcionando (sept. 2026).
- v3.6: blog (/blog, Markdown en src/content/blog), 'Lo que aprendí' por proyecto, CTAs y fondo de respaldo en el hero.
- v3.7: correcciones de la revisión de Claude local (móvil 360 px, LCP, blog EN, contraste, validación).
- v3.8: énfasis en programar sin IA (sobre mí, CV, línea de tiempo en Cómo trabajo); blog con buscador, etiquetas, índice, relacionados y 11 artículos (incluye cómo montar un media center con Jellyfin, enlazado desde la tarjeta de Selflix); sección "En vivo" = proyectos con campo `live` (notebook, rubik, selflix, cada uno con su caso de estudio; el resto de subdominios NO va).
- v3.9: blog bilingüe (EN en src/content/blog/en/, `translationOf`), orden (recientes/antiguos/A-Z/Z-A/corta), compartir, giscus opcional (variables PUBLIC_GISCUS_*), SEO reforzado. Siempre "WANT", nunca "la agencia". Ítems de stack traducibles.
- v3.10: foto del Sobre mí en 3 capas con parallax (scripts/build-photo-layers.py; `data-layers` en animations.ts).
- v3.11: Sobre mí resumido + página /sobre-mi/ con la historia (desde mediados de 2020: Derecho en la UMSS, Platzi, Linux/Arch, WANT, IA, hoy); "días programando"; Cómo trabajo = flujo general.
- v3.12: dibujos fine line a mano (src/data/sketches.ts + <Sketch>, anotaciones ==…== y ((…)) en profile.ts).
- v3.13: botón "volver arriba" (ToTop.astro, anillo de progreso) y marcas ==…==/((…)) también en el blog (plugin remark en src/lib/remark-marks.ts, requiere @astrojs/markdown-remark).
- Traspaso: docs/CONTINUAR.md + npm run verify (sept. 2026).
- v3.14: `doodle` por proyecto (galería, lista, En vivo, hero del caso) y <SketchFlight> (estela + dibujo con scroll) en varias secciones; CV con más proyectos (sigue en 2 páginas).
- v3.15: titular del hero nuevo, íconos en CV y ES/EN, botón volver arriba no tapa el footer.
- Flujo de publicación: Claude web sube a su rama y abre un PR a main; Rossmel lo aprueba en GitHub → Cloudflare publica. Antes de avisar, verificar que el PR siga ABIERTO: si ya se fusionó, abrir uno nuevo (los commits posteriores a un merge no aparecen solos).
- v3.16: botón de reducir movimiento en el header (junto al de tema; se guarda y recarga), arreglo del
  nombre del hero "trabado" en hard reload (se escondía hasta que animations.ts corría), y clamp() en
  los títulos con vw (hero, proyectos, contacto, 404) para que no se vean gigantes en monitores anchos
  (1920 px+): el tamaño no cambia hasta 1440 px, de ahí topa en el valor que ya tenía a 1440 px.
- Siguiente: capturas y video de AdvAI (Rossmel); GitHub/LinkedIn (docs/).
- Analítica: inyección automática de Cloudflare, sin token.
- Preguntas abiertas para Rossmel y decisiones por proyecto: `docs/PROYECTOS-CANDIDATOS.md`.
- Despliegue: Cloudflare Pages, proyecto `rossmel-portfolio` conectado a este repo (rama `main`). Ver README → Despliegue.
- Los PDF del CV se commitean (Cloudflare no los genera): tras cambiar contenido, `npm run build && npm run cv:pdf`.
- Este repo es PÚBLICO: no commitear detalles de la infraestructura (hosts, puertos, IPs, túneles).
