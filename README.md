# Toti's - Tarjeta de Presentación Web

Sitio web profesional de Toti's con diseño moderno, efectos 3D y botones interactivos para contacto directo.

## 🎨 Características

- **Diseño Responsivo**: Optimizado para móviles, tablets y escritorio
- **Efectos 3D**: Gradientes animados y elementos flotantes
- **Botones Interactivos**: Enlaces directos a WhatsApp y Email
- **Rendimiento Rápido**: HTML puro sin dependencias externas
- **SEO Optimizado**: Meta tags y estructura semántica

## 📋 Contenido

- **Nombre**: Toti's
- **Profesión**: Systems Developer
- **Servicios**: Troubleshooting Assistance | Full Stack
- **WhatsApp**: +56 9 3407 2459
- **Email**: vgarcesb@gmail.com
- **Dominio**: totis.cl

## 🚀 Despliegue en Cloudflare Pages

### Paso 1: Preparar el Repositorio en GitHub

1. **Clonar o crear un repositorio** en GitHub con el nombre `totis-web`
2. **Subir los archivos** del proyecto:
   - `index.html` (archivo principal)
   - `README.md` (este archivo)

### Paso 2: Conectar Cloudflare Pages a GitHub

1. Ir a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Seleccionar **Pages** en el menú lateral
3. Hacer clic en **Crear un proyecto**
4. Seleccionar **Conectar a Git**
5. Autorizar a Cloudflare para acceder a tu cuenta de GitHub
6. Seleccionar el repositorio `totis-web`
7. Hacer clic en **Comenzar la configuración**

### Paso 3: Configurar el Despliegue

En la pantalla de configuración del proyecto:

- **Nombre del proyecto**: `totis-web` (o el que prefieras)
- **Rama**: `main`
- **Comando de compilación**: Dejar vacío (no es necesario)
- **Directorio de salida**: `/` (raíz del repositorio)

Hacer clic en **Guardar e implementar**

### Paso 4: Conectar tu Dominio Personalizado

Una vez desplegado:

1. En el panel de Cloudflare Pages, ir a **Configuración**
2. En la sección **Dominios personalizados**, hacer clic en **Agregar dominio**
3. Ingresar `totis.cl`
4. Seguir las instrucciones para configurar los registros DNS

#### Opción A: Usar Nameservers de Cloudflare (Recomendado)

1. Copiar los nameservers proporcionados por Cloudflare
2. Ir a tu registrador de dominio (donde compraste totis.cl)
3. Cambiar los nameservers a los de Cloudflare
4. Esperar 24-48 horas para la propagación DNS

#### Opción B: Usar Registros CNAME

Si prefieres mantener tu registrador actual:

1. En tu registrador, crear un registro CNAME:
   - **Nombre**: `www` (o `@` para la raíz)
   - **Valor**: `totis-web.pages.dev` (o el que Cloudflare indique)
2. Esperar la propagación DNS

### Paso 5: Verificar el Despliegue

1. Esperar a que Cloudflare valide el dominio (puede tomar unos minutos)
2. Acceder a `https://totis.cl` en tu navegador
3. Verificar que el sitio se carga correctamente

## 📱 Optimizaciones

- **Mobile First**: Diseño adaptable a cualquier tamaño de pantalla
- **Performance**: Carga ultra-rápida sin JavaScript pesado
- **Accesibilidad**: Contraste adecuado y navegación por teclado

## 🔧 Personalización

Para editar el contenido del sitio, modifica el archivo `index.html`:

- **Nombre**: Busca `<h1 class="title">Toti's</h1>`
- **Descripción**: Busca `<p class="description">Troubleshooting Assistance | Full Stack</p>`
- **WhatsApp**: Busca `href="https://wa.me/56934072459"`
- **Email**: Busca `href="mailto:vgarcesb@gmail.com"`
- **Colores**: Modifica los valores en la sección `<style>`

## 📞 Soporte

Para cambios o actualizaciones:

1. Editar `index.html` localmente
2. Hacer commit y push a GitHub
3. Cloudflare Pages se actualizará automáticamente

## 📄 Licencia

© 2024 Toti's. Todos los derechos reservados.

---

**Nota**: Este sitio está alojado en Cloudflare Pages de forma gratuita. No hay límites de ancho de banda ni de solicitudes.
