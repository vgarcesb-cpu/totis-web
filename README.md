# TOTI'S® — totis-web
**Víctor Manuel Garcés Borje · Systems Developer · www.totis.cl**

---

## ✅ Lo que está hecho

### Página web
- [x] `index.html` limpio — código propio, sin Manus AI
- [x] Diseño oscuro con imagen de fondo `fondo.png` (tuya, en el repo)
- [x] Logo TOTI'S® con animación gold
- [x] Nombre + roles visibles contra cualquier fondo (backdrop-filter)
- [x] 4 tarjetas de proyectos enlazadas
- [x] Botones WhatsApp / Facebook / Instagram con colores hover correctos
- [x] Footer © 2026

### Dominio y hosting
- [x] Hosting en GitHub Pages (gratis)
- [x] Dominio `totis.cl` comprado en NIC.cl
- [x] DNS gestionado por Cloudflare
- [x] `www.totis.cl` funcionando con HTTPS ✅
- [x] Proxy Cloudflare activo (protección ON)

### Sistema de contacto
- [x] Modal "Conectemos" al hacer clic en redes sociales
- [x] Captura: Nombre + Correo + Teléfono
- [x] EmailJS configurado (`service_wpd3adq` + `template_82bw0m7`)
- [x] Email llega a `vgarcesb@gmail.com` con cada visitante
- [x] Visitante accede a la red social después de llenar el formulario
- [x] Formspree reemplazado — ya no se necesita

### Seguridad
- [x] Apps industriales (hvac, ups, caldera, generadores) en privado ✅

---

## ⏳ Lo que queda pendiente

### DNS Cloudflare (revisar con calma)
- [ ] CNAME `totis.cl` (apex) — revisar si apunta correcto
- [ ] CNAME `portal` → `m9tjbuvt.up.railway.app` — ¿qué es esto? ¿se necesita?

### Apps industriales → mover a Cloudflare Pages
- [ ] `generadores-app` → `generadores.totis.cl`
- [ ] `hvac-app` → `hvac.totis.cl`
- [ ] `ups-app` → `ups.totis.cl`
- [ ] `caldera-app` → `caldera.totis.cl`
- [ ] Conectar Worker + D1 en cada app
- [ ] Desactivar GitHub Pages en los 4 repos (ya no se necesita)

### Diseño (opcional, cuando quieras)
- [ ] Cambiar `fondo.png` por otra imagen si encuentras una mejor
- [ ] Hacer tarjetas de proyectos más transparentes
- [ ] Agregar sección "Sobre mí" o descripción profesional

### Monetización (futuro)
- [ ] Sistema de login en Cloudflare Worker
- [ ] Acceso de pago a las apps industriales
- [ ] totis.cl como portal de entrada a los servicios

---

## 🗂️ Stack completo

| Componente | Tecnología | Estado |
|---|---|---|
| Frontend página | HTML + CSS + JS | ✅ Activo |
| Hosting página | GitHub Pages | ✅ Activo |
| Dominio | NIC.cl → totis.cl | ✅ Activo |
| DNS + HTTPS | Cloudflare | ✅ Activo |
| Email visitantes | EmailJS | ✅ Activo |
| Apps industriales | Cloudflare Pages + Workers + D1 | ⏳ Pendiente |

---

## 🔑 Credenciales EmailJS (guardar seguro)
- **Public Key:** `pBSsyCYXRuhGYOL4v`
- **Service ID:** `service_wpd3adq`
- **Template contacto totis.cl:** `template_82bw0m7`
- **Template informes UPS/Calderas:** `template_nebk2wa`
- **Notificaciones a:** `vgarcesb@gmail.com`

---

*Última actualización: Mayo 2026*
