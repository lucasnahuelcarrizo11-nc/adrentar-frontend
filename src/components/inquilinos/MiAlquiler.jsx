import React, { useEffect, useState, useCallback } from 'react';
import AlquilerService from '../../service/AlquilerService';
import PagoService from '../../service/PagoService';
import ReporteService from '../../service/ReporteService';
import ResumenInquilinoService from '../../service/ResumenInquilinoService';

const obtenerIdInquilino = (usuario) =>
  usuario?.idUsuario ?? usuario?.idInquilino ?? usuario?.id ?? null;

const formatoMoneda = (valor) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(valor ?? 0);

const formatearFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString('es-AR') : '-';

const REPORTE_BADGE = {
  PENDIENTE: { bg: '#fef2f2', color: '#b91c1c', label: 'Pendiente' },
  EN_REVISION: { bg: '#fffbeb', color: '#b45309', label: 'En revisión' },
  RESUELTO: { bg: '#f0fdf4', color: '#15803d', label: 'Resuelto' },
};

const tarjetaEstilo = {
  background: 'white', borderRadius: '2rem', border: '1px solid #e8e2dc',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '2rem',
};

const etiquetaEstilo = {
  fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
  letterSpacing: '0.1em', color: '#b07a5e', marginBottom: '0.75rem', display: 'block',
};

