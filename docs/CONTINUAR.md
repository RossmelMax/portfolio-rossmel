# Guía para continuar el proyecto (Claude Code local)

Documento de traspaso: todo lo necesario para seguir trabajando en el portafolio y el CV sin el
historial de las sesiones anteriores. Estado a **fines de sept. 2026 (v3.14)**.

Orden de lectura sugerido: **este archivo → `CLAUDE.md` → `README.md`** (referencia completa) →
`docs/PROYECTOS-CANDIDATOS.md` (estado de cada proyecto).

---

## 1. Qué es y dónde vive

| | |
|---|---|
| Portafolio | https://portfolio.rossmel.top (ES) · `/en/` (EN) |
| CV | https://cv.rossmel.top (= `/cv/`) · `/en/cv/` · PDF en `/cv/Rossmel-Abasto-CV-{ES,EN}.pdf` |
| Blog | `/blog/` · `/en/blog/` (11 artículos, cada uno en ES y EN) |
| Repo | `rossmelabasto/portfolio-rossmel` (**público**) · rama `main` = producción |
| Hosting | Cloudflare Pages, proyecto `rossmel-portfolio`; cada push a `main` publica solo |
| Stack | Astro 7 (estático) · Tailwind 4 · GSAP + Lenis · rough.js (en el build) · TypeScript |

La rama `master` es la v1 (Angular 2022): no tocarla.

## 2. Arranque

```bash
git clone git@github.com:rossmelabasto/portfolio-rossmel.git && cd portfolio-rossmel
npm install                      # Node ≥ 22.12 (hay .nvmrc)
npm run dev                      # http://localhost:4321
```

Comandos del día a día:

| Comando | Para qué |
|---|---|
| `npm run build` | build estático a `dist/` (siempre antes de dar algo por terminado) |
| `npm run check` | tipos (debe dar 0 errores) |
| `npm run verify` | después del build: desborde en 1440/390 px, marcas `==…==` sin procesar, errores de JS, CV ≤ 2 páginas. `-- --shots` guarda capturas en `shots/` |
| `npm run cv:pdf` | regenera los PDF del CV (después del build). **Commitear `public/cv/*.pdf`** |
| `npm run og` / `npm run icons` | imagen para compartir / íconos |

`cv:pdf` y `verify` usan Chromium del sistema (`sudo pacman -S chromium` en Arch) o `$CHROMIUM_PATH`.

## 3. Cómo se publica

- **Sesiones web de Claude:** trabajan en una rama `claude/…`, abren un PR a `main` y Rossmel lo
  aprueba en GitHub → Cloudflare publica. Si el PR anterior ya se fusionó, se abre uno **nuevo**
  (los commits posteriores a un merge no aparecen solos).
- **Claude local:** lo mismo es lo más seguro (rama + PR). Si Rossmel lo pide explícitamente, se puede
  hacer push directo a `main`, pero eso publica en producción al instante: antes, `build` + `check` +
  `verify` sin errores.
- Checklist antes de publicar:
  1. `npm run build && npm run check && npm run verify`
  2. Si cambió algo que sale en el CV: `npm run cv:pdf` y commitear los PDF (Cloudflare no tiene Chromium).
  3. Actualizar `README.md` (historial de decisiones) y la sección "Estado" de `CLAUDE.md`.

## 4. Mapa del código

```
src/data/profile.ts     ← TODO el contenido ES/EN: profile, experience, education, skills, projects,
                          workflow, journey, story. Única fuente para portafolio y CV.
src/data/i18n.ts        ← textos de interfaz (ui.es / ui.en), rutas (paths), fmtMonth
src/data/blog.ts        ← helpers del blog: getPosts, postUrl, getTranslation, relatedPosts, searchIndex…
src/data/sketches.ts    ← dibujos a mano (rough.js), marcas (MARK_RE, stripMarks, markHtml), trailPaths
src/lib/remark-marks.ts ← plugin: ==…== y ((…)) dentro de los .md del blog
src/content/blog/*.md   ← artículos ES · src/content/blog/en/*.md ← EN (translationOf)
src/components/
  Home.astro            ← orden de la home: Hero, About, Experience, Projects, LiveSites, Stack,
                          Workflow, BlogTeaser, Contact
  ProjectPage.astro     ← caso de estudio (/proyectos/<slug>/, /en/projects/<slug>/)
  AboutPage.astro       ← /sobre-mi/ y /en/about/ (story + journey)
  BlogIndex / BlogPost  ← portada y artículo
  Resume.astro          ← el CV (ATS: una columna, sin íconos/tablas, Arial)
  Sketch.astro          ← un dibujo · SketchFlight.astro ← estela + dibujo que cruza el texto
  Marked.astro          ← texto con ==subrayado== / ((círculo)) · ToTop.astro ← volver arriba
  PhotoLayers.astro     ← foto en 3 capas con parallax
src/scripts/animations.ts ← GSAP/Lenis, se activa con atributos data-* (tabla en README)
src/scripts/shader.ts     ← fondo WebGL del hero (con respaldo CSS)
src/layouts/Base.astro    ← <head>, SEO, JSON-LD, tema, ToTop
functions/                ← Pages Functions: _middleware.js (cv.), api/contact.js (Resend + Turnstile)
scripts/                  ← cv:pdf, og, icons, verify, build-photo-layers.py, serve-dist
```

