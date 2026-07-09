# TOTI'S® — Ecosistema totis.cl
**Víctor Manuel Garcés Borje · Systems Developer · www.totis.cl**
*Última actualización: 09 Julio 2026 — ciclo de saneamiento cerrado (9/9 Workers)*

---

## 🌐 Qué es este repo

`totis-web` es la página de presentación pública de totis.cl y el punto de
documentación central del ecosistema: este `README.md` (plan de trabajo
maestro) y `BITACORA.md` (historial transversal de cambios). El detalle
técnico de cada app vive en su propio repo (`CONTEXT.md` cuando aplica).

---

## ✅ Sitio totis-web

- [x] `index.html` single-file, código propio, sin frameworks
- [x] Diseño oscuro con imagen de fondo propia (`fondo.png`, en el repo)
- [x] Logo TOTI'S® con animación gold, pills "SYSTEMS DEVELOPER"
- [x] Tarjetas enlazadas a los dominios propios `*.totis.cl`
- [x] Botones WhatsApp / Facebook / Instagram
- [x] Modal "Conectemos" y formulario "Consulta" — ambos vía `totis-mail-worker` (Resend + Turnstile); **EmailJS ya no está en uso en ningún repo del ecosistema**
- [x] WhatsApp real configurado (+56 9 3407 2459)
- [x] Footer © 2026

## 🌐 Dominio y hosting

- [x] `www.totis.cl` con HTTPS, DNS y proxy gestionados por Cloudflare

---

## 🏗️ Ecosistema de portales — 9 Workers (Pages + Worker + D1)

| App | Frontend | Repo real | Worker → API | Versión | CORS |
|---|---|---|---|---|---|
| Adquisiciones | adq.totis.cl | `Portal-Adq` | portal-adq-worker → adq-api | v2.3 | ✅ real, Zero Trust PIN |
| Solicitud Supervisor | solicitud-supervisor.totis.cl | `Solicitud-Supervisor` | → supervisor-api | v1.2 | ✅ real, PWA offline-first |
| NLS-2003-004 | nls.totis.cl | `nls` | nls-worker → nls-api | v1.2 | ✅ real |
| Caldera | caldera.totis.cl | `caldera-app` | caldera-worker → caldera-api | v2.5 | ✅ real, Resend |
| UPS | ups.totis.cl | `ups-app` | ups-worker → ups-api | v2.4 | ✅ real, Resend |
| HVAC | hvac.totis.cl | `hvac-app` | worker hvac → hvac-api | v2.4 | ✅ real, Resend |
| Generadores | generadores.totis.cl | `generadores-app` | generadores-worker | v1.1 | ✅ real, Resend |
| AACC | aacc.totis.cl | `portal-aacc-fach` | portal-aacc-fach-api → aacc-api | v3.3 | ✅ real, modelo duro, Resend |
| Mail (sitio) | totis.cl | `totis-web` | totis-mail-worker → mail-api | v1.2 | ✅ real, Turnstile + Resend |

Repos públicos (sin IDs/detalles sensibles en docs): `totis-web`,
`Solicitud-Supervisor`, `tarjeta-profesional`. El resto privados.

Existe además `vgarcesb-cpu/vgarcesb-cpu` — repo especial de perfil de
GitHub (README de perfil), **no pertenece** a la arquitectura totis.cl.

---

## 🔒 Seguridad — estado tras el ciclo de saneamiento (08/09-jul-2026)

- [x] **CORS real verificado en los 9 Workers** — whitelist exacta (`===`, nunca `.includes()`), ACAO dinámico + `Vary: Origin`, rechazo 403. Excepción intencional: aacc también rechaza Origin vacío ("modelo duro").
- [x] **2 hallazgos críticos reales encontrados y corregidos**: adq (`ACAO:'*'` + bypass) y generadores (inyección SQL en `/api/bitacora` y `/api/mantenciones`) — la documentación previa no los reflejaba. Regla permanente: auditar siempre el `worker.js` real, nunca confiar en la etiqueta de versión documentada.
- [x] **`_headers` con CSP + CSP Insights en los 9 Workers** (varios no existían — creados desde cero: adq, supervisor, nls, caldera, generadores, ups, aacc)
- [x] **`catch` sin exponer `err.message` al cliente** en los 9 Workers
- [x] **`vgarcesb-cpu.github.io`** retirado de la whitelist donde no se usaba (confirmado en 8/9); hvac es la única excepción confirmada de mantenerlo
- [x] **`*.pages.dev`** retirado de la whitelist donde aplicaba (caldera, generadores, ups, hvac) — mismo riesgo que `workers.dev`: el WAF de zona no lo cubre
- [x] **`workers.dev` OFF** (Production + Preview) en los 9 Workers — único acceso vía dominios custom `*-api.totis.cl`
- [x] **EmailJS retirado por completo del ecosistema** — aacc era el último repo que lo usaba, migrado a Resend (09-jul-2026)
- [x] **Keys Resend dedicadas y sin ambigüedad**: `caldera-worker-2026`, `hvac-worker-2026`, `generadores-worker-2026`, `aacc-worker-2026`, `ups-worker-2026-v2`, `totis-mail-worker-prod-v2`
- [x] **WAF de zona**: regla única cubre `/api/*` + rutas raíz, 20 req/10s por IP, Block 10s — validada con Error 1015 real
- [x] Bot Fight Mode, Hotlink Protection, WAF Chile-only → activados
- [x] Auditoría XSS ecosistema (jun-2026): cero `innerHTML` con dato de usuario
- [x] Zero Trust PIN vigente solo en Adquisiciones (confirmado — aacc tenía un comentario incorrecto en su código sugiriendo lo mismo, ya corregido)

