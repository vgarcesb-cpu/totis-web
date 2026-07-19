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
- Nota: JSON-LD y contador Worker+D1 ya existían previamente.
