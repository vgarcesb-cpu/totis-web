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
