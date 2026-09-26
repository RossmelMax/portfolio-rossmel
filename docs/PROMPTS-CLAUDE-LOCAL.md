# Prompts para Claude Code local

Estos prompts se corren en **tu laptop** (Claude Code local), porque la sesión en la nube no ve tu
servidor, tu red Tailscale ni tu historial local. Copia la respuesta completa y pégala en la sesión
del portafolio (o guárdala en `docs/contexto/` y haz commit).

> ⚠️ Los prompts piden explícitamente **no incluir secretos** (tokens, claves, contraseñas, IPs públicas
> sensibles). Revisa la respuesta antes de pegarla igual.

---

## Prompt 1 — Servidor, red Tailscale y dominio

```text
Necesito un informe técnico de mi infraestructura para desplegar mi portafolio en
portfolio.rossmel.top y mi CV en cv.rossmel.top. Investiga en mis máquinas (usa comandos de
solo lectura, no cambies nada) y respóndeme en un solo bloque Markdown con estas secciones:

1. Máquinas: nombre, rol (laptop / servidor / etc.), SO y versión, CPU/RAM/disco libre.
   Incluye todas las que veas en `tailscale status`.
2. Tailscale: nombre del tailnet, nodos, cuál tiene Funnel/Serve activos
   (`tailscale serve status`, `tailscale funnel status`), MagicDNS, exit nodes.
3. Servidor web / proxy: ¿hay Caddy, Nginx, Traefik, Apache u otro? Versión, dónde está su
   config (ruta), y lista de sitios/hosts que ya sirve. Pega la config SIN secretos.
4. Contenedores: ¿Docker/Podman? `docker ps` (nombre, imagen, puertos) y dónde están los
   compose files.
5. Dominio rossmel.top: dónde está registrado y quién maneja el DNS (Cloudflare, el registrador,
   otro). Registros DNS actuales si puedes verlos (`dig +short rossmel.top`,
   `dig +short *.rossmel.top`, `dig NS rossmel.top`). ¿Hay Cloudflare Tunnel (cloudflared)?
6. Cómo expongo hoy servicios a internet: puertos abiertos en el router, Tailscale Funnel,
   Cloudflare Tunnel, IP pública, etc. ¿Tengo IP pública fija o dinámica?
7. HTTPS: cómo se generan los certificados hoy (Caddy automático, certbot, Cloudflare...).
8. Deploy actual: ¿tengo algún flujo (git pull + build, webhooks, GitHub Actions con runner
   propio, rsync)? ¿Node.js instalado en el servidor? Versión.
9. Recomendación: la forma más simple y robusta de servir un sitio estático (carpeta dist/)
   en portfolio.rossmel.top y cv.rossmel.top con HTTPS, dado lo que encontraste.

Reglas: NO incluyas tokens, claves, contraseñas, auth keys, ni el contenido de archivos .env.
Si algo no existe, dilo explícitamente ("no hay X").
```

---

## Prompt 2 — Todo lo que hice con Claude Code (y rOS)

```text
Estoy armando mi CV y portafolio profesional. Quiero que revises TODO lo que tienes de mí
localmente: mi memoria/CLAUDE.md global (~/.claude/CLAUDE.md), los CLAUDE.md de proyectos, el
historial de sesiones en ~/.claude/projects/ (cada carpeta es un proyecto), y los repos que
encuentres en mi home. Luego respóndeme en un solo bloque Markdown con:

A. PROYECTOS — una ficha por proyecto relevante:
   - Nombre, carpeta/repo, fechas aproximadas (primera y última sesión)
   - Qué es y qué problema resuelve (2-3 líneas)
   - Mi rol y qué construí yo concretamente
   - Stack técnico real (lenguajes, frameworks, BD, infraestructura, IA)
   - Retos técnicos interesantes que resolví y decisiones de arquitectura
   - Resultados medibles si los hay (usuarios, tiempos, cantidad de datos, etc.)
   - ¿Es de un cliente/empresa, personal, de la universidad? ¿Se puede mostrar públicamente?
   Ordénalos de más a menos relevante para un perfil Frontend → Fullstack con IA.

B. rOS (mi distro de Linux) — explica a fondo:
   - Qué es, en qué se basa (Arch/Archcraft/…), qué la hace distinta
   - Componentes: compositor(es), shell/barra, temas, instalador, scripts, paquetes propios
   - Qué automaticé, cómo se instala, en qué estado está (idea, beta, uso diario)
   - Repos relacionados y capturas si existen (rutas)

C. HOMELAB / INFRA / AUTOMATIZACIÓN: servidores, Tailscale, agentes (OpenClaw/Clawdio u otros),
   scripts, bots, integraciones. Qué montaste y para qué.

D. CÓMO USO LA IA: herramientas (Claude Code, Ollama, etc.), skills/hooks/MCPs que configuré,
   flujos que automaticé, y ejemplos concretos de cosas que hice más rápido gracias a la IA.

E. HABILIDADES que se deducen de todo lo anterior (técnicas y blandas), con evidencia.

F. OTROS: cualquier cosa interesante para un reclutador que no encaje arriba.

Reglas:
- Filtra lo irrelevante: regalos/proyectos de pareja, cosas personales o familiares, pruebas
  de 5 minutos. Si dudas, ponlo en una lista aparte "Dudosos" con una línea cada uno.
- NO incluyas secretos, tokens, contraseñas, datos personales de terceros ni IPs.
- Sé concreto: prefiero "migré 3.267 artículos a SQLite FTS5" a "trabajé con bases de datos".
```
