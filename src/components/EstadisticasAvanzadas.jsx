import React, { useEffect, useState, useMemo, useCallback } from 'react';
import OperacionesService from '../service/OperacionesService';
import { getUsuarioActual } from '../service/AuthService';

const obtenerIdPropietario = (usuario) => {
  return usuario?.idUsuario ?? usuario?.idPropietario ?? usuario?.id ?? null;
};

const formatoMoneda = (valor) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(valor ?? 0);

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const anioActual = new Date().getFullYear();
const ANIOS = [anioActual - 1, anioActual, anioActual + 1];

const thStyle = {
  padding: '0 0 12px 0',
  fontSize: '10px',
  fontWeight: '700',
  color: '#6c625c',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '14px 12px 14px 0',
  fontSize: '13px',
  color: '#3b3735',
  whiteSpace: 'nowrap',
};

const EstadisticasAvanzadas = () => {
  const usuario = getUsuarioActual();
  const idPropietario = obtenerIdPropietario(usuario);

  const [operaciones, setOperaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargandoTabla, setCargandoTabla] = useState(true);
  const [errorTabla, setErrorTabla] = useState('');

  const [anio, setAnio] = useState(anioActual);
  const [ingresos, setIngresos] = useState([]);
  const [cargandoGrafico, setCargandoGrafico] = useState(true);
  const [errorGrafico, setErrorGrafico] = useState('');

  useEffect(() => {
    if (!idPropietario) {
      setCargandoTabla(false);
      return;
    }
    setCargandoTabla(true);
    OperacionesService.detalle({ idPropietario })
      .then((res) => setOperaciones(res.data))
      .catch((err) => {
        console.error(err);
        setErrorTabla('No se pudo cargar el detalle de operaciones.');
      })
      .finally(() => setCargandoTabla(false));
  }, [idPropietario]);

  const cargarIngresos = useCallback(() => {
    if (!idPropietario) {
      setCargandoGrafico(false);
      return;
    }
    setCargandoGrafico(true);
    OperacionesService.ingresosMensuales({ idPropietario, anio })
      .then((res) => setIngresos(res.data))
      .catch((err) => {
        console.error(err);
        setErrorGrafico('No se pudo cargar el gráfico de ingresos.');
      })
      .finally(() => setCargandoGrafico(false));
  }, [idPropietario, anio]);

  useEffect(() => {
    cargarIngresos();
  }, [cargarIngresos]);

  const operacionesFiltradas = useMemo(() => {
    if (!busqueda.trim()) return operaciones;
    const termino = busqueda.trim().toLowerCase();
    return operaciones.filter((o) =>
      Object.values(o).some((valor) =>
        String(valor ?? '').toLowerCase().includes(termino)
      )
    );
  }, [operaciones, busqueda]);

  const datosGrafico = useMemo(() => {
    const porMes = new Array(12).fill(0);
    ingresos.forEach((i) => {
      if (i.mes >= 1 && i.mes <= 12) porMes[i.mes - 1] = i.total ?? 0;
    });
    return porMes;
  }, [ingresos]);

  const maximo = Math.max(...datosGrafico, 1);

  return (
    <div style={{
      flex: 1, overflowY: 'auto', padding: '2rem 1.5rem',
      background: '#f6f2ee', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#3b3735', margin: 0 }}>
            Estadísticas <span style={{ fontWeight: '600', color: '#b07a5e' }}>Avanzadas</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#6c625c', marginTop: '4px' }}>
            Detalle completo de tus operaciones e ingresos.
          </p>
        </div>

        {/* Tabla */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
            alignItems: 'center', gap: '1rem', marginBottom: '1.5rem',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#3b3735', margin: 0 }}>
              Detalle de Operaciones
            </h2>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Filtrar por cualquier campo..."
              style={{
                width: '320px', maxWidth: '100%',
                padding: '10px 16px', borderRadius: '1rem',
                border: '1px solid #e8e2dc', background: 'white',
                fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{
            background: 'white', borderRadius: '2rem',
            border: '1px solid #e8e2dc', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            padding: '1.5rem 2rem', overflowX: 'auto',
          }}>
            {errorTabla && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '12px', padding: '12px 16px',
                color: '#dc2626', fontSize: '13px', marginBottom: '16px',
              }}>
                {errorTabla}
              </div>
            )}

            {cargandoTabla ? (
              <p style={{ fontSize: '14px', color: '#6c625c', textAlign: 'center', padding: '2rem 0' }}>
                Cargando operaciones...
              </p>
            ) : operacionesFiltradas.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#6c625c', textAlign: 'center', padding: '2rem 0' }}>
                No hay operaciones para mostrar.
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e8e2dc' }}>
                    <th style={thStyle}>Año</th>
                    <th style={thStyle}>Mes</th>
                    <th style={thStyle}>Propiedad</th>
                    <th style={thStyle}>Mail Inquilino</th>
                    <th style={thStyle}>Precio Total</th>
                    <th style={thStyle}>Pagos Realizados</th>
                    <th style={thStyle}>Reclamos</th>
                    <th style={thStyle}>Prox. Renovación</th>
                  </tr>
                </thead>
                <tbody>
                  {operacionesFiltradas.map((o) => (
                    <tr key={o.idAlquiler} style={{ borderBottom: '1px solid #f6f2ee' }}>
                      <td style={tdStyle}>{o.anio}</td>
                      <td style={tdStyle}>{o.mes}</td>
                      <td style={{ ...tdStyle, fontWeight: '600', color: '#b07a5e' }}>{o.propiedad}</td>
                      <td style={tdStyle}>{o.mailInquilino}</td>
                      <td style={tdStyle}>{formatoMoneda(o.precioTotal)}</td>
                      <td style={{ ...tdStyle, fontWeight: '700' }}>{o.pagosRealizados}/{o.pagosTotales}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{o.reclamos}</td>
                      <td style={{ ...tdStyle, color: o.proximaRenovacion === 'Completado' ? '#9c9490' : '#b45309' }}>
                        {o.proximaRenovacion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Gráfico */}
        <div style={{
          background: 'white', borderRadius: '2.5rem',
          border: '1px solid #e8e2dc', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          padding: '2rem',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '2rem',
          }}>
            <h4 style={{
              fontSize: '11px', fontWeight: '700', color: '#3b3735',
              textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0,
            }}>
              Ingresos Mensuales
            </h4>
            <select
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              style={{
                padding: '6px 16px', borderRadius: '999px',
                border: '1px solid #eee4e4', background: '#fcfaf9',
                fontSize: '11px', fontWeight: '700', color: '#b07a5e',
                outline: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              {ANIOS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {errorGrafico && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '12px', padding: '12px 16px',
              color: '#dc2626', fontSize: '13px', marginBottom: '16px',
            }}>
              {errorGrafico}
            </div>
          )}

          {cargandoGrafico ? (
            <p style={{ fontSize: '14px', color: '#6c625c', textAlign: 'center', padding: '3rem 0' }}>
              Cargando ingresos...
            </p>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: '10px',
              height: '280px', padding: '0 8px',
            }}>
              {datosGrafico.map((valor, i) => (
                <div key={i} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'flex-end', height: '100%',
                }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#6c625c', marginBottom: '6px' }}>
                    {valor > 0 ? formatoMoneda(valor) : ''}
                  </span>
                  <div
                    title={formatoMoneda(valor)}
                    style={{
                      width: '100%', maxWidth: '36px',
                      height: `${Math.max((valor / maximo) * 100, valor > 0 ? 4 : 0)}%`,
                      background: valor > 0 ? '#b07a5e' : '#eee4e4',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#9c9490', marginTop: '8px', fontWeight: '600' }}>
                    {MESES_CORTOS[i]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EstadisticasAvanzadas;