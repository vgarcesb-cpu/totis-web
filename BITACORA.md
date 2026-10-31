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

- ## 10-jul-2026 — Sistema de informes técnicos unificado (prueba: hvac + caldera)

- Creado módulo compartido shared/informes.js en totis-web
  (https://totis.cl/shared/informes.js), genera el HTML del correo de
  informe técnico de forma unificada (KPIs + secciones con tablas),
  parametrizable por app (colores, ícono, secciones).
- hvac: enviarInformeCorreo() migrada al módulo compartido. _headers
  actualizado (https://totis.cl en script-src). Validado Mac, correo
  recibido con diseño correcto.
- caldera: enviarInformeCorreo() migrada al módulo compartido (4 secciones:
  Ficha Técnica, Componentes, Bitácora, Empresa Mantenedora). _headers
  actualizado. Validado Mac, correo recibido con diseño correcto.
- El generador de "Informe Editable" (PDF con firmas) NO se tocó en
  ninguna de las 2 apps — sigue siendo independiente por diseño, tal
  como se acordó (alcance: solo HTML de correo).
- Hallazgo nuevo (no relacionado): tablas de Ficha Técnica/Quemador del
  Informe Editable de caldera aparecen vacías — sin confirmar si es
  pre-existente o nuevo, agregado a pendientes-totis para revisar aparte.
- Pendiente: replicar el patrón en ups, generadores, aacc, mail (mismo
  proceso: agregar https://totis.cl a _headers + migrar función de envío).

  ## 12-jul-2026 — ups: informe unificado con TotisInformes

- enviarInformeCorreo() migrada al módulo compartido shared/informes.js.
  Secciones: Listado UPS activos, Equipos retirados (condicional), Empresa
  Mantenedora. _headers actualizado (https://totis.cl en script-src).
  descargarInformeEditable() sin tocar.
- Validado Mac: consola sin errores CSP, correo recibido con diseño
  unificado correcto.

---

## 29-oct-2026 — Revisión de APIs: caldera cerrada, diagnóstico de las 11 APIs y mail-api v1.3

### caldera (repo `caldera-app`) ✅
- La API estaba abierta: `caldera-api.totis.cl` solo filtraba por `Origin`.
- Ahora vive en `caldera.totis.cl/api/*` detrás de Cloudflare Access y el Worker valida el JWT. `caldera-api.totis.cl` retirado. Worker v2.9. Detalle en el CONTEXT.md de `caldera-app`.

### Diagnóstico sin login de las 11 APIs `*-api.totis.cl`
| API | Resultado |
|---|---|
| `industrial-api` | Protegida con Access |
| `mail-api` | Pública a propósito (formularios de totis.cl). Turnstile + destinatario fijo |
| `aacc-api`, `ups-api` | `/api/health` responde sin login. Revisar primero |
| `cartilla-api` | Solo filtra por `Origin` |
| `supervisor-api` | Pide clave de sincronización. Revisar dónde se guarda |
| `adq-api`, `generadores-api`, `hvac-api`, `nls-api`, `totis-api` | El Worker responde sin login. Revisar rutas con datos |

Orden acordado para la revisión completa: aacc, adq, cartilla, generadores, hvac, industrial, (mail ✅), nls, supervisor, totis, ups.

### mail-api — `totis-mail-worker` v1.4 ✅
- Límites por campo (nombre 100, correo 254, teléfono 30, red 50, mensaje 2000) y cuerpo máximo 20 KB medido en bytes.
- Turnstile exige `hostname` totis.cl o www.totis.cl.
- v1.4: el Worker deshace el escape de `cpSanitize()` del formulario antes de medir el largo y escapa una sola vez al armar el correo.
- El código del Worker queda en este repo: `workers/totis-mail-worker.js`.
- `index.html`: `maxlength=2000` en el campo de consulta.

## 30-oct-2026 — aacc-api cerrada (Worker v3.4)

### aacc (repo `portal-aacc-fach`) ✅
- El portal `aacc.totis.cl` ya tenía Access, pero el API vivía en `aacc-api.totis.cl`, que no lo tenía. Con curl y un `Origin` inventado se podía leer, cambiar y borrar datos, y mandar correos desde `aacc@totis.cl`.
- Ahora el API está en `aacc.totis.cl/api/*` (Worker Route) detrás del mismo PIN. El Worker v3.4 valida el JWT de Access, limita el largo de cada campo y revisa el destinatario del correo.
- `aacc-api.totis.cl` eliminado (dominio y DNS). Sin login responde 401 por todas las vías probadas.
- Probado en el Mac: Configuración → Probar Conexión muestra v3.4.0. Pendiente: prueba en el S26 (guardar y enviar reporte).
- Detalle en el CONTEXT.md §6 de `portal-aacc-fach` (PR #1).

Siguiente en la lista: `adq-api`.

## 30-oct-2026 (cont.) — adq-api cerrada (Worker v2.4)

### adq (repo `Portal-Adq`) ✅
- `adq.totis.cl` tenía Access, pero el API vivía en `adq-api.totis.cl`, sin Access, y el Worker aceptaba peticiones sin `Origin`. Sin login se podían leer y borrar solicitudes oficiales y respaldos de supervisor, con firmas.
- Ahora el API está en `adq.totis.cl/api/*` (Worker Route). El Worker v2.4 valida el JWT de Access, quita el prefijo `/api`, limita el largo de cada campo y de la lista de materiales, y solo acepta la firma como imagen JPEG/PNG.
- El frontend avisa cuando no se guarda en el historial (antes fallaba en silencio) y cuando vence la sesión.
- `adq-api.totis.cl` eliminado (dominio y DNS). URL `workers.dev` desactivada.
- Probado en el Mac: `/api/health` responde v2.4 con sesión y el Historial carga. Pendiente: prueba en el S26 (respaldo de supervisor).
- Detalle en el CONTEXT.md de `Portal-Adq` (PR #1).

Siguiente en la lista: `cartilla-api`.

## 30-oct-2026 (cont.) — cartilla-api cerrada (Worker v1.1.0)

### cartilla (repo `cartilla-generadores-app`) ✅
- El Worker aceptaba cualquier `Origin` terminado en `.pages.dev` y no pedía login: se podían leer todas las cartillas y sobrescribir cualquiera. Además `cartilla.totis.cl` no estaba en la lista de orígenes, así que el respaldo desde el portal real nunca funcionó (D1 con 3 registros, el último del 22-jul).
- Ahora el API está en `cartilla.totis.cl/api/*` (Worker Route). El Worker v1.1.0 valida el JWT de Access, usa whitelist exacta, mide el cuerpo en bytes (5 MB) y solo acepta foto y firma como imagen.
- En la app, el respaldo se activa con un botón en "Sync nube" (ya no se escribe una URL) y solo funciona desde `cartilla.totis.cl`.
- `cartilla-api.totis.cl` eliminado. URLs `workers.dev` (producción y vista previa) apagadas.
- Probado en el Mac: "Conectado: cartilla-generadores v1.1.0" y "Traer respaldo" recibió los 3 registros. Pendiente: prueba en el S26 (cartilla con foto y firma).
- Detalle en el CONTEXT.md de `cartilla-generadores-app` (PR #1).

Siguiente en la lista: `generadores-api`.

## 31-oct-2026 — generadores-api cerrada (Worker v1.2)

### generadores (repo `generadores-app`) ✅
- `generadores.totis.cl` tenía Access, pero el API vivía en `generadores-api.totis.cl`, sin Access, y el Worker aceptaba peticiones sin `Origin`. Sin login se podía leer, cambiar y borrar generadores, y mandar correos desde `generadores@totis.cl` a cualquier dirección.
- El `worker.js` del repo era la v1.0, con la inyección SQL que ya se había corregido en producción (v1.1). Ahora el repo tiene la versión real.
- Ahora el API está en `generadores.totis.cl/api/*` (Worker Route). El Worker v1.2 valida el JWT de Access, limita el largo de cada campo, revisa el destinatario del correo y agrega `/api/health`.
- `generadores-api.totis.cl` eliminado. URLs `workers.dev` ya estaban apagadas.
- Probado en el Mac: `/api/health` responde v1.2 y el Dashboard carga. La base `generadores-db` está vacía (0 generadores, 0 mantenciones): la app nunca se ha usado con datos reales.
- Detalle en el README de `generadores-app` (PR #1).

Siguiente en la lista: `hvac-api`. Pendiente aparte: borrar la cartilla (decisión de Víctor).

## 31-oct-2026 (cont.) — hvac-api cerrada (Worker v2.5)

### hvac (repo `hvac-app`) ✅
- `hvac.totis.cl` tenía Access, pero el API vivía en `hvac-api.totis.cl`, sin Access, y el Worker aceptaba peticiones sin `Origin`. Sin login se podían leer y crear equipos y mantenimientos, y mandar correos desde `hvac@totis.cl` a cualquier dirección.
- El `worker.js` del repo estaba en v2.3 (producción v2.4). Ahora el repo tiene la versión real.
- Ahora el API está en `hvac.totis.cl/api/*` (Worker Route). El Worker v2.5 valida el JWT de Access, limita el largo de cada campo, revisa el destinatario del correo y agrega `/api/health`.
- `hvac-api.totis.cl` eliminado. URLs `workers.dev` apagadas.
- Workers Builds del Worker `hvac-app`: apagadas las compilaciones de ramas de no producción (fallaban siempre con el error 10021 por el `database_id` de ejemplo en `wrangler.toml`). En `main` el comando de despliegue es `echo ok`, así que no publica nada.
- Probado en el Mac: `/api/health` responde v2.5. La base tiene 1 equipo y 2 mantenciones.
- Pendiente de decisión: Codex sugirió acortar a 30 s la espera para recargar las llaves de Access (hoy 5 min, igual en los 6 Workers). Recomendación: dejarlo así.
- Detalle en el CONTEXT.md de `hvac-app` (PR #1).

Siguiente en la lista: `industrial-api` (solo verificar). Pendiente aparte: borrar la cartilla.

## 31-oct-2026 (cont.) — industrial verificada, nls-api cerrada (Worker v1.3)

### industrial (`totis-industrial-api` v0.2.0) ✅ sin cambios
- Ya estaba bien: Access cubre `industrial.totis.cl` e `industrial-api.totis.cl`, el Worker valida el JWT y revisa usuario, permisos y empresa en D1. `workers.dev` apagado.
- Dos mejoras menores para más adelante: quitar el respaldo que lee el header de email cuando falta el JWT, y bajar de 1 hora a 5 min la recarga de llaves de Access cuando llega un `kid` desconocido.

### nls (repo `nls`) ✅
- `nls.totis.cl` tenía Access, pero el API vivía en `nls-api.totis.cl`, sin Access, y el Worker aceptaba peticiones sin `Origin`. Sin login se podían leer y borrar equipos, bitácoras, tareas e informes.
- Ahora el API está en `nls.totis.cl/api/*` (Worker Route). El Worker v1.3 valida el JWT de Access, limita el largo de cada campo, exige fechas AAAA-MM-DD y en `/config` solo guarda las claves conocidas.
- Corregido de paso: `extras` llegaba como texto y por eso nunca se mostraban las alertas R-22 / SESMA ni los datos específicos de la hoja de vida.
- Frontend: URL del API fija (`/api`), aviso de sesión vencida, `escH()` en los renders que faltaban y `maxlength` en los campos de texto.
- `nls-api.totis.cl` eliminado. `workers.dev` ya estaba apagado.
- Probado en el Mac: `nls.totis.cl/api/health` responde v1.3. La base está vacía.
- Detalle en el CONTEXT.md de `nls` (PR #1).

Siguiente en la lista: `supervisor-api`. Pendiente aparte: borrar la cartilla.

## 31-oct-2026 (cont.) — supervisor y totis verificadas, ups-api cerrada (Worker v2.5). Fin de la revisión de APIs

### supervisor (`solicitud-supervisor-worker` v1.4) ✅ sin cambios
- Ya estaba protegida desde el 28/29-oct: toda ruta de datos exige la clave de sincronización (Secret `SYNC_KEY`, comparación en tiempo constante). Sin clave responde 401. `/health` es pública y solo informa versión y si la clave es válida.
- No usa Access a propósito: la PWA trabaja offline en el S26 y sincroniza con la clave.
- `workers.dev` apagado. El repo coincide con producción.

### totis-api (`totis-worker` v1.1) ✅ sin cambios
- Contador de visitas de la portada. Es público por diseño: suma una visita por IP al día y entrega el total. No expone datos.
- `workers.dev` apagado; solo `totis-api.totis.cl`, detrás del WAF de la zona.

### Hallazgo: Worker huérfano `totis-web`
- Primera versión del correo del sitio (v1.1, julio). La reemplazó `totis-mail-worker` (`mail-api.totis.cl`) y nadie lo llama, pero sigue encendido en `totis-web.vgarcesb.workers.dev`, fuera del WAF, con una clave de Resend y la de Turnstile como Secrets.
- Turnstile impide el spam y el destino es fijo, así que el riesgo es bajo. Queda en pendientes para borrarlo. Ojo: no confundir con el proyecto de Pages `totis-web`.

### ups (repo `ups-app`) ✅
- `ups.totis.cl` tenía Access, pero el API vivía en `ups-api.totis.cl`, sin Access, y el Worker aceptaba peticiones sin `Origin`. Sin login se podían leer, crear y borrar UPS, mantenciones y empresas, y mandar correos con HTML libre desde `ups@totis.cl` a cualquier dirección.
- El `worker.js` del repo estaba en v2.1 (producción v2.4). Ahora el repo tiene la versión real.
- Ahora el API está en `ups.totis.cl/api/*` (Worker Route). El Worker v2.5 valida el JWT de Access, limita tamaños y largos, revisa fechas, horas e IDs, valida el destinatario del correo y deja en el log quién envía o borra.
- Frontend: API en el mismo dominio, aviso de sesión vencida, `escH()` en 33 lugares que faltaban, `maxlength` en los campos.
- Probado en el Mac: `ups.totis.cl/api/health` responde v2.5 y `ups-api.totis.cl` sin PIN respondía "No autenticado". `ups-api.totis.cl` eliminado; `workers.dev` apagado. La base tiene 0 UPS y 1 mantención.
- Detalle en el CONTEXT.md de `ups-app` (PR #1).

### Resultado de la revisión (29 al 31-oct-2026)
- Revisadas las 11 APIs: mail, aacc, adq, cartilla, generadores, hvac, industrial, nls, supervisor, totis y ups.
- Cerradas 8 que se podían usar sin login: aacc, adq, cartilla, generadores, hvac, nls, ups (API movida a `<portal>.totis.cl/api/*` + JWT de Access) y mail (v1.4). Caldera se cerró antes, el 29-oct.
- Ya estaban bien: industrial (Access + JWT + permisos en D1), supervisor (clave de sincronización) y totis (contador público por diseño).

### Pendientes para la próxima sesión
1. ~~Borrar la cartilla~~ ✅ hecho el 31-oct-2026 (ver entrada siguiente).
2. Borrar el Worker huérfano `totis-web`: 1) abrir el `totis-web` con ícono de Worker; 2) confirmar que en Dominios aparece `totis-web.vgarcesb.workers.dev` y en Configuración están `RESEND_API_KEY` y `TURNSTILE_SECRET_KEY`; 3) apagar los dos interruptores de `workers.dev` y verificar que dejó de responder; 4) Configuración → Eliminar, confirmando con el nombre `totis-web`.
3. Decidir la espera para recargar las llaves de Access cuando cambian (hoy 5 min en los Workers con JWT; Codex sugirió 30 s). Recomendación: dejar 5 min.
4. Pruebas en el S26 de aacc, adq, cartilla, generadores, hvac, nls y ups.
5. Opcional: corregir en caldera los datos "Ubicación" y "Test" de la Bomba Nº1.

### Mejoras menores (no urgentes)
1. industrial: quitar el respaldo que lee el header de email cuando falta el JWT.
2. industrial: bajar de 1 hora a 5 min la recarga de llaves de Access ante un `kid` desconocido.
3. supervisor: medir el tamaño real del cuerpo recibido, no solo el `Content-Length` que declara el cliente (hoy igual recorta cada campo, sin riesgo práctico).

## 31-oct-2026 (tarde) — Cartilla Generadores eliminada

- Antes de borrar se comparó con generadores.totis.cl. Lo que vale la pena traer (pauta Finning CAT de 68 ítems con estados, llenado por módulos, foto de evidencia, WhatsApp, modo sin conexión) quedó en `generadores-app/docs/cartilla-vs-generadores.md`, junto con una copia del código en `docs/referencia-cartilla/`. Se trabajará en otra sesión.
- Sin respaldo de datos, por decisión de Víctor (eran 3 registros de prueba del 22-jul).
- Borrado y verificado en orden: app de Access `cartilla`, ruta `cartilla.totis.cl/api/*`, Worker `cartilla-generadores-worker`, dominio y proyecto Pages `cartilla-generadores-app`, CNAME `cartilla.totis.cl` (lo quitó Cloudflare con el dominio), D1 `cartilla-generadores-db` y repo de GitHub `cartilla-generadores-app`.
- Falta desinstalar la PWA del S26.
- Quedan 7 rutas `/api/*` (aacc, adq, caldera, generadores, nls, hvac, ups) y 10 bases D1.