const MiAlquiler = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const idInquilino = obtenerIdInquilino(usuario);

  const [alquileres, setAlquileres] = useState([]);
  const [idAlquilerSeleccionado, setIdAlquilerSeleccionado] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    AlquilerService.obtenerMisAlquileres()
      .then((res) => {
        const aceptados = res.data.filter((a) => a.estado === 'ACEPTADO');
        setAlquileres(aceptados);
        if (aceptados.length > 0) setIdAlquilerSeleccionado(aceptados[0].idAlquiler);
        else setCargando(false);
      })
      .catch(() => {
        setError('No se pudieron cargar tus alquileres.');
        setCargando(false);
      });
  }, []);

  const cargarDetalle = useCallback(() => {
    if (!idAlquilerSeleccionado || !idInquilino) return;
    setCargando(true);
    setError('');

    Promise.all([
      ResumenInquilinoService.obtenerResumen(idAlquilerSeleccionado, idInquilino),
      PagoService.obtenerPagosPorAlquiler(idAlquilerSeleccionado),
      ReporteService.obtenerPorAlquiler(idAlquilerSeleccionado),
    ])
      .then(([resResumen, resPagos, resReportes]) => {
        setResumen(resResumen.data);
        setPagos(resPagos.data);
        setReportes(resReportes.data);
      })
      .catch(() => setError('No se pudo cargar el detalle del alquiler.'))
      .finally(() => setCargando(false));
  }, [idAlquilerSeleccionado, idInquilino]);

  useEffect(() => {
    cargarDetalle();
  }, [cargarDetalle]);

  const alquilerActual = alquileres.find((a) => a.idAlquiler === idAlquilerSeleccionado);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#f6f2ee', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#3b3735', margin: 0 }}>
              Mi <span style={{ fontWeight: '600', color: '#b07a5e' }}>Alquiler</span>
            </h1>
            <p style={{ fontSize: '14px', color: '#6c625c', marginTop: '4px' }}>
              Resumen de tu contrato, pagos y reclamos.
            </p>
          </div>

          {alquileres.length > 1 && (
            <select
              value={idAlquilerSeleccionado ?? ''}
              onChange={(e) => setIdAlquilerSeleccionado(Number(e.target.value))}
              style={{
                padding: '10px 16px', borderRadius: '1rem', border: '1px solid #e8e2dc',
                background: 'white', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif',
              }}
            >
              {alquileres.map((a) => (
                <option key={a.idAlquiler} value={a.idAlquiler}>{a.direccionPropiedad}</option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', color: '#dc2626', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {alquileres.length === 0 && !cargando ? (
          <div style={{ ...tarjetaEstilo, textAlign: 'center', color: '#6c625c', fontSize: '14px' }}>
            No tenés alquileres activos.
          </div>
        ) : cargando || !resumen ? (
          <p style={{ fontSize: '14px', color: '#6c625c', textAlign: 'center' }}>Cargando resumen...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

            {/* Tarjeta: Contrato */}
            <div style={tarjetaEstilo}>
              <span style={etiquetaEstilo}>Contrato</span>
              <p style={{ fontSize: '13px', color: '#6c625c', margin: '0 0 4px' }}>{alquilerActual?.direccionPropiedad}</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#3b3735', margin: '0 0 4px' }}>
                {formatoMoneda(alquilerActual?.precioActual ?? alquilerActual?.precio)}
              </p>
              {alquilerActual?.porcentajeAumento > 0 && (
                <p style={{ fontSize: '11px', color: '#b07a5e', margin: '0 0 16px' }}>
                  Base {formatoMoneda(alquilerActual?.precio)} · +{alquilerActual?.porcentajeAumento}% / 4 meses
                </p>
              )}

              {resumen.progresoContratoPorcentaje != null && (
                <>
                  <div style={{ height: '8px', borderRadius: '999px', background: '#f6f2ee', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{
                      width: `${resumen.progresoContratoPorcentaje}%`, height: '100%',
                      background: '#b07a5e', borderRadius: '999px', transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <p style={{ fontSize: '12px', color: '#6c625c', margin: 0 }}>
                    {resumen.progresoContratoPorcentaje}% del contrato · {resumen.diasRestantesContrato} días restantes
                  </p>
                </>
              )}

              {resumen.proximoAumentoFecha && (
                <p style={{ fontSize: '12px', color: '#b45309', marginTop: '12px' }}>
                  Próximo aumento: {formatearFecha(resumen.proximoAumentoFecha)} ({resumen.diasParaProximoAumento} días)
                </p>
              )}
            </div>

            {/* Tarjeta: Pagos */}
            <div style={tarjetaEstilo}>
              <span style={etiquetaEstilo}>Pagos</span>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#3b3735', margin: '0 0 4px' }}>
                {formatoMoneda(resumen.totalPagado)}
              </p>
              <p style={{ fontSize: '12px', color: '#6c625c', margin: '0 0 16px' }}>total pagado</p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#15803d' }}>{resumen.pagosAprobados} aprobados</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#b45309' }}>{resumen.pagosPendientes} pendientes</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626' }}>{resumen.pagosRechazados} rechazados</span>
              </div>
            </div>

            {/* Tarjeta: Reclamos */}
            <div style={tarjetaEstilo}>
              <span style={etiquetaEstilo}>Reclamos</span>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#dc2626', margin: 0 }}>{resumen.reclamosPendientes}</p>
                  <p style={{ fontSize: '11px', color: '#6c625c', margin: 0 }}>Pendientes</p>
                </div>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#b45309', margin: 0 }}>{resumen.reclamosEnRevision}</p>
                  <p style={{ fontSize: '11px', color: '#6c625c', margin: 0 }}>En revisión</p>
                </div>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#15803d', margin: 0 }}>{resumen.reclamosResueltos}</p>
                  <p style={{ fontSize: '11px', color: '#6c625c', margin: 0 }}>Resueltos</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                {reportes.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#9c9490' }}>No hay reclamos registrados.</p>
                ) : reportes.map((r) => {
                  const badge = REPORTE_BADGE[r.estado] || { bg: '#f3f4f6', color: '#6b7280', label: r.estado };
                  return (
                    <div key={r.idReporte} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#3b3735' }}>{r.titulo}</span>
                      <span style={{ padding: '2px 10px', borderRadius: '999px', background: badge.bg, color: badge.color, fontSize: '10px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MiAlquiler;