## 5. Recetas

**Cambiar un texto** → `src/data/profile.ts` (contenido) o `src/data/i18n.ts` (interfaz). Siempre las
dos lenguas. Nunca texto de contenido dentro de un componente.

**Agregar un proyecto** → copiar un objeto de `projects` en `profile.ts`:
- `slug` único (va en la URL);
- `featured` (galería) o lista;
- `cv` (entra al CV; comprobar que siga en 2 páginas con `npm run verify`);
- `confidential` para clientes (sin enlaces a código);
- `live` si corre en un subdominio;
- `accent` (color);
- `doodle` (dibujo, ver abajo);
- `draft: true` si falta confirmar.

La página del caso se genera sola.

**Agregar un dibujo** → en `sketches.ts`, un `viewBox` (normalmente `0 0 100 100`) y `shapes` con
primitivas de rough.js (`line`, `linearPath`, `curve`, `circle`, `ellipse`, `rectangle`, `polygon`,
`path`). Usar con `<Sketch name="…" />`, que se dibuja al entrar en pantalla:
- `draw="scrub"`: se dibuja al ritmo del scroll;
- `draw={false}`: estático;
- un ancestro con `data-draw-host`: se redibuja al pasar el mouse.

Para uno que cruza el texto como el avión:
```astro
<SketchFlight icon="cube" seed={1} variant={0|1|2} class="pointer-events-none absolute right-4 top-16 h-auto w-[48vw] max-w-[26rem] text-accent opacity-80 md:right-10" />
```
El contenedor tiene que ser `relative`. Si hay algo `sticky` dentro, no usar `overflow-hidden`.

Dibujos disponibles:

| Grupo | Dibujos |
|---|---|
| Cómo trabajo | `understand`, `design`, `build`, `measure`, `ship` (cohete) |
| Historia | `laptop`, `linux`, `work`, `spark`, `homelab` |
| Stack | `browser`, `database`, `terminal` |
| Detalles | `waves`, `swipe`, `scribble`, `flight`, `cup`, `hook`, `star`, `bulb`, `pencil`, `question`, `up`, `ring` |
| Proyectos | `cube`, `notebook`, `tv`, `scales`, `car`, `gradcap`, `drop`, `megaphone`, `plate`, `dumbbell`, `calendar`, `bag`, `heart`, `pin` |
| Anotaciones | `circle`, `underline`, `arrow` |

**Subrayar o encerrar una frase** → en `profile.ts` o en un `.md` del blog:
- `==frase==` subraya a mano;
- `((frase))` encierra en un círculo a mano.

Reglas:
- Frases cortas (≤ ~35 caracteres, no se parten de línea).
- 1–2 por artículo.
- Nunca en títulos `##` ni en código.
- El CV, las meta descripciones, el JSON-LD y el buscador las quitan solos (`stripMarks`).

**Escribir un artículo** → versión ES en `src/content/blog/<slug>.md` y versión EN en
`src/content/blog/en/<slug-en>.md`.
- Frontmatter: `title`, `description`, `date`, `tags`, `lang`, `translationOf: '<slug ES>'` (solo en el EN), `project: '<slug>'` opcional y `pinned` opcional.
- Estructura: problema real → decisión clave → código simplificado → "Lo que aprendí".
- Reusar las etiquetas existentes.

**Nueva animación** → añadir el efecto en `animations.ts` con su atributo `data-*`, respetar
`prefers-reduced-motion` y documentarlo en la tabla del README.

**Foto del "Sobre mí"** → `scripts/build-photo-layers.py` (ver README → Foto en capas). Las fotos
fuente NO se suben al repo (muestran la casa); las tiene Rossmel.

## 6. Reglas y preferencias de Rossmel (importantes)

