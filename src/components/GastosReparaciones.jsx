import React, { useEffect, useState, useCallback } from 'react';
import ReparacionService from '../service/ReparacionService';
import { getUsuarioActual } from '../service/AuthService';

const obtenerIdPropietario = (usuario) => {
  return usuario?.idUsuario ?? usuario?.idPropietario ?? usuario?.id ?? null;
};

const formatoMoneda = (valor) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(valor ?? 0);

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const anioActual = new Date().getFullYear();
const ANIOS = [anioActual - 1, anioActual, anioActual + 1];

const selectStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '1rem',
  border: '1px solid #4a453f',
  background: '#2d2927',
  color: 'white',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
};

const labelStyle = {
  fontSize: '10px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#9c9490',
  marginBottom: '0.5rem',
  display: 'block',
};

const GastosReparaciones = () => {
  const usuario = getUsuarioActual();
  const idPropietario = obtenerIdPropietario(usuario);

  const [anio, setAnio] = useState(anioActual);
  const [mes, setMes] = useState('');
  const [resumen, setResumen] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarResumen = useCallback(() => {
    if (!idPropietario) {
      setCargando(false);
      return;
    }
    setCargando(true);
    ReparacionService.resumenGastos({
      idPropietario,
      anio: anio || null,
      mes: mes ? Number(mes) + 1 : null,
    })
      .then((res) => setResumen(res.data))
      .catch((err) => {
        console.error(err);
        setError('No se pudo cargar el resumen de gastos.');
      })
      .finally(() => setCargando(false));
  }, [idPropietario, anio, mes]);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  const totalGeneral = resumen.reduce((acc, r) => acc + (r.gastoTotal ?? 0), 0);
  const totalReparaciones = resumen.reduce((acc, r) => acc + (r.cantidadReparaciones ?? 0), 0);

  return (
    <div style={{
      flex: 1, overflowY: 'auto', padding: '2rem 1.5rem',
      background: '#f6f2ee', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#3b3735', margin: 0 }}>
            Gastos en <span style={{ fontWeight: '600', color: '#b07a5e' }}>Reparaciones</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#6c625c', marginTop: '4px' }}>
            Historial acumulado por propiedad.
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '12px', padding: '12px 16px',
            color: '#dc2626', fontSize: '13px', marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '2rem',
        }}>

          {/* Historial (izquierda) */}
          <div style={{
            background: 'white', borderRadius: '2rem',
            border: '1px solid #e8e2dc', padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <h3 style={{
                fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                letterSpacing: '0.1em', color: '#3b3735', marginBottom: '1.5rem',
              }}>
                Historial por Propiedad
              </h3>

              {cargando ? (
                <p style={{ fontSize: '14px', color: '#6c625c', textAlign: 'center', padding: '2rem 0' }}>
                  Cargando resumen...
                </p>
              ) : resumen.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#6c625c', textAlign: 'center', padding: '2rem 0' }}>
                  No hay propiedades para mostrar.
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e8e2dc' }}>
                        <th style={{ paddingBottom: '12px', fontSize: '10px', fontWeight: '700', color: '#6c625c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Propiedad
                        </th>
                        <th style={{ paddingBottom: '12px', fontSize: '10px', fontWeight: '700', color: '#6c625c', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
                          Cant. Reparaciones
                        </th>
                        <th style={{ paddingBottom: '12px', fontSize: '10px', fontWeight: '700', color: '#6c625c', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>
                          Gasto Total
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '14px' }}>
                      {resumen.map((r) => {
                        const sinReparaciones = r.cantidadReparaciones === 0;
                        return (
                          <tr key={r.idPropiedad} style={{ borderBottom: '1px solid #f6f2ee' }}>
                            <td style={{ padding: '16px 0', fontWeight: '600', color: '#3b3735' }}>
                              {r.tituloPropiedad}
                            </td>
                            <td style={{ padding: '16px 0', textAlign: 'center' }}>
                              <span style={{
                                padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '700',
                                background: sinReparaciones ? '#f0fdf4' : '#fffbeb',
                                color: sinReparaciones ? '#15803d' : '#b45309',
                              }}>
                                {r.cantidadReparaciones}
                              </span>
                            </td>
                            <td style={{
                              padding: '16px 0', textAlign: 'right', fontWeight: '700',
                              color: sinReparaciones ? '#9c9490' : '#b07a5e',
                            }}>
                              {formatoMoneda(r.gastoTotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={{
              marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f6f2ee',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: '12px', fontWeight: '700', color: '#6c625c',
            }}>
              <span>Total de propiedades: {resumen.length}</span>
              <span>Total acumulado: {formatoMoneda(totalGeneral)}</span>
            </div>
          </div>

          {/* Panel de consulta (derecha) */}
          <div style={{
            background: '#3b3735', color: 'white', borderRadius: '2rem',
            padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <h3 style={{
                fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                letterSpacing: '0.1em', color: '#d8cfc8', marginBottom: '1.5rem',
              }}>
                Consulta de Gastos
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Año</label>
                <select value={anio} onChange={(e) => setAnio(Number(e.target.value))} style={selectStyle}>
                  {ANIOS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Mes</label>
                <select value={mes} onChange={(e) => setMes(e.target.value)} style={selectStyle}>
                  <option value="">Todos los meses</option>
                  {MESES.map((nombre, i) => (
                    <option key={i} value={i}>{nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{
              marginTop: '2rem', padding: '1.5rem', borderRadius: '1.25rem',
              background: '#2d2927', border: '1px solid #4a453f',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#b07a5e', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
                Gastos en Reparaciones
              </p>
              <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'white', margin: '0.5rem 0' }}>
                {formatoMoneda(totalGeneral)}
              </h2>
              <p style={{ fontSize: '12px', color: '#9c9490', margin: 0 }}>
                {totalReparaciones} reparaciones según filtros
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GastosReparaciones;