import React, { useEffect, useState } from 'react';
import { getUsuarioActual, getTipoUsuarioActual } from '../service/AuthService';
import propietarioService from '../service/PropietarioService';
import inquilinoService from '../service/InquilinoService';
import proveedorService from '../service/ProveedorService';

// idUsuario es el id real: Inquilino y Propietario lo heredan de la clase
// base Usuario, y Proveedor lo expone también como idProveedor (alias).
const obtenerIdUsuario = (usuario) => {
  return usuario?.idUsuario ?? usuario?.idProveedor ?? usuario?.id ?? null;
};

// Mapa de servicios según tipo de usuario
const SERVICIOS_POR_ROL = {
  PROPIETARIO: {
    getById: (id) => propietarioService.getPropietarioById(id),
    actualizar: (id, data) => propietarioService.actualizarPropietario(id, data),
  },
  INQUILINO: {
    getById: (id) => inquilinoService.getInquilinoById(id),
    actualizar: (id, data) => inquilinoService.actualizarInquilino(id, data),
  },
  PROVEEDOR: {
    getById: (id) => proveedorService.getProveedorById(id),
    actualizar: (id, data) => proveedorService.actualizarProveedor(id, data),
  },
};

const ESPECIALIDADES = [
  'ELECTRICISTA',
  'PLOMERIA',
  'CARPINTERIA',
  'PINTOR',
  'ALBAÑILERIA',
  'CRISTALERO',
];

// ── Estilos compartidos (mismos que CrearPropiedad) ──────────────────────────
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
// ──────────────────────────────────────────────────────────────────────────

