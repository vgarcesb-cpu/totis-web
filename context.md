# 📋 CONTEXT.md — totis.cl SEO & Google Search Console
**Fecha:** 2 de junio de 2026  
**Repo:** https://github.com/vgarcesb-cpu/totis-web  
**Dominio:** https://totis.cl  
**Cloudflare:** dash.cloudflare.com → totis.cl

---

## 🎯 Objetivo
Lograr que `https://totis.cl` aparezca en Google con SEO profesional, ícono correcto y snippet optimizado.

---

## ✅ Todo lo realizado

### FASE 1 — SEO agregado al index.html

Se tomó el archivo `index__1_.html` (versión correcta local) y se agregaron las siguientes etiquetas al `<head>` sin modificar nada del diseño original:

```html
<meta name="keywords" content="systems developer Chile, full stack developer, troubleshooting, Víctor Garcés, desarrollo web industrial, PWA Chile, Victor Garces Borje">
<meta name="author" content="Víctor Manuel Garcés Borje">
<meta name="robots" content="index, follow">
<meta http-equiv="content-language" content="es">
<link rel="canonical" href="https://totis.cl/">
<meta name="google-site-verification" content="XkqQFKXP8uO7C7tzqmX27C3YcBDXGSAliMGp0-OH6_Q" />
<meta property="og:type" content="website">
<meta property="og:url" content="https://totis.cl/">
<meta property="og:title" content="TOTI'S® — Víctor Garcés · Systems Developer">
<meta property="og:description" content="Víctor Manuel Garcés Borje — Systems Developer, Full Stack, Troubleshooting Assistance.">
<meta property="og:locale" content="es_CL">
<meta property="og:site_name" content="Toti's®">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="TOTI'S® — Víctor Garcés · Systems Developer">
<meta name="twitter:description" content="Systems Developer, Full Stack y Troubleshooting. Chile.">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Víctor Manuel Garcés Borje",
  "alternateName": "Toti's",
  "url": "https://totis.cl",
  "jobTitle": "Systems Developer & Full Stack",
  "description": "Desarrollador Full Stack especializado en sistemas industriales, PWAs y troubleshooting técnico.",
  "address": { "@type": "PostalAddress", "addressCountry": "CL" },
  "sameAs": ["https://www.facebook.com/vgarcesb", "https://www.instagram.com/totivgb"]
}
</script>
```

---

### FASE 2 — Google Search Console

**Problema 1:** El código `google-site-verification` en el index era diferente al que Google generó.  
**Solución:** Se actualizó la línea en GitHub con el código correcto:
```
XkqQFKXP8uO7C7tzqmX27C3YcBDXGSAliMGp0-OH6_Q
```

**Problema 2:** Google no podía verificar — error 403.  
**Causa:** Cloudflare bloqueaba a Googlebot con dos reglas activas.

---

### FASE 3 — Cloudflare desbloqueado para Google

**Reglas que bloqueaban a Googlebot:**

| Regla | Problema |
|---|---|
| Bot Fight Mode | Bloqueaba bots incluyendo Googlebot |
| "Bloquear fuera de Chile" | Googlebot viene desde EEUU → bloqueado con error 403 |

**Solución temporal aplicada:**
1. `Security → Bots` → **Bot Fight Mode** → desactivar
2. `Security → WAF → Custom rules` → "Bloquear fuera de Chile" → tres puntos ⋮ → **Disable**

**Después de verificar → ambas reglas reactivadas.**

---

### FASE 4 — Verificación y indexación

1. Search Console → método **Etiqueta HTML** → ✅ **Propiedad verificada**
2. Inspección de URL → `https://totis.cl` → **Solicitar indexación** → ✅ **Indexación solicitada**
3. Resultado: sitio apareció en Google en **menos de 1 hora**

---

### FASE 5 — Modal oculto para Google

**Problema:** Google mostraba el texto del modal de contacto en el snippet:
> *"Advertencia de Zona Protegida. Derechos Reservados..."*

**Solución:** Agregar `aria-hidden="true"` al div del modal en línea 894:
```html
<!-- ANTES -->
<div class="modal-overlay" id="modalOverlay">

<!-- DESPUÉS -->
<div class="modal-overlay" id="modalOverlay" aria-hidden="true">
```

**Resultado:** Google actualizó el snippet en menos de 1 hora mostrando los proyectos reales.

---

### FASE 6 — Favicon del logo Toti's

**Problema:** Google mostraba ícono genérico 🌐  
**Solución:** Se procesó el logo original `20260409_155727_0000.png` (negro sobre blanco) convirtiéndolo a **dorado `#d4af37` sobre negro `#080808`** con Python/Pillow.

El favicon se embebió como **base64 directamente en el `<head>`** del index.html:
```html
<link rel="favicon Toti's -->
<link rel="icon" type="image/png" href="data:image/png;base64,...">
<link rel="apple-touch-icon" href="data:image/png;base64,...">
<meta property="og:image" content="https://totis.cl/favicon.png">
```

**Estado:** ✅ Favicon visible en pestaña del navegador. Google tardará 1-4 semanas en actualizar el ícono en resultados.

---

## 📁 Estructura actual del repo

```
totis-web/
├── index.html          ← archivo principal (1078 líneas con todo incluido)
├── fondo.png           ← imagen de fondo del sitio
└── (sin otros archivos críticos)
```

---

## ⚙️ Configuración Cloudflare activa

| Regla | Estado actual |
|---|---|
| Bot Fight Mode | 🟢 ON (activo) |
| Bloquear fuera de Chile | 🟢 Active |

> ⚠️ Para futuras verificaciones de Google o rastreos, desactivar temporalmente ambas reglas y reactivar después.

---

## 📊 Estado en Google

| Elemento | Estado |
|---|---|
| Sitio indexado | ✅ Aparece en Google |
| Verificación Search Console | ✅ Verificado |
| Snippet texto | ⏳ Mostrando proyectos — se actualizará a meta description en 3-7 días |
| Ícono en Google | ⏳ Aún 🌐 — se actualizará a logo Toti's en 1-4 semanas |

---

## 🔑 Datos importantes

| Item | Valor |
|---|---|
| Dominio | https://totis.cl |
| Repo GitHub | https://github.com/vgarcesb-cpu/totis-web |
| Google Search Console | search.google.com/search-console |
| Cloudflare | dash.cloudflare.com |
| EmailJS service | service_wpd3adq |
| EmailJS template modal | template_82bw0m7 |
| EmailJS template widget | template_evsqgel |
| google-site-verification | XkqQFKXP8uO7C7tzqmX27C3YcBDXGSAliMGp0-OH6_Q |

---

## ⏰ Pendientes futuros

| Tarea | Prioridad |
|---|---|
| Crear `sitemap.xml` en repo para subdominios | Media |
| Verificar snippet en 7 días | Baja |
| Verificar ícono Google en 4 semanas | Baja |

---

*Generado el 2 junio 2026 — Sesión de trabajo totis.cl SEO completo*
