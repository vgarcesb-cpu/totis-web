# TOTI'S® — Ecosistema totis.cl
**Víctor Manuel Garcés Borje · Systems Developer · www.totis.cl**
*Última actualización: 10 Julio 2026 — ciclo de saneamiento cerrado (9/9 Workers + totis-worker) + sistema de informes unificado en curso*

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

## 🏗️ Ecosistema de portales — 9 Workers + 1 utilitario (Pages + Worker + D1)

| App | Frontend | Repo real | Worker → API | Versión | CORS |
|---|---|---|---|---|---|
| Adquisiciones | adq.totis.cl | `Portal-Adq` | portal-adq-worker → adq-api | v2.3 | ✅ real, Zero Trust PIN |
| Solicitud Supervisor | solicitud-supervisor.totis.cl | `Solicitud-Supervisor` | → supervisor-api | v1.2 | ✅ real, PWA offline-first |
| NLS-2003-004 | nls.totis.cl | `nls` | nls-worker → nls-api | v1.2 | ✅ real |
| Caldera | caldera.totis.cl | `caldera-app` | caldera-worker → caldera-api | v2.5 | ✅ real, Resend |
| UPS | ups.totis.cl | `ups-app` | ups-worker → ups-api | v2.4 | ✅ real, Resend |
| HVAC | hvac.totis.cl | `hvac-app` | worker hvac → hvac-api | v2.4 | ✅ real, Resend, sin pages.dev |
| Generadores | generadores.totis.cl | `generadores-app` | generadores-worker | v1.1 | ✅ real, Resend |
| AACC | aacc.totis.cl | `portal-aacc-fach` | portal-aacc-fach-api → aacc-api | v3.3 | ✅ real, modelo duro, Resend |
| Mail (sitio) | totis.cl | `totis-web` | totis-mail-worker → mail-api | v1.2 | ✅ real, Turnstile + Resend |
| **Contador visitas** | totis.cl | `totis-web` | totis-worker → totis-api | **v1.1 (10-jul-2026)** | ✅ real, saneado (era "Estilo 2") |

Repos públicos (sin IDs/detalles sensibles en docs): `totis-web`,
`Solicitud-Supervisor`, `tarjeta-profesional`. El resto privados.

Existe además `vgarcesb-cpu/vgarcesb-cpu` — repo especial de perfil de
GitHub (README de perfil), **no pertenece** a la arquitectura totis.cl.

---

## 🔒 Seguridad — estado tras el ciclo de saneamiento (08/09/10-jul-2026)

- [x] **CORS real verificado en los 9 Workers + totis-worker** — whitelist exacta (`===`, nunca `.includes()`), ACAO dinámico + `Vary: Origin`, rechazo 403. Excepción intencional: aacc también rechaza Origin vacío ("modelo duro").
- [x] **2 hallazgos críticos reales encontrados y corregidos**: adq (`ACAO:'*'` + bypass) y generadores (inyección SQL en `/api/bitacora` y `/api/mantenciones`) — la documentación previa no los reflejaba. Regla permanente: auditar siempre el `worker.js` real, nunca confiar en la etiqueta de versión documentada.
- [x] **`_headers` con CSP + CSP Insights** en los 9 Workers (varios no existían — creados desde cero)
- [x] **`catch` sin exponer `err.message` al cliente** en los 9 Workers + totis-worker
- [x] **`vgarcesb-cpu.github.io`** retirado de la whitelist donde no se usaba (confirmado en 9/9)
- [x] **`*.pages.dev`** retirado de la whitelist en caldera, generadores, ups, hvac — mismo riesgo que `workers.dev`: el WAF de zona no lo cubre
- [x] **`workers.dev` OFF** en los 9 Workers — único acceso vía dominios custom `*-api.totis.cl`
- [x] **EmailJS retirado por completo del ecosistema y cuenta eliminada** (10-jul-2026) — verificado con GitHub code search que no quedaba ningún uso activo antes de cerrar la cuenta
- [x] **Keys Resend dedicadas y sin ambigüedad**: `caldera-worker-2026`, `hvac-worker-2026`, `generadores-worker-2026`, `aacc-worker-2026`, `ups-worker-2026-v2`, `totis-mail-worker-prod-v2`
- [x] **DNS de Cloudflare revisado** (10-jul-2026): 22 registros verificados contra el inventario real, 2 registros huérfanos de Amazon SES eliminados (sin relación con Resend). Como subproducto se descubrió `totis-worker`, auditado y saneado el mismo día.
- [x] **Sistema de informes técnicos unificado** — módulo compartido `shared/informes.js` en este repo, probado en hvac y caldera (ver sección de arquitectura de email abajo)
- [x] WAF de zona, Bot Fight Mode, Hotlink Protection, WAF Chile-only → activados
- [x] Zero Trust PIN vigente solo en Adquisiciones (aacc tenía un comentario incorrecto en su código sugiriendo lo mismo, ya corregido)

### Validaciones S25 (juez definitivo)
✅ **9/9 Workers completo** + totis-worker validado Mac (10-jul-2026, sin necesidad de S25 por ser utilitario sin frontend propio)

---

## ⏳ Pendientes reales (todos riesgo bajo, sin urgencia)

1. **`.pages.dev` — Bulk Redirect**: no existe un toggle simple (investigado 10-jul-2026); requiere configurar Bulk Redirect `*.pages.dev` → dominio custom por cada uno de los 8 proyectos Pages, o Cloudflare Access (más frágil, riesgo de romper el dominio custom).
2. **`'unsafe-inline'`/`'unsafe-eval'` en CSP** de varios `_headers` — requiere refactor de scripts inline a `addEventListener`, no urgente.
3. **Sistema de informes técnicos unificado — completar el rollout**: probado con éxito en hvac y caldera (10-jul-2026); falta replicar en ups, generadores, aacc, mail (mismo patrón: agregar `https://totis.cl` a `_headers` + migrar la función de envío a `TotisInformes.generarHTML()`).
4. **Informe Editable de caldera (PDF con firmas)**: tablas de "Ficha Técnica"/"Quemador" aparecen vacías — no confirmado si es pre-existente, revisar `worker.js` (¿`dash.caldera` viene vacío?) y el flujo de `descargarInformeEditable()`.
5. **Cron Triggers** para recordatorios de mantención automáticos — no iniciado.

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

Generación del HTML del informe → shared/informes.js (este repo)
          https://totis.cl/shared/informes.js
          TotisInformes.generarHTML({...}) — mismo diseño en todas las apps
          Probado en: hvac ✅, caldera ✅ — pendiente: ups, generadores, aacc, mail
```

## 🔑 Credenciales — estado

- **EmailJS**: retirado por completo del código (09-jul-2026) y **cuenta
  eliminada** (10-jul-2026), tras confirmar con GitHub code search que no
  quedaba ningún uso activo. Sus antiguas credenciales (Public Key/Service
  ID/Template ID) eran client-side por diseño — no eran secretos.
- **Resend** (server-side, activo en los 9 Workers + capacidad de
  ampliarse): keys dedicadas, siempre en Secret. Regla permanente: key
  vista en código/chat/pantalla = comprometida → rotar (nueva → Secret →
  deploy → revocar), nunca mover.

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
