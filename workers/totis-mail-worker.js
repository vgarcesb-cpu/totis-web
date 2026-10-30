// ============================================================
// totis-mail-worker — Proxy de envío de correo para totis.cl
// v1.0 — Reemplaza EmailJS. Usa Resend con key protegida como
// Secret (env.RESEND_API_KEY). Un único endpoint para los 2
// formularios del sitio: modal "Conectemos" (redes sociales) y
// widget "Consulta Online".
// v1.1 — Agrega validación de Cloudflare Turnstile (anti-bot)
// antes de enviar cualquier correo. Requiere env.TURNSTILE_SECRET_KEY
// como Secret en Cloudflare.
// v1.2 (09-jul-2026, saneamiento): retirado vgarcesb-cpu.github.io
// de la whitelist (confirmado sin uso, patrón unificado del
// ecosistema). catch y error de Resend ya no exponen mensajes
// internos al cliente.
// v1.3 (29-oct-2026): límites de largo por campo y de tamaño del
// cuerpo (20 KB, medido en bytes). Turnstile debe venir de
// totis.cl (campo hostname de siteverify).
// ============================================================

const FROM_EMAIL = 'web@totis.cl';
const TO_EMAIL = 'vgarcesb@gmail.com';

const ORIGENES_PERMITIDOS = [
  'https://totis.cl',
];

// Sitios desde donde se acepta el token de Turnstile.
const HOSTS_TURNSTILE = ['totis.cl', 'www.totis.cl'];

// Largo máximo por campo (caracteres) y tamaño máximo del cuerpo (bytes).
const LARGOS = { nombre: 100, correo: 254, telefono: 30, red: 50, mensaje: 2000, tipo: 20, turnstileToken: 4096 };
const CUERPO_MAX = 20000;

function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
  if (origin && ORIGENES_PERMITIDOS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function jsonHeaders(origin) {
  return { ...corsHeaders(origin), 'Content-Type': 'application/json' };
}

function origenAutorizado(origin) {
  return origin === '' || ORIGENES_PERMITIDOS.includes(origin);
}

function escH(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function esEmailValido(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const resp = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers: jsonHeaders(origin) });

    if (request.method === 'OPTIONS')
      return new Response(null, { status: 204, headers: corsHeaders(origin) });

    if (!origenAutorizado(origin))
      return resp({ error: 'No autorizado' }, 403);

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (path === '/health')
      return resp({ ok: true, app: 'TOTIS-MAIL', version: '1.3', ts: new Date().toISOString() });

    if (path === '/api/send-contact' && method === 'POST') {
      try {
        // v1.3: tamaño del cuerpo en bytes y largo por campo.
        if (Number(request.headers.get('Content-Length') || 0) > CUERPO_MAX)
          return resp({ error: 'Solicitud demasiado grande' }, 413);
        const buffer = await request.arrayBuffer();
        if (buffer.byteLength > CUERPO_MAX)
          return resp({ error: 'Solicitud demasiado grande' }, 413);
        let d;
        try { d = JSON.parse(new TextDecoder().decode(buffer)); } catch (_) { return resp({ error: 'JSON inválido' }, 400); }
        if (!d || typeof d !== 'object' || Array.isArray(d)) return resp({ error: 'Se esperaba un objeto JSON' }, 400);
        for (const [campo, max] of Object.entries(LARGOS)) {
          if (d[campo] != null && (typeof d[campo] === 'object' || String(d[campo]).length > max))
            return resp({ error: `El campo ${campo} supera ${max} caracteres o es inválido` }, 400);
        }

        const tipo = d.tipo === 'red-social' ? 'red-social' : 'consulta';
        const nombre = String(d.nombre || '').trim();
        const correo = String(d.correo || '').trim();
        const telefono = String(d.telefono || '').trim();
        const mensaje = String(d.mensaje || '').trim();
        const red = String(d.red || '').trim();
        const turnstileToken = String(d.turnstileToken || '').trim();

        if (!nombre) return resp({ error: 'Falta nombre' }, 400);
        if (!esEmailValido(correo)) return resp({ error: 'Correo inválido' }, 400);
        if (tipo === 'consulta' && !mensaje) return resp({ error: 'Falta mensaje' }, 400);

        if (!turnstileToken)
          return resp({ error: 'Verificación de seguridad faltante' }, 400);

        if (!env.TURNSTILE_SECRET_KEY)
          return resp({ error: 'TURNSTILE_SECRET_KEY no configurada como Secret' }, 500);

        const tsResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${encodeURIComponent(env.TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(turnstileToken)}`,
        });
        const tsData = await tsResp.json();
        // v1.3: el token tiene que haberse resuelto en totis.cl.
        if (!tsData.success || !HOSTS_TURNSTILE.includes(tsData.hostname))
          return resp({ error: 'Verificación de seguridad fallida' }, 403);

        if (!env.RESEND_API_KEY)
          return resp({ error: 'RESEND_API_KEY no configurada como Secret' }, 500);

        const asunto = tipo === 'red-social'
          ? `totis.cl — Contacto vía ${red || 'red social'}`
          : `totis.cl — Nueva consulta de ${nombre}`;

        const html = `
          <h2>${tipo === 'red-social' ? 'Contacto vía red social' : 'Nueva consulta'} — totis.cl</h2>
          <p><strong>Nombre:</strong> ${escH(nombre)}</p>
          <p><strong>Correo:</strong> ${escH(correo)}</p>
          <p><strong>Teléfono:</strong> ${escH(telefono || 'No indicado')}</p>
          ${red ? `<p><strong>Red:</strong> ${escH(red)}</p>` : ''}
          ${mensaje ? `<p><strong>Mensaje:</strong><br>${escH(mensaje)}</p>` : ''}
        `;

        const resendResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `Totis.cl <${FROM_EMAIL}>`,
            to: [TO_EMAIL],
            reply_to: correo,
            subject: asunto,
            html,
          }),
        });
        const resendData = await resendResp.json();
        if (resendResp.ok) {
          return resp({ ok: true, id: resendData.id });
        } else {
          console.error('Resend error:', resendData);
          return resp({ error: 'Error al enviar el correo' }, 500);
        }
      } catch (e) {
        console.error('mail worker:', e);
        return resp({ error: 'Error interno del servidor' }, 500);
      }
    }

    return resp({ error: 'Ruta no encontrada' }, 404);
  }
};