**Contenido**
- No inventar datos, métricas, fechas ni logros: preguntar. Lo no confirmado lleva `// TODO(confirmar)`
  en un comentario; hoy el único es `codingSince` (≈ mediados de 2020).
- Empezó a programar **a mediados de 2020** (no 2019), en pandemia, estudiando Derecho en la UMSS;
  Platzi ("Nunca pares de aprender"), YouTube (Programación ATS, midudev), Linux/Arch; luego WANT (2022).
- **Tono:** transmitir que programa desde antes de la IA y **entiende lo que la IA genera**, pero sin
  frases absolutas ni "no soy vibe coder" (le parece contraproducente). Usar "de forma autodidacta".
- Siempre **"WANT"** o **"WANT Digital Agency"**, nunca "la agencia". El "Sobre mí" no gira en torno a
  WANT: entró ya sabiendo desarrollo web.
- "Cómo trabajo" es su flujo general (entender → diseñar → construir → medir → entregar); la IA es una parte.

**Privacidad y seguridad**
- Nada personal ni familiar en el sitio. No nombrar a clientes privados (p. ej. la clienta de diseño gráfico).
- Proyectos de clientes: `confidential: true`, sin enlaces a código.
- El repo es **público**: nada de infraestructura (hosts internos, puertos, IPs, túneles, rutas del servidor).
- Secretos solo en Cloudflare (Variables and Secrets); nunca en archivos ni en el chat.
- Subdominios que SÍ se muestran ("En vivo"): notebook, rubik, selflix. Los demás no (music, mcu,
  waitlist, stream, chat, admin, admin-music, ssh, ori, class, s, test).

**Diseño**
- Oscuro + acento lima (violeta en modo claro); JetBrains Mono para texto, Space Grotesk en titulares.
- Dibujos a mano: le encantan. Deben acompañar palabras clave y el scroll, "sin saturar". Le gustó
  especialmente el avión que cruza el título de Contacto: se replicó con el dibujo que corresponde a cada sección.
- El CV no lleva dibujos: siempre ATS-friendly y en **máximo 2 páginas**.

## 7. Estado y pendientes

Hecho: ver "Estado" en `CLAUDE.md` (v3.3 → v3.14) e "Historial de decisiones" en el README.

Pendiente:

| Tarea | Detalle |
|---|---|
| Capturas y video de AdvAI (y capturas de otros proyectos) | Las pasa Rossmel. Para usarlas: campo `image` en `Project` + `<Image />` dentro de `[data-card-media]` en `Projects.astro` |
| Perfil de GitHub y LinkedIn | `docs/github-profile/INSTRUCCIONES.md` y `docs/LINKEDIN.md` |
| Search Console | Pedir indexación de los artículos EN y reenviar el sitemap |
| Comentarios con giscus (opcional) | README → Blog → Comentarios |
| Lighthouse | Meta ≥ 95 y revisar el uso con teclado |
| Confirmar `codingSince` | Fecha exacta en que empezó a programar |
| Ideas por consultar con Rossmel | Más artículos (uno por proyecto nuevo); orden de los proyectos en el CV; dibujos en la 404 |

## 8. Trampas conocidas

- **Astro 7 + remark:** `markdown.remarkPlugins` necesita el paquete `@astrojs/markdown-remark`
  (el procesador por defecto es Sätteri). Si se borra, el build falla.
- **`data-count` está reservado** para contadores animados; el contador del blog usa `data-results`.
- **Dibujos al final de la página:** el trigger es `top 97%` para que se dibujen aunque no haya más scroll.
- **Galería horizontal:** los dibujos de las tarjetas se trazan cuando entra la sección (no por
  tarjeta); al pasar el mouse se vuelven a trazar.
- **Color por proyecto:** en `ProjectPage` usar `text-[var(--accent)]`, no `text-accent`, porque este
  último se resuelve con el lima global.
- **`overflow-hidden` rompe `sticky`:** en `/sobre-mi/` la foto es sticky, por eso ese `main` solo es `relative`.
- **Marcas largas:** los spans son `whitespace-nowrap`; una frase larga desborda en celular
  (`npm run verify` lo detecta).
- **Arranque de animaciones:** primero la entrada del nombre y luego el resto, en pedazos de ~8 ms
  (`runChunked`). No volver a prepararlo todo junto: en celulares se veía a trompicones.
- **Los PDF del CV se versionan:** si no se regeneran tras un cambio, el PDF publicado queda desactualizado.
- **Capturas con Playwright:** usar `reducedMotion: 'reduce'` y `sessionStorage.booted = '1'` (así lo
  hace `scripts/verify.mjs`); si no, sale la terminal de arranque o el contenido a medio animar.
