# TOTI'S® — Plan de Trabajo
**Víctor Manuel Garcés Borje · Systems Developer · www.totis.cl**
*Última actualización: 08 Julio 2026 (post-saneamiento #9)*

---

## ✅ Completado

### Página web — totis-web
- [x] index.html limpio — código propio
- [x] Diseño oscuro con imagen de fondo fondo.png (propia, en el repo)
- [x] Logo TOTI'S® con animación gold
- [x] Pills SYSTEMS DEVELOPER visibles con backdrop-filter
- [x] Tarjetas enlazadas a dominios propios *.totis.cl
- [x] Botones WhatsApp / Facebook / Instagram con colores hover
- [x] Modal "Conectemos" y formulario "Consulta" — ambos vía `totis-mail-worker` (Resend + Turnstile), EmailJS **ya no está en uso**
- [x] Footer © 2026
- [x] WhatsApp real configurado (+56 9 3407 2459)
- [x] Formulario de contacto con Turnstile anti-bot (totis-mail-worker v1.1)

### Dominio y hosting
- [x] www.totis.cl funcionando con HTTPS ✅
- [x] DNS gestionado por Cloudflare
- [x] Proxy Cloudflare activo

### Ecosistema de portales — 9 Workers (arquitectura Pages + Worker + D1)

| App | Frontend | Worker → API | Versión | Nota |
|---|---|---|---|---|
| Adquisiciones | adq.totis.cl | portal-adq-worker → adq-api | v2.3 | Zero Trust PIN |
| Solicitud Supervisor | solicitud-supervisor.totis.cl | → supervisor-api | v1.1 | PWA híbrida offline-first |
| NLS-2003-004 | nls.totis.cl | nls-worker → nls-api | v1.2 | Transferencia de calor |
| Caldera | caldera.totis.cl | caldera-worker → caldera-api | v2.3 | Email Resend |
| UPS | ups.totis.cl | ups-worker → ups-api | v2.3 | Email Resend |
| AACC | aacc.totis.cl | portal-aacc-fach-api → aacc-api | — | CORS modelo duro |
| HVAC | hvac.totis.cl | worker hvac → hvac-api | v2.3 | Email Resend; CORS v2.3 homologado (08-jul-2026) |
| Generadores | generadores.totis.cl | generadores-worker | — | Modelo original de whitelist |
| Mail (sitio) | totis.cl | totis-mail-worker → mail-api | v1.1 | Turnstile anti-bot |

### Seguridad — Jornada de Saneo (07-jul-2026) + Saneamiento #9 (08-jul-2026)
- [x] **CORS v2.3** en 6/9 Workers: whitelist exacta (`===`, nunca `.includes()`) + ACAO dinámico + `Vary: Origin` + rechazo 403 (adq, supervisor, nls, caldera, ups, **hvac**)
- [x] **Keys Resend dedicadas y rotadas**, siempre en Secret `env.RESEND_API_KEY`: caldera-worker-2026, ups-app-prod, hvac-worker-2026, totis-mail-worker-prod-v2
- [x] **WAF de zona ampliado**: regla única cubre `/api/*` + rutas raíz de todas las APIs, 20 req/10s por IP, Block 10s — validada con Error 1015 real
- [x] **workers.dev OFF** en los 9 Workers (Production + Preview) — único acceso vía dominios custom `*-api.totis.cl`
- [x] Bot Fight Mode, AI Labyrinth, Hotlink Protection, WAF Chile-only → activados
- [x] Auditoría XSS ecosistema (jun-2026): cero `innerHTML` con dato de usuario, `textContent`/`escH()` en todo el stack
- [x] Zero Trust PIN vigente en Adquisiciones (team domain totis.cloudflareaccess.com, OTP a vgarcesb@gmail.com)
- [x] `catch` sin exponer `err.message` al cliente en hvac (08-jul-2026) — pendiente en 8/9 restantes

### Validaciones S25 (juez definitivo — dominios custom)
✅ adq-api, supervisor-api, nls-api, caldera-api, ups-api, **hvac-api (08-jul-2026)** (6/9)
⬜ aacc, generadores, mail

---

## ⏳ Pendiente — Por orden de prioridad

### 1. Pendientes del mapa (todos riesgo bajo)
- [ ] **#7** CSP Insights: agregar `https://static.cloudflareinsights.com` a `script-src` en `_headers` (detectado y corregido en hvac, auditar el resto)
- [x] ~~**#9** Homologar CORS de hvac al patrón v2.3~~ → ✅ Resuelto 08-jul-2026, validado Mac + S25
- [ ] Validaciones S25 restantes: aacc, generadores, mail
- [ ] Retirar `localhost` de whitelists donde no se use
- [ ] Endurecer en conjunto: `catch` devolviendo `err.message` al cliente (ya aplicado en hvac, falta en 8/9 restantes)

### 2. Sistema de informes técnicos (PDF + Correo Resend)
- [ ] Diseñar plantilla PDF ordenada cronológicamente
- [ ] Estructura: Encabezado → Resumen → Hoja de Vida → Historial → Bitácora → Firma
- [ ] Botón "Descargar PDF" → respaldo en Mac
- [ ] Botón "Enviar Informe" → Resend con PDF adjunto a jefatura
- [ ] Correo sale desde dominio propio (calderas@totis.cl, ups@totis.cl...)

### 3. Cron Triggers — mantenimiento automático
- [ ] Recordatorio mantención próxima → correo automático
- [ ] Resumen mensual automático por equipo
- [ ] Alerta si equipo lleva X días sin registro

### 4. DNS Cloudflare — revisar pendientes
- [ ] CNAME totis.cl apex → verificar apunta correcto
- [ ] CNAME portal → Railway → ¿se necesita?
- [ ] jolly-butterfly-ac12 worker → describir o eliminar

### 5. Mejoras diseño totis-web (opcional)
- [ ] Cambiar fondo.png si se encuentra imagen mejor
- [ ] Tarjetas proyectos más transparentes

---

## 🏗️ Arquitectura Stack Toti's

| Componente | Tecnología | URL |
|---|---|---|
| Página presentación | GitHub Pages | www.totis.cl |
| DNS + HTTPS + Seguridad | Cloudflare | — |
| Login apps | Cloudflare Zero Trust | totis.cloudflareaccess.com |
| Apps industriales | Cloudflare Pages | *.totis.cl |
| API backend | Cloudflare Workers | *-api.totis.cl (workers.dev OFF) |
| Base de datos | Cloudflare D1 (SQLite) | — |
| Email sitio (Conectemos/Consulta) | Resend vía `totis-mail-worker` + Turnstile | totis.cl |
| Email informes/alertas | Resend | Keys dedicadas por Worker (Secret) |

---

## 📧 División clara de emails

```
Resend (vía totis-mail-worker) → totis.cl (Conectemos / Consulta)
          Turnstile anti-bot server-side
          Secret RESEND_API_KEY: totis-mail-worker-prod-v2

Resend  → Apps industriales (informes PDF)
          Sale desde dominio propio
          calderas@totis.cl / ups@totis.cl
          Key dedicada por Worker, siempre en Secret
```

> EmailJS quedó reemplazado por `totis-mail-worker` (jun-2026). La cuenta
> EmailJS sigue abierta pero sin uso — pendiente de eliminar (baja prioridad,
> ver skill `seguridad-web-totis`).

---

## 📱 Estado equipos industriales

| App | Equipo | Estado |
|---|---|---|
| caldera-app | 1 Caldera ACS | ⚠️ Fuera de servicio — inundación |
| ups-app | 1 UPS | 🔄 Próxima renovación |
| hvac-app | ~20 Aires acondicionados | ✅ Operativos |
| generadores-app | 1 Generador | ✅ Operativo |

---

## 🔑 Credenciales — estado

- **EmailJS** (legacy, sin uso desde jun-2026): Public Key/Service ID/Template ID
  eran client-side por diseño (confirmado en docs oficiales de EmailJS — no son
  secretos, la mitigación de abuso es whitelist de dominio + captcha en su
  dashboard, no ocultarlas). No se listan aquí por ya no ser relevantes;
  limpiar del HTML si aún quedan referencias muertas y cerrar la cuenta.
- **Resend** (server-side, activo): keys dedicadas por Worker, **siempre**
  en Secret (`env.RESEND_API_KEY`), nunca en código/chat/pantalla.
  Regla permanente: key vista fuera de un Secret = comprometida → rotar
  (nueva → Secret → deploy → revocar), nunca mover.

---

## 🩺 Registro de Workers — Health Check

| Worker (Cloudflare) | App | Health check |
|---|---|---|
| `portal-adq-worker` | Adquisiciones | `https://adq-api.totis.cl/api/health` |
| `solicitud-supervisor-worker` | Solicitud Supervisor | `https://supervisor-api.totis.cl/api/health` |
| `nls-worker` | NLS-2003-004 | `https://nls-api.totis.cl/api/health` |
| `caldera-worker` | Caldera | `https://caldera-api.totis.cl/api/health` |
| `ups-worker` | UPS | `https://ups-api.totis.cl/api/health` |
| `portal-aacc-fach-api` | AACC | pendiente validación S25 |
| worker hvac | HVAC | `https://hvac-api.totis.cl/api/dashboard` ✅ validado 08-jul-2026 |
| `generadores-worker` | Generadores | pendiente validación S25 |
| `totis-mail-worker` | Mail (sitio totis.cl) | pendiente validación S25 |

> Verificado = leído en `MEMORIA-ECOSISTEMA.md`/`BITACORA.md`. Las URLs de
> aacc/hvac/generadores/mail son las esperadas por convención `*-api.totis.cl`,
> no confirmadas contra Dashboard — confirmar antes de usarlas como fuente
> de verdad (Principio 8, `auditor-totis`).

---

## 📄 Repos del ecosistema

| Repo | Visibilidad | Contiene |
|---|---|---|
| `totis-web` | Público | Sitio totis.cl + este README |
| `Solicitud-Supervisor` | Público | PWA híbrida offline-first |
| `tarjeta-profesional` | Público | Tarjeta de presentación |
| adq, nls, caldera, ups, aacc, hvac, generadores | Privados | Portales D1 (sin IDs/detalles sensibles en docs, per regla del ecosistema) |

---

## 📌 Próxima sesión de saneamiento (protocolo formal — ver skill `auditor-totis`)

1. ~~hvac `worker.js` → homologar CORS a v2.3 (#9)~~ ✅ Cerrado 08-jul-2026
2. `_headers` de los 8 repos restantes → agregar CSP Insights (#7)
3. Retirar `localhost` de whitelists + estandarizar `catch` sin `err.message` en los 8 Workers restantes (patrón ya validado en hvac)
4. Validaciones S25 restantes: aacc, generadores, mail
5. Cerrar cada ítem solo con evidencia (`/health` + prueba real) y mover a §7 de `MEMORIA-ECOSISTEMA.md` + `BITACORA.md`

