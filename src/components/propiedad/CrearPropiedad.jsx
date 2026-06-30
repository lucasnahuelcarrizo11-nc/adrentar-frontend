import React, { useEffect, useState } from 'react';
import PropiedadService from '../../service/PropiedadService';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ setCoords, setDireccion }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });
      try {
        const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
          params: { lat, lon: lng, format: 'json' },
        });
        if (res.data?.display_name) setDireccion(res.data.display_name);
      } catch (error) {
        console.error('Error obteniendo dirección:', error);
      }
    },
  });
  return null;
};

// ── Estilos compartidos ──────────────────────────────────────────────────────
const inputBase = {
  width: '100%',
  backgroundColor: '#fcfaf9',
  border: '1px solid #eee4e4',
  borderRadius: '1rem',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  color: '#3b3735',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '10px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#b07a5e',
  marginBottom: '0.5rem',
  marginLeft: '0.25rem',
};

const handleFocus = (e) => {
  e.target.style.borderColor = '#b07a5e';
  e.target.style.backgroundColor = '#fff';
  e.target.style.boxShadow = '0 0 0 4px rgba(176,122,94,0.05)';
};
const handleBlur = (e) => {
  e.target.style.borderColor = '#eee4e4';
  e.target.style.backgroundColor = '#fcfaf9';
  e.target.style.boxShadow = 'none';
};
const handleFocusError = (e) => {
  e.target.style.borderColor = '#ef4444';
  e.target.style.boxShadow = '0 0 0 4px rgba(239,68,68,0.05)';
};
// ────────────────────────────────────────────────────────────────────────────

