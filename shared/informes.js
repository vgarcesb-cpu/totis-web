/**
 * informes.js — Módulo compartido de informes técnicos, Stack Toti's
 * Genera el HTML del correo de "Informe Técnico" de forma unificada
 * para todas las apps del ecosistema totis.cl.
 *
 * USO (desde cualquier app):
 *   <script src="https://totis.cl/shared/informes.js"></script>
 *   ...
 *   const html = TotisInformes.generarHTML({
 *     appNombre: 'Sistemas HVAC',
 *     appIcono: '🌡️',
 *     colorPrimario: '#003d5c',
 *     colorAcento: '#00d2ff',
 *     nroInforme: 'INF-HVAC-003-2026',
 *     fecha: '10 de julio de 2026',
 *     elaboradoPor: 'Victor Manuel Garces Borje',
 *     cargo: 'Analista de Procesos Industriales',
 *     web: 'www.totis.cl',
 *     mensaje: 'Mensaje de presentación opcional...',
 *     stats: [
 *       { valor: 12, label: 'TOTAL', color: '#006080' },
 *       { valor: 10, label: 'OPERATIVOS', color: '#16a34a' },
 *       { valor: 2, label: 'FALLAS', color: '#dc2626' },
 *     ],
 *     secciones: [
 *       {
 *         titulo: 'INVENTARIO DE EQUIPOS',
 *         columnas: ['ID', 'Nombre', 'Estado'],
 *         filas: [['HVAC-001', 'Split Sala 1', 'Operativo'], ...],
 *       },
 *     ],
 *   });
 *   // luego: fetch(API + '/api/send-email', { method:'POST', body: JSON.stringify({to, subject, html}) })
 *
 * IMPORTANTE: este archivo solo GENERA el HTML. El envío (fetch a
 * /api/send-email) sigue siendo responsabilidad de cada app, con su
 * propia key Resend dedicada — este módulo no envía nada ni conoce
 * ninguna credencial.
 */

const TotisInformes = (function () {

  function escH(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderStats(stats) {
    if (!stats || !stats.length) return '';
    const cols = stats.map(s => `
      <div style="flex:1;text-align:center;background:#f8fafc;border-radius:8px;padding:12px;">
        <div style="font-size:26px;font-weight:800;color:${escH(s.color || '#003d5c')};">${escH(s.valor)}</div>
        <div style="font-size:10px;color:#6b7280;letter-spacing:0.5px;">${escH(s.label)}</div>
      </div>`).join('');
    return `<div style="display:flex;gap:10px;padding:16px 24px;">${cols}</div>`;
  }

  function renderSeccion(seccion, colorPrimario) {
    const headerCols = seccion.columnas.map(c =>
      `<th style="padding:6px 10px;text-align:left;border:1px solid #ccc;">${escH(c)}</th>`
    ).join('');
    const filas = (seccion.filas || []).map((fila, i) => `<tr style="background:${i % 2 === 0 ? '#f8fafc' : '#fff'};">
        ${fila.map(v => `<td style="padding:6px 10px;border:1px solid #ddd;font-size:12px;">${escH(v)}</td>`).join('')}
      </tr>`).join('') ||
      `<tr><td colspan="${seccion.columnas.length}" style="text-align:center;color:#9ca3af;padding:16px;">Sin registros</td></tr>`;

    return `
      <div style="background:${escH(colorPrimario)};color:#fff;padding:8px 16px;font-weight:800;font-size:13px;margin-top:16px;">
        ${escH(seccion.titulo)}
      </div>
      <div style="padding:14px;border:1px solid #ccc;border-top:none;margin-bottom:8px;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead><tr style="background:#e0f2fe;">${headerCols}</tr></thead>
          <tbody>${filas}</tbody>
        </table>
      </div>`;
  }

  function generarHTML(config) {
    const {
      appNombre = 'Stack Toti\'s',
      appIcono = '📋',
      colorPrimario = '#003d5c',
      colorAcento = '#00d2ff',
      nroInforme = '',
      fecha = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }),
      elaboradoPor = 'Victor Manuel Garces Borje',
      cargo = 'System Developer Full Stack',
      web = 'www.totis.cl',
      mensaje = '',
      stats = [],
      secciones = [],
    } = config;

    const seccionesHTML = secciones.map(s => renderSeccion(s, colorPrimario)).join('');

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;max-width:750px;margin:0 auto;background:white;">
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="background:${escH(colorPrimario)};padding:20px 24px;border-radius:4px 4px 0 0;">
      <div style="color:${escH(colorAcento)};font-size:20px;font-weight:800;">${escH(appIcono)} ${escH(appNombre.toUpperCase())}</div>
      <div style="color:#e2e8f0;font-size:12px;margin-top:4px;">Informe Técnico — Stack Toti's</div>
    </td></tr>
    <tr><td style="background:#f8fafc;padding:12px 24px;border:1px solid #e2e8f0;border-top:none;">
      <table style="width:100%;font-size:12px;"><tr>
        <td><strong>N° Informe:</strong> <span style="font-family:monospace;font-weight:700;color:${escH(colorPrimario)};">${escH(nroInforme)}</span></td>
        <td><strong>Fecha:</strong> ${escH(fecha)}</td>
      </tr><tr>
        <td><strong>Elaborado por:</strong> ${escH(elaboradoPor)}</td>
        <td><strong>Cargo:</strong> ${escH(cargo)}</td>
      </tr></table>
    </td></tr>
  </table>
  ${mensaje ? `<div style="padding:16px 24px;background:#f8fffe;border:1px solid #e2e8f0;border-top:none;font-size:13px;color:#374151;line-height:1.6;">${escH(mensaje)}</div>` : ''}
  ${renderStats(stats)}
  <div style="padding:0 24px 16px;">${seccionesHTML}</div>
  <table style="width:100%;border-top:2px solid ${escH(colorPrimario)};font-size:11px;color:#555;padding:0 24px;">
    <tr><td style="padding-top:12px;">
      <div style="font-size:13px;font-weight:700;color:#1a1a1a;">${escH(elaboradoPor)}</div>
      <div>${escH(cargo)}</div>
      <div><a href="https://${escH(web)}" style="color:${escH(colorPrimario)};">${escH(web)}</a></div>
    </td>
    <td style="text-align:right;padding-top:12px;color:#999;font-size:10px;">
      <div>Generado el ${escH(fecha)}</div>
      <div>N° ${escH(nroInforme)}</div>
    </td></tr>
  </table>
</body></html>`;
  }

  return { generarHTML };
})();
