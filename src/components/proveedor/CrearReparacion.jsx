import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReparacionService from '../../service/ReparacionService';
import PropiedadService from '../../service/PropiedadService';
import { getUsuarioActual } from '../../service/AuthService';

const obtenerIdProveedor = (usuario) => {
  return usuario?.idUsuario ?? usuario?.idProveedor ?? usuario?.id ?? null;
};

// ── Estilos compartidos (mismos que CrearPropiedad / Perfil) ────────────────
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

const CrearReparacion = () => {
  const navigate = useNavigate();
  const usuario = getUsuarioActual();
  const idProveedor = obtenerIdProveedor(usuario);

  const [propiedades, setPropiedades] = useState([]);
  const [idPropiedad, setIdPropiedad] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [errores, setErrores] = useState({});
  const [errorBackend, setErrorBackend] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    // Ajustar al método real del service de propiedades
    PropiedadService.listarTodas()
      .then((res) => setPropiedades(res.data))
      .catch((err) => console.error('No se pudieron cargar las propiedades', err));
  }, []);

  const manejarSeleccionImagenes = (e) => {
    const archivos = Array.from(e.target.files ?? []);
    setImagenes(archivos);
  };

  const validarFormulario = () => {
    const e = {};
    if (!descripcion.trim()) e.descripcion = 'La descripción es obligatoria';
    if (!idPropiedad) e.idPropiedad = 'Seleccioná una propiedad';
    if (monto && isNaN(Number(monto))) e.monto = 'El monto debe ser un número';
    return e;
  };

  const guardarReparacion = async (e) => {
    e.preventDefault();
    setErrores({});
    setErrorBackend('');

    const erroresFront = validarFormulario();
    if (Object.keys(erroresFront).length > 0) {
      setErrores(erroresFront);
      return;
    }

    if (!idProveedor) {
      setErrorBackend('No se pudo determinar el proveedor logueado');
      return;
    }

    try {
      setGuardando(true);
      await ReparacionService.crearReparacion({
        idProveedor,
        idPropiedad,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        monto: monto ? Number(monto) : null,
        imagenes,
      });
      navigate('/reparaciones');
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        setErrorBackend(typeof data === 'string' ? data : data.message || 'No se pudo registrar la reparación');
      } else {
        setErrorBackend('No se pudo conectar con el servidor');
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', background: '#f6f2ee', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <Link
          to="/reparaciones"
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
          Volver a reparaciones
        </Link>

        <div style={{
          background: 'white', borderRadius: '2.5rem',
          border: '1px solid #e8e2dc', padding: '3rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#3b3735', margin: 0 }}>
              Nueva <span style={{ fontWeight: '600', color: '#b07a5e' }}>Reparación</span>
            </h1>
            <p style={{ fontSize: '14px', color: '#6c625c', marginTop: '4px' }}>
              Registrá el trabajo realizado y subí las fotos correspondientes.
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

          <form onSubmit={guardarReparacion} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Propiedad */}
            <div>
              <label style={labelStyle}>Propiedad</label>
              <select
                value={idPropiedad}
                onChange={(e) => setIdPropiedad(e.target.value)}
                style={{
                  ...inputBase,
                  borderColor: errores.idPropiedad ? '#ef4444' : '#eee4e4',
                }}
                onFocus={errores.idPropiedad ? handleFocusError : handleFocus}
                onBlur={handleBlur}
              >
                <option value="">Seleccioná una propiedad</option>
                {propiedades.map((p) => (
                  <option key={p.idPropiedad} value={p.idPropiedad}>
                    {p.TituloPropiedad ?? p.tituloPropiedad}
                  </option>
                ))}
              </select>
              {errores.idPropiedad && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                  {errores.idPropiedad}
                </p>
              )}
            </div>

            {/* Título (opcional) */}
            <div>
              <label style={labelStyle}>Título (opcional)</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Reparación de cañería en baño principal"
                style={inputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Descripción */}
            <div>
              <label style={labelStyle}>Descripción del trabajo realizado</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                placeholder="Contá qué se hizo, materiales usados, tiempo estimado, etc."
                style={{
                  ...inputBase,
                  resize: 'vertical',
                  borderColor: errores.descripcion ? '#ef4444' : '#eee4e4',
                }}
                onFocus={errores.descripcion ? handleFocusError : handleFocus}
                onBlur={handleBlur}
              />
              {errores.descripcion && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                  {errores.descripcion}
                </p>
              )}
            </div>

            {/* Monto */}
            <div>
              <label style={labelStyle}>Monto (opcional)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="Ej: 45000"
                style={{
                  ...inputBase,
                  borderColor: errores.monto ? '#ef4444' : '#eee4e4',
                }}
                onFocus={errores.monto ? handleFocusError : handleFocus}
                onBlur={handleBlur}
              />
              {errores.monto && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                  {errores.monto}
                </p>
              )}
            </div>

            {/* Imágenes */}
            <div>
              <label style={labelStyle}>Imágenes de la reparación</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={manejarSeleccionImagenes}
                style={inputBase}
              />
              {imagenes.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {imagenes.map((img, i) => (
                    <div key={i} style={{
                      width: '84px', height: '84px', borderRadius: '12px',
                      overflow: 'hidden', border: '1px solid #eee4e4',
                    }}>
                      <img
                        src={URL.createObjectURL(img)}
                        alt={img.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={guardando}
                style={{
                  flex: 1, minWidth: '140px',
                  background: guardando ? '#d8b8a6' : '#b07a5e',
                  color: 'white',
                  padding: '1rem', borderRadius: '1rem', border: 'none',
                  fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                  letterSpacing: '0.12em', cursor: guardando ? 'default' : 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (guardando) return;
                  e.target.style.background = '#9c6a50';
                  e.target.style.boxShadow = '0 8px 20px rgba(176,122,94,0.25)';
                }}
                onMouseLeave={(e) => {
                  if (guardando) return;
                  e.target.style.background = '#b07a5e';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {guardando ? 'Guardando...' : 'Guardar reparación'}
              </button>
              <Link
                to="/reparaciones"
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

export default CrearReparacion;