### Validaciones S25 (juez definitivo)
✅ **9/9 completo** — adq-api, supervisor-api, nls-api, caldera-api, ups-api, hvac-api, mail-api, generadores-api, aacc-api

---

## ⏳ Pendientes reales (todos riesgo bajo, sin urgencia)

1. Desactivar el subdominio `.pages.dev` en Cloudflare Pages Settings de cada proyecto (paralelo a `workers.dev` OFF ya aplicado en los Workers)
2. Cerrar la cuenta EmailJS (sin uso desde la migración de aacc)
3. `'unsafe-inline'`/`'unsafe-eval'` en CSP de varios `_headers` — requiere refactor de scripts inline, no urgente
4. Sistema de informes técnicos unificado (PDF + envío Resend) — ya funcional app por app, evaluar si vale la pena un módulo compartido
5. Cron Triggers para recordatorios de mantención automáticos — no iniciado
6. Revisar DNS de Cloudflare (registros CNAME antiguos, Workers sin describir) — no iniciado

---

## 🏗️ Arquitectura Stack Toti's

| Componente | Tecnología | Detalle |
|---|---|---|
| Página presentación | GitHub Pages | www.totis.cl |
| DNS + HTTPS + Seguridad | Cloudflare | Zona `totis.cl` |
| Login apps | Cloudflare Zero Trust | Solo Adquisiciones |
| Apps industriales | Cloudflare Pages | `*.totis.cl` |
| API backend | Cloudflare Workers | `*-api.totis.cl` (`workers.dev` OFF) |
| Base de datos | Cloudflare D1 (SQLite) | snake_case |
| Email (todas las apps) | Resend | Key dedicada por Worker, siempre en Secret |
| Anti-bot (formularios totis.cl) | Cloudflare Turnstile | Site Key pública, Secret Key server-side |

## 📧 Arquitectura de email (unificada — sin EmailJS)

```
Resend (vía totis-mail-worker) → totis.cl (Conectemos / Consulta)
          Turnstile anti-bot server-side

Resend (endpoint propio por Worker) → cada app industrial
          hvac@totis.cl · caldera@totis.cl · ups@totis.cl
          generadores@totis.cl · aacc@totis.cl
          Key dedicada por Worker, siempre en Secret env.RESEND_API_KEY
```

## 🔑 Credenciales — estado

- **EmailJS**: retirado por completo (09-jul-2026). Sus credenciales
  (Public Key/Service ID/Template ID) eran client-side por diseño — no son
  secretos, confirmado en docs oficiales de EmailJS. La cuenta sigue
  abierta sin uso, pendiente de cerrar (baja prioridad).
- **Resend** (server-side, activo en los 9 Workers): keys dedicadas,
  siempre en Secret. Regla permanente: key vista en código/chat/pantalla =
  comprometida → rotar (nueva → Secret → deploy → revocar), nunca mover.

---

## 📱 Estado equipos industriales

| App | Equipo | Estado |
|---|---|---|
| caldera-app | 1 Caldera ACS | ⚠️ Fuera de servicio — inundación |
| ups-app | 1 UPS | 🔄 Próxima renovación |
| hvac-app | ~20 Aires acondicionados | ✅ Operativos |
| generadores-app | 1 Generador | ✅ Operativo |
| portal-aacc-fach | Equipos A/C FACH (mayores/menores 40K BTU) | ✅ Inventario activo |

---

## 📌 Protocolo de saneamiento (formal — ver skill `auditor-totis`)

Cuando se detecten nuevos pendientes: listar desde este README/`BITACORA.md`
→ auditar el código real (nunca confiar en la etiqueta documentada) →
entregar fix accionable → no cerrar sin evidencia (Mac → GitHub/Cloudflare
→ S25) → registrar en `BITACORA.md` → recalcular el mapa.
