# TOTI'S® — Plan de Trabajo
**Víctor Manuel Garcés Borje · Systems Developer · www.totis.cl**
*Última actualización: 13 Mayo 2026*

---

## ✅ Completado

### Página web — totis-web
- [x] index.html limpio — código propio, sin Manus AI
- [x] Diseño oscuro con imagen de fondo fondo.png (tuya, en el repo)
- [x] Logo TOTI'S® con animación gold
- [x] Pills SYSTEMS DEVELOPER visibles con backdrop-filter
- [x] 4 tarjetas enlazadas a dominios propios *.totis.cl
- [x] Botones WhatsApp / Facebook / Instagram con colores hover
- [x] Modal "Conectemos" — captura visitantes antes de acceder a redes
- [x] EmailJS conectado → notificación a vgarcesb@gmail.com
- [x] Footer © 2026
- [x] WhatsApp real configurado (+56 9 3407 2459)

### Dominio y hosting
- [x] www.totis.cl funcionando con HTTPS ✅
- [x] DNS gestionado por Cloudflare
- [x] Proxy Cloudflare activo

### Apps industriales — dominios propios
- [x] generadores.totis.cl → Active ✅
- [x] caldera.totis.cl → Active ✅
- [x] ups.totis.cl → Active ✅
- [x] hvac.totis.cl → Active ✅

### Workers — CORS actualizado
- [x] generadores-worker → acepta generadores.totis.cl
- [x] caldera-worker → acepta caldera.totis.cl
- [x] ups-worker → acepta ups.totis.cl
- [x] hvac-worker → acepta hvac.totis.cl

### Seguridad — Cloudflare Zero Trust
- [x] generadores.totis.cl → login PIN ✅
- [x] caldera.totis.cl → login PIN ✅
- [x] ups.totis.cl → login PIN ✅
- [x] hvac.totis.cl → login PIN ✅
- [x] Team domain: totis.cloudflareaccess.com
- [x] Autenticación: One Time PIN a vgarcesb@gmail.com
- [x] 4 repos apps en privado ✅
- [x] EmailJS con MFA activado ✅

---

## ⏳ Pendiente — Por orden de prioridad

### 1. Seguridad adicional en Cloudflare
- [x] Bot Fight Mode → activado ✅
- [x] AI Labyrinth → activado ✅
- [x] Hotlink Protection → activado ✅
- [x] WAF Chile → solo Chile entra ✅
- [ ] Archivo _headers en cada repo (XSS, Clickjacking, MIME)

### 2. Sistema de informes técnicos (PDF + Correo Resend)
- [ ] Diseñar plantilla PDF ordenada cronológicamente
- [ ] Estructura: Encabezado → Resumen → Hoja de Vida → Historial → Bitácora → Firma
- [ ] Botón "Descargar PDF" → respaldo en Mac
- [ ] Botón "Enviar Informe" → Resend con PDF adjunto a jefatura
- [ ] Correo sale desde dominio propio (calderas@totis.cl, ups@totis.cl...)
- [ ] Empezar por caldera-app (urgente — equipo fuera de servicio por inundación)
- [ ] Luego ups-app → hvac-app → generadores-app

### 3. Estandarizar workers (CORS Estilo 2)
- [ ] generadores-worker → migrar a ALLOWED_ORIGINS array
- [ ] hvac-worker → reescribir CORS hardcodeado
- [ ] caldera-worker → ya ok ✅
- [ ] ups-worker → ya ok ✅

### 4. Cron Triggers — mantenimiento automático
- [ ] Recordatorio mantención próxima → correo automático
- [ ] Resumen mensual automático por equipo
- [ ] Alerta si equipo lleva X días sin registro

### 5. DNS Cloudflare — revisar pendientes
- [ ] CNAME totis.cl apex → verificar apunta correcto
- [ ] CNAME portal → Railway → ¿se necesita?
- [ ] jolly-butterfly-ac12 worker → describir o eliminar

### 6. Mejoras diseño totis-web (opcional)
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
| API backend | Cloudflare Workers | *.workers.dev |
| Base de datos | Cloudflare D1 (SQLite) | — |
| Email visitantes | EmailJS | Modal redes sociales |
| Email informes | Resend | Informes técnicos a jefatura |

---

## 📧 División clara de emails

```
EmailJS → totis-web (redes sociales)
          Notifica a vgarcesb@gmail.com
          Service: service_wpd3adq
          Template contacto: template_82bw0m7

Resend  → Apps industriales (informes PDF)
          Sale desde dominio propio
          calderas@totis.cl / ups@totis.cl
          Para auditoría noviembre
```

---

## 📱 Estado equipos industriales

| App | Equipo | Estado |
|---|---|---|
| caldera-app | 1 Caldera ACS | ⚠️ Fuera de servicio — inundación |
| ups-app | 1 UPS | 🔄 Próxima renovación |
| hvac-app | ~20 Aires acondicionados | ✅ Operativos |
| generadores-app | 1 Generador | ✅ Operativo |

---

## 🔑 Credenciales EmailJS
- **Public Key:** pBSsyCYXRuhGYOL4v
- **Service ID:** service_wpd3adq
- **Template contacto totis.cl:** template_82bw0m7
- **Template informes:** template_nebk2wa
