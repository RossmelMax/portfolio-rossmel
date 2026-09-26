/**
 * Cloudflare Pages Function: en cv.rossmel.top la raíz "/" muestra el CV (/cv/)
 * sin redirigir (la URL sigue siendo cv.rossmel.top). Todo lo demás pasa normal.
 * Solo se ejecuta en "/" gracias a public/_routes.json (no consume invocaciones en assets).
 */
export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  if (url.hostname.startsWith('cv.') && url.pathname === '/') {
    return env.ASSETS.fetch(new URL('/cv/', url));
  }
  return next();
}
