/**
 * POST /api/contact — formulario de contacto del portafolio.
 *
 * Variables en Cloudflare Pages (Settings → Variables and Secrets, como *secret*):
 *   RESEND_API_KEY        clave de Resend (el dominio rossmel.top debe estar verificado en Resend)
 *   TURNSTILE_SECRET_KEY  clave secreta del widget Turnstile
 *   CONTACT_TO            (opcional) correo destino; por defecto abastorossmel@gmail.com
 *   CONTACT_FROM          (opcional) remitente; por defecto "Portafolio <contacto@rossmel.top>"
 *
 * Responde JSON { ok: true } o { ok: false, error: 'codigo' } con el status adecuado.
 */

const MAX = { name: 100, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) return json({ ok: false, error: 'not_configured' }, 503);

  let data;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: los humanos no ven este campo; si viene lleno, fingimos éxito.
  if (String(data.get('company') ?? '').trim()) return json({ ok: true });

  const name = String(data.get('name') ?? '').replace(/\s+/g, ' ').trim();
  const email = String(data.get('email') ?? '').trim();
  const message = String(data.get('message') ?? '').trim();
  const lang = data.get('lang') === 'en' ? 'en' : 'es';
  // Artículo del blog desde el que se escribe (opcional)
  const context = String(data.get('context') ?? '').replace(/\s+/g, ' ').trim().slice(0, 200);
  if (!name || !message || !EMAIL_RE.test(email) || name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // Turnstile (antispam de Cloudflare)
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: String(data.get('cf-turnstile-response') ?? ''),
      remoteip: request.headers.get('CF-Connecting-IP') ?? '',
    }),
  }).then((r) => r.json()).catch(() => ({ success: false }));
  if (!verify.success) return json({ ok: false, error: 'captcha' }, 400);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'Portafolio <contacto@rossmel.top>',
      to: [env.CONTACT_TO || 'abastorossmel@gmail.com'],
      reply_to: email,
      subject: context ? `Blog: comentario de ${name} sobre "${context}"` : `Portafolio: mensaje de ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\nIdioma del sitio: ${lang}${context ? `\nArtículo: ${context}` : ''}\n\n${message}`,
      html: `<p><b>Nombre:</b> ${escapeHtml(name)}<br><b>Correo:</b> ${escapeHtml(email)}<br><b>Idioma del sitio:</b> ${lang}${context ? `<br><b>Artículo:</b> ${escapeHtml(context)}` : ''}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  }).catch(() => null);
  if (!res || !res.ok) return json({ ok: false, error: 'send_failed' }, 502);

  return json({ ok: true });
}

