# TOTI'S® — Plan de Trabajo
**Víctor Manuel Garcés Borje · Systems Developer · www.totis.cl**
*Última actualización: Mayo 2026*

---

## ✅ Completado

### Página web totis-web
- [x] index.html limpio — código propio, sin Manus AI
- [x] Diseño oscuro con imagen de fondo fondo.png (tuya, en el repo)
- [x] Logo TOTI'S® con animación gold
- [x] Pills SYSTEMS DEVELOPER visibles con backdrop-filter
- [x] 4 tarjetas de proyectos enlazadas a dominios propios
- [x] Botones WhatsApp / Facebook / Instagram con colores hover
- [x] Modal "Conectemos" — captura visitantes antes de acceder a redes
- [x] EmailJS conectado → notificación a vgarcesb@gmail.com
- [x] Footer © 2026

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

### Seguridad
- [x] 4 repos de apps en privado ✅
- [x] EmailJS con MFA activado ✅

---

## ⏳ Pendiente — Por orden de prioridad

### 1. Proteger apps con login (usuario y contraseña)
- [ ] generadores.totis.cl → login simple
- [ ] caldera.totis.cl → login simple
- [ ] ups.totis.cl → login simple
- [ ] hvac.totis.cl → login simple
> ⚠️ Urgente — ahora mismo cualquiera puede usar las apps gratis

### 2. Sistema de informes técnicos (PDF + Correo)
- [ ] Diseñar plantilla PDF ordenada cronológicamente
- [ ] Estructura: Encabezado → Resumen → Hoja de Vida → Historial → Bitácora → Firma
- [ ] Botón "Descargar PDF" → respaldo en Mac
- [ ] Botón "Enviar Informe" → Resend con PDF adjunto a jefatura
- [ ] Correo sale desde dominio propio (calderas@totis.cl, ups@totis.cl...)
- [ ] Empezar por caldera-app (urgente por evento inundación)
- [ ] Luego ups-app → hvac-app → generadores-app

### 3. Estandarizar workers (CORS Estilo 2)
- [ ] generadores-worker → migrar a ALLOWED_ORIGINS array
- [ ] hvac-worker → reescribir CORS hardcodeado
- [ ] caldera-worker → ya ok ✅
- [ ] ups-worker → ya ok ✅
> No urgente — cuando las apps estén estables

### 4. DNS Cloudflare — revisar pendientes
- [ ] CNAME totis.cl apex → verificar
- [ ] CNAME portal → Railway → ¿se necesita?
- [ ] jolly-butterfly-ac12 → describir o eliminar

### 5. Mejoras diseño totis-web (opcional)
- [ ] Cambiar fondo.png si se encuentra imagen mejor
- [ ] Tarjetas proyectos más transparentes

---

## 🏗️ Arquitectura Stack Toti's

| Componente | Tecnología | URL |
|---|---|---|
| Página presentación | GitHub Pages | www.totis.cl |
| DNS + HTTPS | Cloudflare | — |
| Apps industriales | Cloudflare Pages | *.totis.cl |
| API backend | Cloudflare Workers | *.workers.dev |
| Base de datos | Cloudflare D1 | — |
| Email visitantes | EmailJS | Modal redes sociales |
| Email informes | Resend | Informes a jefatura |

---

## 📧 División clara de emails

```
EmailJS → totis-web (redes sociales)
          Notifica a vgarcesb@gmail.com
          Service: service_wpd3adq
          Template: template_82bw0m7

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
