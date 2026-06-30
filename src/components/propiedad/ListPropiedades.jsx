import React, { useEffect, useState } from 'react';
import PropiedadService from '../../service/PropiedadService';
import DetallePropiedadModal from './DetallePropiedadModal';
import { Link } from "react-router-dom";

const ListPropiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);

  const listarPropiedades = () => {
    PropiedadService.listarMisPropiedades()
      .then(response => {
        setPropiedades(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log("Error al obtener propiedades:", error);
        setLoading(false);
      });
  };

  useEffect(() => { listarPropiedades(); }, []);

  const deletePropiedad = (idPropiedad) => {
    if (window.confirm("¿Estás seguro de eliminar esta propiedad?")) {
      PropiedadService.eliminarPropiedad(idPropiedad)
        .then(() => listarPropiedades())
        .catch(error => console.log(error));
    }
  };

  const getEstadoBadge = (estado) => {
    const s = (estado || '').toLowerCase();
    if (s === 'disponible') return {
      bg: '#fffbeb', color: '#b45309', border: '#fde68a', label: 'Disponible',
    };
    if (s === 'no disponible') return {
      bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', label: 'No disponible',
    };
    return {
      bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: estado,
    };
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f2ee', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', border: '3px solid #e8e2dc',
            borderTopColor: '#b07a5e', borderRadius: '50%', margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#6c625c', fontSize: '14px' }}>Cargando propiedades...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, overflowY: 'auto', padding: '2rem',
      background: '#f6f2ee', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>

        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#3b3735', margin: 0 }}>
              Mis <span style={{ fontWeight: '600', color: '#b07a5e' }}>Propiedades</span>
            </h1>
            <p style={{ fontSize: '14px', color: '#6c625c', marginTop: '4px' }}>
              Gestión centralizada de tus activos inmobiliarios.
            </p>
          </div>
          <Link
            to="/CrearPropiedad"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#3b3735', color: 'white',
              padding: '12px 24px', borderRadius: '16px',
              fontSize: '14px', fontWeight: '500', textDecoration: 'none',
              boxShadow: '0 10px 30px -8px rgba(59,55,53,0.25)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#2a2725')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#3b3735')}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Propiedad
          </Link>
        </div>

        {/* Tabla */}
        <div style={{
          background: 'white', borderRadius: '2.5rem',
          border: '1px solid #e8e2dc', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#fcfaf9', borderBottom: '1px solid #e8e2dc' }}>
                  {['Propiedad', 'Ambientes', 'Estado', 'Acciones'].map((h, i) => (
                    <th key={h} style={{
                      padding: '20px 32px',
                      fontSize: '10px', fontWeight: '700',
                      textTransform: 'uppercase', letterSpacing: '0.12em',
                      color: '#b07a5e',
                      textAlign: i === 3 ? 'right' : 'left',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {propiedades.length > 0 ? (
                  propiedades.map((propiedad) => {
                    const badge = getEstadoBadge(propiedad.estado);
                    return (
                      <tr
                        key={propiedad.idPropiedad}
                        style={{ borderBottom: '1px solid #e8e2dc', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fcfaf9')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                      >
                        {/* Propiedad */}
                        <td style={{ padding: '24px 32px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                              width: '48px', height: '48px', borderRadius: '16px',
                              background: '#f6f2ee', border: '1px solid #e8e2dc',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '20px', flexShrink: 0,
                            }}>
                              🏠
                            </div>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: '700', color: '#3b3735', margin: 0 }}>
                                {propiedad.titulo|| propiedad.direccion}
                              </p>
                              <p style={{ fontSize: '12px', color: '#6c625c', margin: '2px 0 0' }}>
                                {propiedad.direccion}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Ambientes */}
                        <td style={{ padding: '24px 32px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#3b3735' }}>
                            {propiedad.ambientes} {propiedad.ambientes === 1 ? 'Ambiente' : 'Ambientes'}
                          </span>
                        </td>

                        {/* Estado */}
                        <td style={{ padding: '24px 32px' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: '999px',
                            background: badge.bg, color: badge.color,
                            border: `1px solid ${badge.border}`,
                            fontSize: '10px', fontWeight: '700',
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                          }}>
                            {badge.label}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td style={{ padding: '24px 32px' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>

                            {/* Ver detalle */}
                            <button
                              onClick={() => setPropiedadSeleccionada(propiedad)}
                              title="Ver detalle"
                              style={{
                                padding: '10px', borderRadius: '12px', border: 'none',
                                background: 'transparent', color: '#6c625c', cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#f6f2ee'; e.currentTarget.style.color = '#b07a5e'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6c625c'; }}
                            >
                              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* Editar */}
                            <Link
                              to={`/editPropiedad/${propiedad.idPropiedad}`}
                              title="Editar"
                              style={{
                                padding: '10px', borderRadius: '12px',
                                background: 'transparent', color: '#6c625c',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                textDecoration: 'none', transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#f6f2ee'; e.currentTarget.style.color = '#b07a5e'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6c625c'; }}
                            >
                              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </Link>

                            {/* Eliminar */}
                            <button
                              onClick={() => deletePropiedad(propiedad.idPropiedad)}
                              title="Eliminar"
                              style={{
                                padding: '10px', borderRadius: '12px', border: 'none',
                                background: 'transparent', color: '#f87171', cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '48px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '64px', height: '64px', borderRadius: '20px',
                          background: '#f6f2ee', border: '1px solid #e8e2dc',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                        }}>
                          🏠
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#3b3735', margin: 0 }}>
                          No tenés propiedades registradas
                        </p>
                        <p style={{ fontSize: '13px', color: '#6c625c', margin: 0 }}>
                          Hacé clic en "Nueva Propiedad" para empezar.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer tabla */}
          {propiedades.length > 0 && (
            <div style={{
              padding: '16px 32px', borderTop: '1px solid #e8e2dc',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <p style={{ fontSize: '11px', fontWeight: '500', color: '#6c625c', margin: 0 }}>
                Mostrando <span style={{ color: '#3b3735', fontWeight: '700' }}>{propiedades.length}</span> inmueble{propiedades.length !== 1 ? 's' : ''} registrado{propiedades.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {propiedadSeleccionada && (
        <DetallePropiedadModal
          propiedad={propiedadSeleccionada}
          onClose={() => setPropiedadSeleccionada(null)}
        />
      )}
    </div>
  );
};

export default ListPropiedades;