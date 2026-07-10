# BITÁCORA — Ecosistema totis.cl

> Registro transversal de cambios a nivel ecosistema (zona, WAF,
> políticas de Workers, estándares de seguridad). Los cambios por
> proyecto viven en el CONTEXT.md de cada repo.

---

## 07-jul-2026 — JORNADA DE SANEO DEL ECOSISTEMA — COMPLETADA

### CORS (#1 ✅)
- `portal-adq-worker` v2.3, `solicitud-supervisor-worker` v1.1, `nls-worker` v1.2:
  whitelist EXACTA (`===`, nunca `.includes()`) + ACAO dinámico + `Vary: Origin`
  + rechazo 403. Validados Mac + S25.
- `caldera-worker` v2.3 y `ups-worker` v2.3: mismo patrón + guards NaN/numéricos
  + DELETE atómico (`env.DB.batch()`).
- Decisión estándar: `origin === ''` permitido (curl/health), mitigado por WAF.
  Excepción: `portal-aacc-fach-api` usa el modelo duro (rechaza origin vacío).

### Keys Resend (#4 ✅)
- Estándar: **1 key dedicada por Worker**, siempre en Secret `env.RESEND_API_KEY`.
- caldera: rotada a `caldera-worker-2026`, vieja revocada, verificada con envío real.
- ups: `ups-app-prod` dedicada, nunca expuesta en código.
- hvac: Secret contenía key muerta (síntoma "API key is invalid") → rotada a
  `hvac-worker-2026`, verificada con Informe Técnico real.
- mail: `totis-mail-worker-prod-v2` sana (Worker v1.1 con Turnstile).
- **Regla permanente:** key vista alguna vez en código/chat/pantalla =
  comprometida → crear nueva + Secret + deploy + revocar. Nunca "mover".

### WAF rate limiting (#5 ✅)
- Regla ÚNICA de zona (límite plan Free) ampliada: `/api/*` + rutas raíz de
  todas las APIs (/solicitudes, /supervisores, /equipos, /bitacoras, /tareas,
  /informes, /config, /stats, /health).
- Parámetros: 20 req/10s por IP, Block 10s.
- **Validada con Error 1015 real** en caldera-api.totis.cl.

### workers.dev (#6 ✅)
- Production + Preview **OFF en los 9 Workers**. Único acceso: dominios
  custom `*-api.totis.cl` (bajo WAF y controles de zona).
- Servicios de correo verificados post-apagado: `mail-api.totis.cl`
  (Consulta Online totis.cl) y hvac (Informe Técnico) — ambos con
  correo real recibido.

### Documentación
- README/CONTEXT actualizados: adq, supervisor, nls, caldera, ups, hvac.

### Pendientes restantes del mapa
- **#7** CSP Insights (`static.cloudflareinsights.com` en `script-src`) — riesgo bajo.
- **#9** Homologar CORS de hvac al patrón v2.3 (hoy en "Estilo 2" funcional).
- Validaciones S25 de dominios custom: aacc, hvac, generadores, mail (5/9 ya ✅).

- ## 08-jul-2026 — CORS hvac homologado a v2.3 (#9)

- `worker hvac` (hvac-api.totis.cl): migrado de ACAO fijo a
  `hvac-app.pages.dev` → whitelist dinámica (`hvac.totis.cl` +
  `hvac-app.pages.dev`) + `Vary: Origin` + rechazo 403.
- Mismo pase: catch ya no expone `err.message` al cliente (solo
  `console.error` server-side).
- Deploy vía Cloudflare Dashboard (Quick Edit). Validado Mac + S25 ✅.

- ## 08-jul-2026 (cont.) — Solicitud-Supervisor: whitelist ajustada + err.message + _headers

- `solicitud-supervisor-worker`: CORS ya estaba bien implementado (whitelist
  exacta, Vary, 403) — único ajuste: retirado `vgarcesb-cpu.github.io`
  (confirmado sin uso). catch ya no expone `err.message`.
- `_headers` no existía — creado con CSP + CSP Insights (#7) + connect-src
  a supervisor-api.totis.cl.
- Deploy: worker.js en Dashboard, _headers en GitHub. Validado Mac + S25 ✅.

- ## 09-jul-2026 — CORS real nls corregido + _headers creado

- `nls-worker` (nls-api.totis.cl): documentación decía v1.1 funcional,
  código real tenía ACAO:'*' + whitelist por `.includes()`/Referer +
  workers.dev (mismo patrón vulnerable que adq). Corregido a whitelist
  exacta (solo `nls.totis.cl`, GitHub Pages confirmado sin uso y retirado),
  Vary: Origin, rechazo 403.
- `_headers` no existía — creado con CSP + CSP Insights (#7) + connect-src
  a nls-api.totis.cl.
- catch sin exponer err.message. DELETE en cascada de equipos (bitacoras+
  tareas) ya estaba correcto, sin cambios.
- Deploy: worker.js vía Dashboard, _headers vía GitHub. Validado Mac + S25 ✅.

- ## 09-jul-2026 — caldera: whitelist depurada (github.io + pages.dev + localhost) + _headers

- `caldera-worker` (caldera-api.totis.cl): CORS ya era v2.3 real y correcto
  (whitelist exacta, Vary, 403, Resend en Secret) — sin hallazgo crítico.
- Ajustado a v2.5: retirado vgarcesb-cpu.github.io, localhost:8080 y
  caldera-app.pages.dev (patrón unificado — *.pages.dev no está cubierto
  por el WAF de zona totis.cl, mismo riesgo que workers.dev).
- catch global sin err.message; error de Resend ya no expone mensaje interno.
- `_headers` no existía — creado con CSP + CSP Insights (#7).
- Deploy: worker.js en Dashboard, _headers en GitHub. Validado Mac + S25 ✅.

- ## 09-jul-2026 — totis-mail-worker: whitelist depurada + err.message

- `totis-mail-worker` (mail-api.totis.cl): CORS ya era correcto (whitelist
  exacta, Vary, 403, Turnstile + Resend en Secrets) — sin hallazgo crítico.
- Ajustado a v1.2: retirado vgarcesb-cpu.github.io (patrón unificado, sin uso).
- catch y error de Resend ya no exponen mensajes internos al cliente.
- `_headers` ya tenía CSP Insights (#7) incluido — sin cambios ahí.
- Deploy: worker.js en Dashboard (no requirió tocar _headers). Validado
  Mac + S25 ✅ (los "rojos" en consola eran de Turnstile/Cloudflare,
  no relacionados al fix — formulario y correo funcionan bien).

  ## 09-jul-2026 — generadores: inyección SQL corregida (crítico) + CORS + key Resend

- `generadores-worker` (generadores-api.totis.cl): hallazgo crítico —
  inyección SQL en /api/bitacora y /api/mantenciones (generador_id
  concatenado directo al SQL, no parametrizado). Corregido con .bind().
- CORS "Estilo 2" (fallback a ALLOWED_ORIGINS[0], sin rechazo) corregido
  a whitelist real v1.1: solo generadores.totis.cl, retirado pages.dev
  y localhost:8080/:3000 (confirmado sin uso), Vary: Origin, rechazo 403.
- catch y error de Resend sin exponer mensajes internos. Guard agregado
  para RESEND_API_KEY faltante.
- `_headers` no existía — creado con CSP + CSP Insights (#7).
- Hallazgo operativo: generadores no tenía key Resend dedicada (causa
  de fallos al enviar informes) — creada key `generadores-worker-2026`
  en Resend y configurada como Secret. Correo enviado exitosamente.
- Deploy: worker.js en Dashboard, _headers en GitHub. Validado Mac + S25 ✅
  (primera validación S25 de este repo, incluyendo envío de correo).

  ## 09-jul-2026 — ups: whitelist depurada + key Resend rotada + _headers

- `ups-worker` (ups-api.totis.cl): CORS ya era v2.3 real y correcto
  (whitelist exacta, Vary, 403, guard NaN, DELETE atómico) — sin
  hallazgo crítico. Ajustado a v2.4: retirado vgarcesb-cpu.github.io,
  ups-app.pages.dev y localhost:8080/:3000 (confirmado sin uso).
- catch y error de Resend sin exponer mensajes internos.
- `_headers` no existía — creado con CSP + CSP Insights (#7).
- Rotación completa de key Resend: existían 2 keys ambiguas
  (ups-worker-2026, ups-app-prod) — creada ups-worker-2026-v2,
  configurada como Secret, verificado envío de correo, y solo
  entonces borradas ambas keys viejas en Resend.
- Deploy: worker.js en Dashboard, _headers en GitHub. Validado
  Mac + S25 ✅ (incluye envío de correo con la key nueva).

## 09-jul-2026 (cont.) — aacc: CORS duro corregido + migración EmailJS→Resend + _headers

- `portal-aacc-fach-api`: modelo "CORS duro" (rechaza Origin vacío) confirmado
  real, pero el mecanismo era vulnerable (.includes()/Referer). Corregido a
  whitelist exacta + ACAO dinámico + Vary: Origin, manteniendo el rechazo
  de Origin vacío como comportamiento intencional.
- Agregado try/catch global (antes ausente — errores no capturados devolvían
  la página de error genérica de Cloudflare sin headers CORS).
- crearEquipo() ya no expone e.message.
- Comentario incorrecto sobre Cloudflare Access removido (confirmado: aacc
  NO tiene Zero Trust).
- `_headers` no existía — creado con CSP + CSP Insights (#7).
- Migración completa EmailJS → Resend: agregado endpoint /api/send-email
  al worker.js, creada key dedicada aacc-worker-2026 en Resend y
  configurada como Secret, index.html actualizado (quitado script EmailJS,
  pestaña de configuración EmailJS, función enviarReporteEmail() reescrita
  para llamar al Worker). CSP ajustado (cdnjs.cloudflare.com en connect-src,
  necesario para jsPDF).
- Deploy: worker.js + index.html en Dashboard/GitHub, _headers en GitHub.
  Validado Mac + S25 ✅ (primera validación S25 de este repo, incluyendo
  envío de correo).

### CIERRE DEL CICLO DE SANEAMIENTO — 9/9 Workers saneados (09-jul-2026)

## 09-jul-2026 (cont.) — hvac: retirado pages.dev + recuperado /api/send-email

- Confirmado sin uso `hvac-app.pages.dev` — retirado de la whitelist,
  igual que en caldera/generadores/ups.
- Hallazgo: al hacer el fix #9 (08-jul), el worker.js recibido no incluía
  el endpoint /api/send-email que sí usa el frontend (hvac-worker-2026 ya
  existía como key Resend) — se perdió al reemplazar el archivo completo.
  Corregido: endpoint restaurado, mismo patrón que el resto (Resend +
  guard de RESEND_API_KEY + catch sin err.message).
- Deploy: worker.js en Dashboard. Validado Mac + S25 ✅, correo enviado
  y recepcionado con éxito.

  ## 10-jul-2026 — DNS revisado (pendiente #6 cerrado)

- Revisados los 22 registros DNS de la zona totis.cl contra el inventario
  real de 9 Workers + repos conocidos — todos coinciden, ningún CNAME
  huérfano real.
- Encontrados 2 registros de Amazon SES sin relación con el ecosistema
  actual (send.totis.cl MX + TXT SPF amazonses.com) — sin evidencia de
  cuenta AWS activa, confirmado por Toti's sin uso — eliminados.
- resend._domainkey (TXT) confirmado como necesario para Resend, sin tocar.
- Hallazgo nuevo: totis-api.totis.cl / Worker totis-worker (contador de
  visitas) nunca pasó por el ciclo de saneamiento CORS — agregado a
  pendientes-totis para auditar en sesión futura.

  ## 10-jul-2026 — totis-worker (contador de visitas) saneado

- CORS "Estilo 2" (fallback sin rechazo) corregido a whitelist real
  (totis.cl + www.totis.cl), Vary: Origin, rechazo 403.
- catch sin exponer err.message en ambas rutas (/api/visita, /api/visitas).
- Sin inyección SQL (ya usaba .bind() correctamente).
- _headers ya existía (compartido con totis-mail-worker), sin cambios.
- Deploy: worker.js en Dashboard. Validado Mac + S25 ✅.

- ## 10-jul-2026 — Cuenta EmailJS eliminada

- Verificado con GitHub code search (user:vgarcesb-cpu) que no queda
  ningún uso activo de EmailJS en el código de ningún repo — 0 archivos
  coincidentes, solo 9 commits históricos del retiro ya hecho en aacc
  y totis-web.
- Cuenta EmailJS eliminada por Toti's.
- EmailJS queda completamente fuera del ecosistema totis.cl.
