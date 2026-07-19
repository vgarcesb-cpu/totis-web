# CLAUDE.md — Memoria de totis-web

Contexto para asistentes de código. Detalle exhaustivo en `README.md` (plan
maestro), `BITACORA.md` (historial) y `context.md` (SEO).

## Qué es

`totis-web` es la landing pública de **www.totis.cl** — página de presentación
de **Víctor Manuel Garcés Borje** (Systems Developer, Chile) y punto de entrada
a sus apps industriales (generadores, HVAC, UPS, calderas).

## Stack

- **Frontend:** `index.html` single-file, HTML/CSS/JS vanilla, sin frameworks.
- **Hosting:** GitHub Pages (repo `vgarcesb-cpu/totis-web`), dominio `totis.cl` vía Cloudflare.
- **Fondo propio:** `fondo.png`. Diseño oscuro, acento dorado (`--gold #d4af37`) y rosa.
- **Backend del ecosistema:** Cloudflare Pages + Workers + D1. APIs en `totis-api.totis.cl` y `mail-api.totis.cl`.
- **Contador de visitas:** REAL, vía Cloudflare Worker + D1 (NO usar localStorage — ya existe uno mejor).
- **Correo:** Worker propio (`mail-api.totis.cl`), Resend por detrás. EmailJS eliminado del ecosistema.

## Seguridad (fuerte — ver `_headers`)

- HSTS con `preload`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
- CSP estricta, `Permissions-Policy` restrictiva, Cloudflare Turnstile anti-bot.
- WAF Cloudflare (bloqueo geográfico a Chile), Bot Fight Mode.

## Reglas de trabajo

- **No alterar el diseño visual** salvo que Víctor lo pida — solo mejoras "invisibles" (a11y, SEO, seguridad, rendimiento).
- Víctor **no trabaja en terminal** ni conoce git a fondo — explicar en español simple, sin jerga.
- Rama de desarrollo asignada por sesión; merge a `main` publica en el sitio (GitHub Pages tarda 1-2 min).
- Mantener `README.md` y `BITACORA.md` al día tras cambios relevantes.

## Historial de mejoras asistidas (2026-07)

- ♿ Desbloqueado el zoom (quitado `maximum-scale=1.0` del viewport).
- 🔒 `window.open(..., '_blank', 'noopener')` en las redirecciones a redes.
- 🏷️ Logo convertido a `<h1>` (jerarquía semántica para SEO).
- 🔝 Botón "volver arriba" flotante (izquierda, para no chocar con el chat de la derecha).
- 📝 Sección "Servicios" (4 tarjetas elegantes, títulos en Cormorant serif dorado):
  Sistemas Industriales · Desarrollo Web Full Stack · Troubleshooting & Soporte ·
  Informes & Automatización. Ubicada entre Proyectos y Contacto.
- 🖼️ Imagen social OG `og-totis.png` (1200×630, dorada, generada con Chromium desde
  HTML). Meta tags `og:image` + `twitter:card=summary_large_image` actualizadas.
- Nota: JSON-LD y contador Worker+D1 ya existían previamente.

## Roadmap — próximas mejoras (elaborar con calma)

Ideas acordadas con Víctor para futuras sesiones (priorizar elegancia, no alterar
el diseño base):

1. **Sección "Sobre mí"** — historia profesional breve y elegante.
2. **Métricas de visitantes** — Google Analytics o panel propio (ya hay contador Worker+D1).
3. **Optimizar `fondo.png` → WebP** — reduce peso ~60-80%, carga más rápida. Servir
   con `<picture>` y fallback PNG. (Víctor prefiere convertir sus imágenes con calma.)
4. **Testimonios / casos de éxito** — de clientes, con estilo dorado coherente.
5. **Mejorar el modal de contacto** — pulir UX del formulario.
6. **[PENDIENTE] Desbloquear crawlers de redes sociales en Cloudflare** — la imagen
   social `og-totis.png` ya está lista y conectada por meta tags, PERO el WAF de
   Cloudflare (bloqueo geográfico a Chile + Bot Fight Mode) devuelve 403 al robot
   `facebookexternalhit`, así que la vista previa NO se ve al compartir el link.
   Fix: en Cloudflare → Security → WAF → Custom rules, crear regla "Skip / All
   remaining custom rules" para user-agents `facebookexternalhit`, `Twitterbot`,
   `WhatsApp`, `LinkedInBot`, `Slackbot`, `TelegramBot`, `Discordbot`, y moverla
   AL TOPE (antes del bloqueo geográfico). Además activar "Allow verified bots" en
   Bot Fight Mode. La seguridad se mantiene fuerte; solo se abre paso a crawlers
   legítimos. Verificar luego con developers.facebook.com/tools/debug.

Regla: mostrar preview (screenshot con Chromium) ANTES de publicar cambios visibles;
publicar solo con OK explícito de Víctor.