const Perfil = () => {
  const usuarioLogueado = getUsuarioActual();
  // ⚠️ Usamos la clave separada "tipo_usuario" (siempre en mayúsculas),
  // NO usuarioLogueado?.tipo_usuario, que puede venir con otro casing.
  const tipoUsuario = getTipoUsuarioActual();
  const usuarioId = obtenerIdUsuario(usuarioLogueado);

  // Campos comunes a las tres entidades
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [dni, setDni] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');

  // Campos propios de Proveedor
  const [especialidad, setEspecialidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [zona, setZona] = useState('');
  const [activo, setActivo] = useState(true);

  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorBackend, setErrorBackend] = useState('');

  const servicio = SERVICIOS_POR_ROL[tipoUsuario];

  useEffect(() => {
    if (!tipoUsuario || !usuarioId || !servicio) {
      setCargando(false);
      return;
    }

    servicio
      .getById(usuarioId)
      .then((response) => {
        setNombre(response.data.nombre ?? '');
        setApellido(response.data.apellido ?? '');
        setEmail(response.data.email ?? '');
        setContrasenia(response.data.contrasenia ?? '');
        setDni(response.data.dni ?? '');
        setFechaNacimiento(response.data.fechaNacimiento ?? '');
        setTelefono(response.data.telefono ?? '');

        if (tipoUsuario === 'PROVEEDOR') {
          setEspecialidad(response.data.especialidad ?? '');
          setDescripcion(response.data.descripcion ?? '');
          setZona(response.data.zona ?? '');
          setActivo(response.data.activo ?? true);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setCargando(false));
  }, [tipoUsuario, usuarioId, servicio]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio';

    if (!email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!email.includes('@')) {
      nuevosErrores.email = "El email debe contener '@'";
    }

    if (!contrasenia.trim()) {
      nuevosErrores.contrasenia = 'La contraseña es obligatoria';
    } else if (contrasenia.length < 8) {
      nuevosErrores.contrasenia = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (tipoUsuario === 'PROVEEDOR' && !especialidad) {
      nuevosErrores.especialidad = 'La especialidad es obligatoria';
    }

    return nuevosErrores;
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setErrores({});
    setErrorBackend('');
    setMensajeExito('');

    const erroresFront = validarFormulario();
    if (Object.keys(erroresFront).length > 0) {
      setErrores(erroresFront);
      return;
    }

    if (!servicio || !usuarioId) {
      console.error('No se pudo determinar el rol o el id del usuario logueado');
      return;
    }

    const datosActualizados = {
      nombre,
      apellido,
      email,
      contrasenia,
      dni,
      fechaNacimiento,
      telefono,
      ...(tipoUsuario === 'PROVEEDOR' && {
        especialidad,
        descripcion,
        zona,
        // "activo" no se envía: es un estado de verificación/disponibilidad
        // que no maneja el propio usuario.
      }),
    };

    try {
      setGuardando(true);
      await servicio.actualizar(usuarioId, datosActualizados);

      localStorage.setItem(
        'usuario',
        JSON.stringify({ ...usuarioLogueado, nombre, apellido, email })
      );

      setMensajeExito('Perfil actualizado correctamente');
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        setErrorBackend(typeof data === 'string' ? data : data.message || 'No se pudo actualizar el perfil');
      } else {
        setErrorBackend('No se pudo conectar con el servidor');
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f2ee', fontFamily: 'Inter, sans-serif', color: '#6c625c' }}>
        Cargando perfil...
      </div>
    );
  }

  if (!tipoUsuario || !usuarioId || !servicio) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f2ee', fontFamily: 'Inter, sans-serif', color: '#ef4444' }}>
        No se pudo determinar el usuario logueado.
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', background: '#f6f2ee', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Card principal */}
        <div style={{
          background: 'white', borderRadius: '2.5rem',
          border: '1px solid #e8e2dc', padding: '3rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#3b3735', margin: 0 }}>
              Mi <span style={{ fontWeight: '600', color: '#b07a5e' }}>Perfil</span>
            </h1>
            <p style={{ fontSize: '14px', color: '#6c625c', marginTop: '4px' }}>
              Actualizá tus datos personales.
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

          {mensajeExito && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '12px', padding: '12px 16px',
              color: '#16a34a', fontSize: '13px', marginBottom: '24px',
            }}>
              {mensajeExito}
            </div>
          )}

          <form onSubmit={guardarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Nombre + Apellido */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese el nombre"
                  style={{ ...inputBase, borderColor: errores.nombre ? '#ef4444' : '#eee4e4' }}
                  onFocus={errores.nombre ? handleFocusError : handleFocus}
                  onBlur={handleBlur}
                />
                {errores.nombre && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                    {errores.nombre}
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ingrese el apellido"
                  style={{ ...inputBase, borderColor: errores.apellido ? '#ef4444' : '#eee4e4' }}
                  onFocus={errores.apellido ? handleFocusError : handleFocus}
                  onBlur={handleBlur}
                />
                {errores.apellido && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                    {errores.apellido}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese el email"
                style={{ ...inputBase, borderColor: errores.email ? '#ef4444' : '#eee4e4' }}
                onFocus={errores.email ? handleFocusError : handleFocus}
                onBlur={handleBlur}
              />
              {errores.email && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                  {errores.email}
                </p>
              )}
            </div>

            {/* DNI + Teléfono */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label style={labelStyle}>D.N.I.</label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="Ingrese el DNI"
                  style={inputBase}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div>
                <label style={labelStyle}>Teléfono</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ingrese el teléfono"
                  style={inputBase}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label style={labelStyle}>Fecha de nacimiento</label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                style={inputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input
                type="password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                placeholder="Ingrese la contraseña"
                style={{ ...inputBase, borderColor: errores.contrasenia ? '#ef4444' : '#eee4e4' }}
                onFocus={errores.contrasenia ? handleFocusError : handleFocus}
                onBlur={handleBlur}
              />
              {errores.contrasenia && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                  {errores.contrasenia}
                </p>
              )}
            </div>

            {/* Campos propios de Proveedor */}
            {tipoUsuario === 'PROVEEDOR' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={labelStyle}>Especialidad</label>
                    <select
                      value={especialidad}
                      onChange={(e) => setEspecialidad(e.target.value)}
                      style={{
                        ...inputBase,
                        borderColor: errores.especialidad ? '#ef4444' : '#eee4e4',
                        cursor: 'pointer',
                        appearance: 'none',
                      }}
                      onFocus={errores.especialidad ? handleFocusError : handleFocus}
                      onBlur={handleBlur}
                    >
                      <option value="">Seleccione una especialidad</option>
                      {ESPECIALIDADES.map((esp) => (
                        <option key={esp} value={esp}>
                          {esp.charAt(0) + esp.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    {errores.especialidad && (
                      <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px' }}>
                        {errores.especialidad}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Zona</label>
                    <input
                      type="text"
                      value={zona}
                      onChange={(e) => setZona(e.target.value)}
                      placeholder="Zona de cobertura"
                      style={inputBase}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Descripción</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                    placeholder="Contá brevemente los servicios que ofrecés"
                    style={{ ...inputBase, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Activo: solo lectura, es un estado de verificación/disponibilidad */}
                <div>
                  <label style={labelStyle}>Estado</label>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '6px 16px',
                      borderRadius: '999px',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: activo ? '#f0fdf4' : '#f3f4f6',
                      color: activo ? '#16a34a' : '#6b7280',
                    }}
                  >
                    {activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </>
            )}

            {/* Botón */}
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
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;