const CrearPropiedad = () => {
  const [titulo, setTitulo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState('');
  const [ambientes, setAmbientes] = useState('');
  const [tipoProp, setTipoProp] = useState('Casa');
  const [coords, setCoords] = useState({ lat: -34.6037, lng: -58.3816 });
  const [errores, setErrores] = useState({});
  const [errorBackend, setErrorBackend] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  const validarFormulario = () => {
    const e = {};
    if (!direccion.trim()) e.direccion = 'La dirección es obligatoria';
    if (!estado.trim())    e.estado    = 'El estado es obligatorio';
    if (!ambientes.trim()) e.ambientes = 'La cantidad de ambientes es obligatoria';
    else if (!/^[1-9]\d*$/.test(ambientes)) e.ambientes = 'Debe ser un número mayor a 0';
    return e;
  };

  const buscarCoordenadas = async (dir) => {
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: dir, format: 'json', limit: 1 },
      });
      if (res.data?.length > 0) {
        setCoords({ lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) });
      }
    } catch (error) {
      console.error('Error buscando coordenadas:', error);
    }
  };

  useEffect(() => {
    if (direccion.trim().length > 3) {
      const timeout = setTimeout(() => buscarCoordenadas(direccion), 800);
      return () => clearTimeout(timeout);
    }
  }, [direccion]);

  const saveOrUpdatePropiedad = async (e) => {
    e.preventDefault();
    setErrores({});
    setErrorBackend('');

    const erroresFront = validarFormulario();
    if (Object.keys(erroresFront).length > 0) { setErrores(erroresFront); return; }

    const propiedad = {
      tituloPropiedad: titulo.trim(),
      direccion: direccion.trim(),
      ambientes: Number(ambientes),
      estado: estado.trim(),
      tipo: tipoProp,
      latitud: coords.lat,
      longitud: coords.lng,
    };

    try {
      if (id) await PropiedadService.actualizarPropiedad(id, propiedad);
      else    await PropiedadService.crearPropiedad(propiedad);
      navigate('/listPropiedades');
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        setErrorBackend(typeof data === 'string' ? data : data.message || 'Esta dirección ya existe');
      } else {
        setErrorBackend('No se pudo conectar con el servidor');
      }
    }
  };

  useEffect(() => {
    if (id) {
      PropiedadService.getPropiedadById(id)
        .then((res) => {
          setTitulo(res.data.tituloPropiedad ?? '');
          setDireccion(res.data.direccion ?? '');
          setAmbientes(String(res.data.ambientes ?? ''));
          setEstado(res.data.estado ?? '');
          setTipoProp(res.data.tipo ?? 'Casa');
          if (res.data.latitud && res.data.longitud)
            setCoords({ lat: res.data.latitud, lng: res.data.longitud });
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  return (
    <div
      style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', background: '#f6f2ee', fontFamily: 'Inter, sans-serif' }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Botón volver */}
        <Link
          to="/listPropiedades"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.12em', color: '#6c625c', textDecoration: 'none',
            marginBottom: '1.5rem', transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#b07a5e')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6c625c')}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a propiedades
        </Link>

        {/* Card principal */}
        <div style={{
          background: 'white', borderRadius: '2.5rem',
          border: '1px solid #e8e2dc', padding: '3rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#3b3735', margin: 0 }}>
              {id ? 'Editar' : 'Nueva'}{' '}
              <span style={{ fontWeight: '600', color: '#b07a5e' }}>Propiedad</span>
            </h1>
            <p style={{ fontSize: '14px', color: '#6c625c', marginTop: '4px' }}>
              Completá los detalles para {id ? 'actualizar' : 'dar de alta'} el inmueble.
            </p>
          </div>

          {errorBackend && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '12px', padding: '12px 16px',
              color: '#dc2626', fontSize: '13px', marginBottom: '24px',
            }}>
              {errorBackend}
            </div>
          )}

          <form onSubmit={saveOrUpdatePropiedad} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Título */}
            <div>
              <label style={labelStyle}>Nombre o Título de la propiedad</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Departamento Las Heras"
                style={inputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Dirección */}
            <div>
              <label style={labelStyle}>Dirección completa</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Av. Libertador 1200, CABA"
                style={{
                  ...inputBase,
                  borderColor: errores.direccion ? '#ef4444' : '#eee4e4',
                }}
                onFocus={errores.direccion ? handleFocusError : handleFocus}
                onBlur={handleBlur}
              />
              {errores.direccion && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                  {errores.direccion}
                </p>
              )}
            </div>

            {/* Mapa */}
            <div>
              <label style={labelStyle}>Ubicación Geográfica</label>
              <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid #eee4e4', height: '256px' }}>
                <MapContainer
                  center={[coords.lat, coords.lng]}
                  zoom={14}
                  key={`${coords.lat}-${coords.lng}`}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[coords.lat, coords.lng]} icon={markerIcon}>
                    <Popup>{direccion || 'Ubicación'}</Popup>
                  </Marker>
                  <LocationMarker setCoords={setCoords} setDireccion={setDireccion} />
                </MapContainer>
              </div>
            </div>

            {/* Ambientes + Tipo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

              {/* Ambientes */}
              <div>
                <label style={labelStyle}>Cantidad de ambientes</label>
                <input
                  type="number"
                  value={ambientes}
                  onChange={(e) => setAmbientes(e.target.value)}
                  placeholder="Ej: 3"
                  style={{
                    ...inputBase,
                    borderColor: errores.ambientes ? '#ef4444' : '#eee4e4',
                  }}
                  onFocus={errores.ambientes ? handleFocusError : handleFocus}
                  onBlur={handleBlur}
                />
                {errores.ambientes && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                    {errores.ambientes}
                  </p>
                )}
              </div>

              {/* Tipo de propiedad */}
              <div>
                <label style={labelStyle}>Tipo de propiedad</label>
                <div style={{
                  display: 'flex', gap: '4px', padding: '4px',
                  background: '#fcfaf9', border: '1px solid #eee4e4', borderRadius: '1rem',
                }}>
                  {['Casa', 'Depto'].map((tipo) => {
                    const active = tipoProp === tipo;
                    return (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => setTipoProp(tipo)}
                        style={{
                          flex: 1, padding: '8px 16px', borderRadius: '12px', border: 'none',
                          background: active ? '#3b3735' : 'transparent',
                          color: active ? 'white' : '#6c625c',
                          fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                          letterSpacing: '0.08em', cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                        }}
                      >
                        {tipo}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Estado */}
            <div>
              <label style={labelStyle}>Estado inicial</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                style={{
                  ...inputBase,
                  borderColor: errores.estado ? '#ef4444' : '#eee4e4',
                  cursor: 'pointer',
                  appearance: 'none',
                }}
                onFocus={errores.estado ? handleFocusError : handleFocus}
                onBlur={handleBlur}
              >
                <option value="">Seleccione un estado</option>
                <option value="Disponible">Disponible</option>
                <option value="No disponible">No disponible</option>
              </select>
              {errores.estado && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                  {errores.estado}
                </p>
              )}
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                style={{
                  flex: 1, minWidth: '140px', background: '#b07a5e', color: 'white',
                  padding: '1rem', borderRadius: '1rem', border: 'none',
                  fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                  letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#9c6a50';
                  e.target.style.boxShadow = '0 8px 20px rgba(176,122,94,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#b07a5e';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Guardar Propiedad
              </button>
              <Link
                to="/listPropiedades"
                style={{
                  flex: 1, minWidth: '140px', background: 'white',
                  border: '1px solid #e8e2dc', color: '#3b3735',
                  padding: '1rem', borderRadius: '1rem',
                  fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                  letterSpacing: '0.12em', textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f2ee')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
              >
                Cancelar
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearPropiedad;