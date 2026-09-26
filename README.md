# portfolio-rossmel · v3

Portafolio y CV de **Rossmel Abasto**.

- Portafolio → `portfolio.rossmel.top` (animado, ES/EN)
- CV → `cv.rossmel.top` (compatible con ATS, HTML + PDF, ES/EN)

> La v1 (Angular 13, 2022) está en la rama `master`. Esta v3 se construyó desde cero.

---

## Índice

1. [Arranque rápido](#arranque-rápido)
2. [Stack y por qué](#stack-y-por-qué)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Cómo editar el contenido](#cómo-editar-el-contenido)
5. [Animaciones: cómo funcionan](#animaciones-cómo-funcionan)
6. [El CV (ATS)](#el-cv-ats)
7. [Idiomas (ES/EN)](#idiomas-esen)
8. [Despliegue en rossmel.top](#despliegue-en-rossmeltop)
9. [Estado actual y pendientes](#estado-actual-y-pendientes)
10. [Continuar con Claude Code local](#continuar-con-claude-code-local)
11. [Historial de decisiones](#historial-de-decisiones)

---

## Arranque rápido

Requisitos: **Node.js ≥ 22.12** y Chromium (solo para generar el PDF del CV).

```bash
npm install
npm run dev          # http://localhost:4321  (recarga en vivo)
npm run build        # genera el sitio estático en dist/
npm run cv:pdf       # genera los PDF del CV (requiere build previo)
npm run check        # verificación de tipos de Astro/TS
npm run og           # regenera public/og.png (imagen al compartir el link)
npm run icons        # regenera los íconos PNG desde public/favicon.svg
```

Flujo típico para publicar: `npm run build && npm run cv:pdf` → subir `dist/`.

En Arch: `sudo pacman -S nodejs npm chromium`. Si Chromium está en otra ruta:
`CHROMIUM_PATH=/ruta/a/chrome npm run cv:pdf`.

---

## Stack y por qué

| Pieza | Elección | Motivo |
|---|---|---|
| Framework | **Astro 7** | Genera HTML estático: carga rapidísima, buen SEO, cero JS salvo donde hace falta |
| Estilos | **Tailwind CSS v4** (vía `@tailwindcss/vite`) | Tokens en CSS (`src/styles/global.css`), sin archivo de config |
| Animación | **GSAP 3** (ScrollTrigger + SplitText) | El estándar para animaciones al scroll; ahora es 100% gratis, plugins incluidos |
| Smooth scroll | **Lenis** | Scroll suave sincronizado con ScrollTrigger |
| Hero | **Shader WebGL propio** (`src/scripts/shader.ts`) | Efecto "tinta líquida" que sigue el mouse sin cargar three.js |
| Fuentes | Space Grotesk (display), Inter (texto), JetBrains Mono (detalles) | Autoalojadas con `@fontsource` (sin Google Fonts en runtime) |
| Transiciones | View Transitions API (CSS `@view-transition`) | Transición entre páginas sin JS extra |
| PDF del CV | **playwright-core** + Chromium | Imprime la página `/cv` → PDF con texto real (lo leen los ATS) |

No hay React/Vue: todo es Astro + TypeScript. Si algún día se necesita una isla interactiva compleja,
se puede añadir `@astrojs/react`.

---

## Estructura del proyecto

```
src/
  data/
    profile.ts        ← TODO EL CONTENIDO (experiencia, proyectos, skills…) en ES/EN
    i18n.ts           ← textos de la interfaz, rutas por idioma, formato de fechas
  styles/global.css   ← tokens de diseño (colores, fuentes), grano, cursor, marquee
  layouts/Base.astro  ← <head>, SEO, JSON-LD, tema, carga de animaciones
  components/
    Home.astro        ← compone la página principal (se usa en / y /en/)
    Nav, Preloader, Hero, About, Experience, Projects, Stack, Workflow, Contact
    ProjectPage.astro ← plantilla de caso de estudio (/proyectos/<slug>)
    Resume.astro      ← el CV (ATS)
  scripts/
    animations.ts     ← GSAP + Lenis; se activa con atributos data-*
    shader.ts         ← fondo WebGL del hero
  pages/
    index.astro, cv.astro, proyectos/[slug].astro      (ES)
    en/index.astro, en/cv.astro, en/projects/[slug].astro (EN)
public/
  favicon.svg
  cv/Rossmel-Abasto-CV-{ES,EN}.pdf   ← generados por npm run cv:pdf
scripts/
  build-cv-pdf.mjs    ← genera los PDF
  serve-dist.mjs      ← servidor estático mínimo que usa el script anterior
docs/
  PROYECTOS-CANDIDATOS.md   ← lista filtrada de repos para decidir qué mostrar
CLAUDE.md             ← instrucciones para Claude Code (local o nube)
```

### Rutas generadas

| Ruta | Qué es |
|---|---|
| `/` · `/en/` | Portafolio |
| `/proyectos/<slug>/` · `/en/projects/<slug>/` | Caso de estudio de cada proyecto |
| `/cv/` · `/en/cv/` | CV en HTML (imprimible) |
| `/blog/` · `/en/blog/` · `/blog/<slug>/` · `/blog/rss.xml` | Blog (portada ES/EN; artículos en su idioma) |
| `/404.html` | Página de error propia (ES+EN) |
| `/api/contact` | Formulario de contacto (Pages Function) |
| `/cv/Rossmel-Abasto-CV-ES.pdf` · `…-EN.pdf` | CV en PDF |

---

## Cómo editar el contenido

**Todo está en `src/data/profile.ts`.** No hace falta tocar componentes para cambiar textos.

- Cada texto traducible es `{ es: '…', en: '…' }`.
- **Experiencia** → array `experience`. `cv: true` = aparece en el CV.
- **Proyectos** → array `projects`:
  - `featured: true` → tarjeta grande en la galería horizontal. `false` → lista de abajo.
  - `cv: true` → aparece en el CV (mantener 3–5 para que quepa en 2 páginas).
  - `confidential: true` → muestra "Código privado".
  - `accent` → color del caso de estudio y de la tarjeta.
  - `links` → demo, repo, Play Store… (opcional).
  - `draft: true` → oculto en todo el sitio y el CV (pendiente de confirmar). Vale también para
    `experience` y `education`. En componentes usar `visibleProjects`, nunca `projects` directo.
- **Habilidades** → `skills` (agrupadas; el CV las lista igual → buenas palabras clave para ATS).
- `// TODO(confirmar)` marca datos que Rossmel aún debe confirmar. Buscar con:
  `grep -rn "TODO" src/data`. Regla: el TODO va en un **comentario**, nunca dentro del texto visible
  (tras `npm run build`, `grep -rl TODO dist` debe salir vacío).

Para agregar un proyecto: copia un objeto del array `projects`, cambia `slug` (único, en minúsculas,
se usa en la URL) y los textos. La página del caso de estudio se genera sola.

### Imágenes de proyectos (pendiente)
Las tarjetas usan degradados del color `accent`. Para usar capturas reales: agregar un campo
`image` al tipo `Project`, poner los archivos en `src/assets/projects/` y usar `<Image />` de
`astro:assets` dentro de `[data-card-media]` en `Projects.astro` (el zoom al hacer scroll ya
está aplicado a ese elemento).

---

## Animaciones: cómo funcionan

`src/scripts/animations.ts` se carga en todas las páginas (salvo el CV) y activa efectos según
atributos HTML. Para animar algo nuevo, basta con añadir el atributo (ojo: estos nombres están
reservados; `data-count` sin valor anima a 0, por eso el contador del blog usa `data-results`).

Orden de arranque: primero la entrada del nombre (hero); el resto de animaciones se prepara **después**
(al terminar la entrada, al primer scroll/toque o a los 1,6 s) y **en pedazos de ~8 ms** (`runChunked`).
Prepararlas todas juntas congelaba el hero ~300–400 ms en celulares (se veía "a trompicones"):

| Atributo | Efecto |
|---|---|
| `data-split` | Título que entra línea por línea (SplitText + máscara) |
| `data-reveal` (+ `data-reveal-delay="0.2"`) | Sube y aparece al entrar en pantalla |
| `data-words` | Párrafo cuyas palabras se "encienden" según el scroll |
| `data-horizontal` + `data-track` | Sección fijada con scroll horizontal (solo ≥768px) |
| `data-card` + `data-card-media` | Zoom del fondo de la tarjeta dentro del scroll horizontal |
| `data-timeline` + `data-progress` | Barra de progreso vertical de la experiencia |
| `data-parallax="0.3"` | Parallax |
| `data-count="42"` (+ `data-suffix="+"`) | Contador numérico |
| `data-magnetic` | Botón magnético (sigue al cursor) |
| `data-hover` | Agranda el cursor personalizado |

Otros detalles:
- **Arranque tipo terminal** (`Preloader.astro` + `initPreloader()`): escribe `./portfolio --start` y
  cuatro líneas `[ ok ]` (textos en `i18n.ts → boot`); ~2 s, se salta con clic/tecla, solo la primera
  visita de la sesión (`sessionStorage`; la clase `booted` en `<html>` evita que parpadee después).
- **Envío del formulario como script**: un `<dialog>` tipo terminal muestra los pasos reales del envío
  (validación → antispam+envío → respuesta HTTP real del servidor). Textos en `i18n.ts → contact.term`.
- **Nav** se oculta al bajar y reaparece al subir.
- **Cursor** personalizado solo con mouse (no en táctil).
- **`prefers-reduced-motion`**: se desactivan Lenis, preloader y animaciones; el contenido se
  ve completo y estático. Respetar esto siempre al añadir efectos.
- Tema oscuro por defecto; botón ◐ cambia a claro y se guarda en `localStorage`.

---

## El CV (ATS)

`src/components/Resume.astro` sigue las reglas que usan los lectores automáticos (ATS):

- una sola columna y orden de lectura lineal
- encabezados estándar: Resumen profesional, Habilidades técnicas, Experiencia laboral, Proyectos,
  Educación, Idiomas
- sin tablas, íconos, imágenes, columnas ni texto dentro de gráficos
- fuente estándar (Arial/Helvetica), texto seleccionable; el PDF sale de Chromium con capa de texto
- fechas homogéneas "mes año – mes año"
- flechas y símbolos raros se reemplazan automáticamente (`clean()` en `Resume.astro`)

Regenerar PDFs tras cualquier cambio de contenido: `npm run build && npm run cv:pdf`
(los PDF se guardan en `public/cv/` —se versionan— y en `dist/cv/`).

Consejos de contenido: bullets con **verbo + qué + resultado (con número)**; adaptar el resumen
y el orden de skills a cada oferta; máximo 2 páginas.

---

## Idiomas (ES/EN)

- Español es el idioma por defecto (sin prefijo); inglés vive en `/en/…`.
- Cada página enlaza su versión en el otro idioma (`hreflang` + botón ES/EN).
- Rutas centralizadas en `paths` de `src/data/i18n.ts`.

---

## Despliegue en rossmel.top

El sitio es **100% estático** (`dist/`). Objetivo:

| Subdominio | Sirve |
|---|---|
| `portfolio.rossmel.top` | `dist/` completo |
| `cv.rossmel.top` | la ruta `/cv/` (o redirección a `portfolio.rossmel.top/cv/`) |

Contexto conocido (sept. 2026): el DNS de `rossmel.top` está en **Cloudflare** (registrador:
Spaceship) y el certificado comodín `*.rossmel.top` ya lo emite Cloudflare. El servidor casero está
detrás de **CGNAT** (no se pueden abrir puertos) y publica servicios con un **Cloudflare Tunnel**.
(Detalles de la infraestructura: NO se documentan aquí porque este repo es público.)

✅ **Decisión: Cloudflare Pages** (sept. 2026). Un **solo** proyecto de Pages conectado a este repo,
con los dos dominios. (Se descartaron el servidor casero —CGNAT, poca RAM, cortes de luz— y el repo
aparte `rossmel-web`, que duplicaba el sitio.)

| Ajuste | Valor |
|---|---|
| Proyecto | `rossmel-portfolio` (Workers & Pages → Create → Pages → **Connect to Git**; nunca "Direct Upload": no se puede pasar a Git después) |
| Repo / rama de producción | `rossmelabasto/portfolio-rossmel` · `main` |
| Framework preset | Astro (o None) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Root directory | *(vacío)* |
| Variable de entorno | `NODE_VERSION=22` (también hay `.nvmrc`; Astro 7 pide ≥ 22.12) |
| Custom domains | `portfolio.rossmel.top` y `cv.rossmel.top` (añadirlos desde Pages; **no** crear CNAME a mano) |

Piezas del repo que lo hacen funcionar:
- `functions/_middleware.js` — en `cv.rossmel.top/` sirve `/cv/` sin redirigir.
- `public/_routes.json` — la función solo corre en `/` (no gasta invocaciones en assets).
- `public/_headers` — cabeceras de seguridad y caché larga para `/_astro/*`.
- `public/cv/*.pdf` — los PDF del CV van versionados (el build de Cloudflare no tiene Chromium):
  **siempre** correr `npm run cv:pdf` y commitear los PDF cuando cambie el contenido del CV.
- El enlace "Ver portafolio" del CV es absoluto (`portfolio.rossmel.top`) porque en `cv.` la raíz es el CV.

Analítica: Cloudflare Web Analytics (sin cookies) con **inyección automática** de la zona: ya funciona
en portfolio. y cv. (Cloudflare solo inyecta el script a navegadores reales, no a `curl`).
Respaldo: si algún día se apaga la inyección automática, definir la variable de build
`PUBLIC_CF_BEACON_TOKEN` y `Base.astro` añade el script. **No** usar ambas a la vez (contaría doble).

### Formulario de contacto

`functions/api/contact.js` (Pages Function en `/api/contact`) envía el mensaje con **Resend** y usa
**Turnstile** (antispam de Cloudflare, sin captchas molestos) + un campo trampa (honeypot).
El formulario **solo aparece** si en el build existe `PUBLIC_TURNSTILE_SITE_KEY`; sin eso, la sección
de contacto muestra solo los botones de correo/CV. Configuración (una vez):

1. **Turnstile**: Cloudflare → Turnstile → Add widget → dominios `portfolio.rossmel.top`
   (y `rossmel-portfolio.pages.dev` para las vistas previas), modo *Managed*.
   Copia la *site key* (pública) y la *secret key*.
2. **Resend** (gratis hasta 3.000 correos/mes): crear cuenta → Domains → añadir `rossmel.top` →
   copiar sus registros DNS (SPF/DKIM) en Cloudflare DNS → esperar "Verified" → API Keys → crear
   una con permiso *Sending access*.
3. **Pages → rossmel-portfolio → Settings → Variables and Secrets** (Production y Preview):
   - `PUBLIC_TURNSTILE_SITE_KEY` = site key (texto normal; se usa en el build)
   - `TURNSTILE_SECRET_KEY` = secret key (**Secret**)
   - `RESEND_API_KEY` = API key de Resend (**Secret**)
   - opcionales: `CONTACT_TO` (destino, por defecto abastorossmel@gmail.com),
     `CONTACT_FROM` (por defecto `Portafolio <contacto@rossmel.top>`)
4. Redesplegar (Deployments → Retry) y probar el formulario en producción.

Respuestas de la API: `200 {ok:true}`, `400 invalid|captcha`, `502 send_failed`, `503 not_configured`.

### Blog

- Artículos en `src/content/blog/<slug>.md` (Markdown). La URL es `/blog/<slug>/`.
- Frontmatter: `title`, `description` (1–2 frases, sale en Google y al compartir), `date`,
  `tags`, `lang` (`es`/`en`, por defecto `es`), `draft: true` para no publicar,
  `project: '<slug>'` para enlazarlo con su caso de estudio (el caso lista sus artículos y el
  artículo muestra una tarjeta al proyecto) y `pinned: true` para que salga primero.
- Etiquetas: reusar las existentes (`ia`, `llm`, `python`, `frontend`, `react`, `linux`,
  `rendimiento`…). Las que tienen un solo artículo se agrupan tras el botón "+N más".
- Portada con **buscador** (texto completo: el índice `/blog/search.json` se descarga solo al
  empezar a buscar; tecla `/` para enfocar) y **filtro por etiqueta**; ambos quedan en la URL
  (`/blog/?q=sqlite&tag=llm`), así se pueden compartir. Sin JS se ve la lista completa.
- Cada artículo: índice lateral con la sección actual resaltada (en móvil, desplegable),
  botón "Copiar enlace", tarjeta al caso de estudio y "Sigue leyendo" (mismo proyecto o etiquetas).
- Estilo de los artículos: problema real → decisión clave → código simplificado del repo →
  "Lo que aprendí". Nada de datos de clientes ni detalles de infraestructura (hosts, puertos, IPs).
- Cada artículo termina con el formulario de contacto (`ContactForm` con `context` = título):
  el correo llega con el asunto "Blog: comentario de … sobre …".
- RSS en `/blog/rss.xml`; aparece en el sitemap; la home muestra los 3 últimos ("Del blog").
- `blog.rossmel.top` → Redirect Rule 301 a `https://portfolio.rossmel.top/blog/` (mismo dominio =
  mejor posicionamiento que un subdominio aparte).
- Código con resaltado (Shiki, tema `vitesse-dark`); estilos del texto en `.prose` (global.css).

### SEO
- `@astrojs/sitemap` genera `sitemap-index.xml` (ES/EN con hreflang); `robots.txt` lo declara.
- Dar de alta `https://portfolio.rossmel.top` en **Google Search Console** (verificación por DNS,
  que ya está en Cloudflare) y enviar `sitemap-index.xml`.
- `404.html` propia (bilingüe).

Extras en Cloudflare (Rules → Redirect Rules):
- `rossmel.top` y `www.rossmel.top` → 301 a `https://portfolio.rossmel.top` (preservar ruta).

Flujo diario: push a `main` = producción; push a otra rama / PR = URL de vista previa `*.pages.dev`.

`site` en `astro.config.mjs` define el dominio canónico (SEO, OG, sitemap). Cambiarlo si cambia el dominio.

---

## Estado actual y pendientes

✅ Hecho (v3.0, sept. 2026)
- Proyecto nuevo en Astro 7 + Tailwind 4 + GSAP + Lenis
- Home con preloader, hero con shader, sobre mí, timeline de experiencia, galería horizontal de
  proyectos, stack con marquee, "cómo trabajo" (IA), contacto
- Casos de estudio por proyecto, ES/EN, modo claro/oscuro, SEO + JSON-LD
- CV ATS en HTML + PDF (ES/EN) generado desde los mismos datos
- v3.1: contenido real con el informe de Claude local (commits de WANT, métricas de AdvAI, SGPG,
  Link'u, homelab, rOS); campo `draft` para ocultar lo no confirmado

⏳ Pendiente
- [x] Todos los datos confirmados (sin `TODO(confirmar)` pendientes)
- [x] Imagen para compartir (`public/og.png`, 1200×630, `npm run og`)
- [ ] Capturas reales de proyectos (las sube Rossmel más adelante; ver "Imágenes de proyectos")
- [x] Publicado en Cloudflare Pages: portfolio.rossmel.top y cv.rossmel.top (sept. 2026)
- [x] Formulario de contacto funcionando en producción (Resend verificado con SPF/DKIM/DMARC, Turnstile activo; prueba real llegó a la bandeja de entrada)
- [ ] (Opcional) Copiar las 3 variables del formulario también al entorno *Preview* de Pages
- [x] Foto en "Sobre mí" (`src/assets/rossmel.jpg`, optimizada a WebP por Astro)
- [x] Menú móvil, sitemap, 404 propia, auditoría Lighthouse (local: perf 87–94, a11y 95–96, BP/SEO 100; CV 100 en todo)
- [x] Google Search Console verificado (propiedad de dominio `rossmel.top`) y sitemap enviado
- [ ] Video corto de AdvAI + capturas (Rossmel)
- [x] Revisión exhaustiva con Claude local (`docs/REVISION.md`) — correcciones aplicadas en v3.7
- [ ] Perfil de GitHub (`docs/github-profile/`, ver INSTRUCCIONES.md) y LinkedIn (`docs/LINKEDIN.md`)
- [ ] Probar Lighthouse (meta ≥95) y accesibilidad con teclado
- [x] v3.8: énfasis en programar sin IA (sobre mí, CV, línea de tiempo "antes y después de la IA"),
  blog con buscador/etiquetas/índice/relacionados y 11 artículos (uno o más por proyecto con código visible, más Jellyfin)
- [x] Subdominios en "En vivo" (`liveSites` en profile.ts): notebook, rubik y selflix (confirmados por Rossmel)

---

## Continuar con Claude Code local

1. `git clone git@github.com:rossmelabasto/portfolio-rossmel.git && cd portfolio-rossmel`
2. `git checkout <rama de trabajo>` (ver sección siguiente) y `npm install`
3. Abrir `claude` en la carpeta: lee `CLAUDE.md` automáticamente, que resume convenciones y estado.
4. Pedirle algo como: *"Lee README.md y docs/, y sigue con los pendientes."*

Ramas:
- `master` → v1 (Angular, 2022), solo como archivo histórico.
- `main` → rama por defecto.
- `claude/…` → ramas de trabajo creadas desde sesiones de Claude Code en la nube; se fusionan a `main`.

---

## Historial de decisiones

| Fecha | Decisión |
|---|---|
| 2026-09 | Reescritura total: Angular 13 → Astro 7. Una sola página con scroll narrativo en vez de rutas por sección. |
| 2026-09 | Astro en lugar de Next.js: sitio estático, más liviano, ideal para servirlo desde el servidor propio. |
| 2026-09 | Contenido centralizado en `profile.ts` para que portafolio y CV nunca se desincronicen. |
| 2026-09 | Shader WebGL propio en vez de three.js (≈4 KB vs ≈600 KB). |
| 2026-09 | Dominio propio `rossmel.top` en vez de Vercel. |
| 2026-09 | Estética dark + acento lima aprobada por Rossmel ("me encanta"). |
| 2026-09 | Proyectos de clientes de WANT sin código ni enlaces (`confidential`); métricas de commits como evidencia. |
| 2026-09 | CV limitado a 2 páginas: SGPG y Link'u solo en la experiencia "Independiente"; diseño gráfico solo en el portafolio. |
| 2026-09 | v3.7 tras la revisión: header a 360 px, CSS en línea + precarga de fuentes (LCP), blog con portada EN, og:type article, validación del formulario en el idioma de la página, contraste en modo claro y en el código. |
| 2026-09 | Texto en JetBrains Mono (Space Grotesk en titulares; Inter solo en artículos largos). Pedido de Rossmel. |
| 2026-09 | Blog en `/blog` (no subdominio aparte, por SEO); `blog.rossmel.top` redirige. Primer artículo: AdvAI. |
| 2026-09 | Hero: fondo CSS de respaldo si el navegador no tiene WebGL; botones Ver proyectos / Descargar CV. |
| 2026-09 | Identidad: monograma de Rossmel (`src/assets/logo.svg`, componente `Logo.astro`) en nav, footer, favicon, íconos PWA y og.png. |
| 2026-09 | Contador del preloader → terminal de arranque; envío del formulario mostrado como script (idea de Rossmel). |
| 2026-09 | Formulario: Pages Function + Resend + Turnstile (gratis, sin backend propio). |
| 2026-09 | Fondo WebGL limitado a 30 fps y menor resolución en móvil (rendimiento). |
| 2026-09 | Despliegue en Cloudflare Pages (un proyecto, dos dominios, middleware para `cv.`). |
| 2026-09 | v3.8: "programador primero". Sobre mí, CV y la sección Cómo trabajo cuentan que programó años sin IA (en WANT la IA llegó recién el último año) y qué herramientas usa hoy. |
| 2026-09 | Blog "en condiciones": buscador de texto completo sin dependencias (índice JSON bajo demanda), etiquetas, índice por artículo, relacionados y enlaces artículo ↔ caso de estudio. Artículos en español. |
| 2026-09 | Sección "En vivo": notebook, rubik y selflix. Fuera: music, mcu, waitlist, stream, chat, admin, admin-music, ssh, ori, class, s, test (y los del propio portafolio). |
| 2026-09 | Entrada del nombre fluida en móvil: las demás animaciones se preparan después del intro y en pedazos (antes, un bloqueo de ~380 ms con CPU de gama media). |
| 2026-09 | Tono: transmitir que entiende lo que genera la IA, sin frases absolutas ni "no soy vibe coder" (pedido de Rossmel). |
| 2026-09 | Fuera del sitio: watcher-backend, prototipos v0 (salvo SGPG), proyectos descartados, proyectos personales/regalos. |
