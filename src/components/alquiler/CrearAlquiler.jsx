import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropiedadService from "../../service/PropiedadService";
import AlquilerService from "../../service/AlquilerService";
import ModalContrato from "./ModalContrato";

// ── Estilos compartidos (mismos que CrearReparacion / CrearPropiedad) ───────
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
// ────────────────────────────────────────────────────────────────────────────

function CrearAlquiler() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [mostrarModalContrato, setMostrarModalContrato] = useState(false);
  const [alquilerCreado, setAlquilerCreado] = useState(null);
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    idPropiedad: "",
    emailInquilino: "",
    precio: "",
    fechaInicio: "",
    fechaFin: "",
    porcentajeAumento: "",
  });

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    PropiedadService.listarMisPropiedades()
      .then((res) => setPropiedades(res.data))
      .catch(() => setMensaje("Error cargando propiedades"));
  }, []);

  const handleChange = (e) => {
    if (loading) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMensaje("");

    try {
      const alquilerData = {
        idPropiedad: Number(form.idPropiedad),
        emailInquilino: form.emailInquilino,
        precio: Number(form.precio),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        porcentajeAumento: form.porcentajeAumento
          ? Number(form.porcentajeAumento)
          : null,
      };

      const resultado = await AlquilerService.crearAlquiler(alquilerData);
      setAlquilerCreado(resultado.data);
      setMostrarModalContrato(true);

      setForm({
        idPropiedad: "",
        emailInquilino: "",
        precio: "",
        fechaInicio: "",
        fechaFin: "",
        porcentajeAumento: "",
      });
    } catch (error) {
      if (error.response?.data?.message) {
        setMensaje(error.response.data.message);
      } else {
        setMensaje("Error al crear el alquiler");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', background: '#f6f2ee', fontFamily: 'Inter, sans-serif', position: 'relative' }}>

      {/* Overlay loader */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: 'white', borderRadius: '24px', padding: '40px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          }}>
            <div style={{
              width: '48px', height: '48px', border: '3px solid #e8e2dc',
              borderTopColor: '#b07a5e', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#3b3735', fontWeight: '600', fontSize: '15px', margin: 0 }}>
              Creando alquiler...
            </p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <Link
          to="/listAlquileres"
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
          Volver a alquileres
        </Link>

        <div style={{
          background: 'white', borderRadius: '2.5rem',
          border: '1px solid #e8e2dc', padding: '3rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#3b3735', margin: 0 }}>
              Crear <span style={{ fontWeight: '600', color: '#b07a5e' }}>Alquiler</span>
            </h1>
            <p style={{ fontSize: '14px', color: '#6c625c', marginTop: '4px' }}>
              Completá los datos para generar un nuevo contrato de alquiler.
            </p>
          </div>

          {mensaje && (
            <div style={{
              background: mensaje.includes("correctamente") ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${mensaje.includes("correctamente") ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: '12px', padding: '12px 16px',
              color: mensaje.includes("correctamente") ? '#15803d' : '#dc2626',
              fontSize: '13px', marginBottom: '24px',
            }}>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Propiedad */}
            <div>
              <label style={labelStyle}>Propiedad</label>
              <select
                name="idPropiedad"
                value={form.idPropiedad}
                onChange={handleChange}
                required
                disabled={loading}
                style={{ ...inputBase, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option value="">Seleccioná una propiedad</option>
                {propiedades.map((p) => (
                  <option key={p.idPropiedad} value={p.idPropiedad}>
                    {p.direccion}
                  </option>
                ))}
              </select>
            </div>

            {/* Email del inquilino */}
            <div>
              <label style={labelStyle}>Email del inquilino</label>
              <input
                type="email"
                name="emailInquilino"
                value={form.emailInquilino}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="inquilino@email.com"
                style={{ ...inputBase, opacity: loading ? 0.6 : 1 }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Precio */}
            <div>
              <label style={labelStyle}>Precio</label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Ej: 150000"
                style={{ ...inputBase, opacity: loading ? 0.6 : 1 }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Aumento */}
            <div>
              <label style={labelStyle}>Aumento cada 4 meses (%, opcional)</label>
              <input
                type="number"
                name="porcentajeAumento"
                value={form.porcentajeAumento}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Ej: 10"
                disabled={loading}
                style={{ ...inputBase, opacity: loading ? 0.6 : 1 }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Fechas */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Fecha de inicio</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={form.fechaInicio}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{ ...inputBase, opacity: loading ? 0.6 : 1 }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Fecha de fin</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={form.fechaFin}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{ ...inputBase, opacity: loading ? 0.6 : 1 }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1, minWidth: '140px',
                  background: loading ? '#d8b8a6' : '#b07a5e',
                  color: 'white',
                  padding: '1rem', borderRadius: '1rem', border: 'none',
                  fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                  letterSpacing: '0.12em', cursor: loading ? 'default' : 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (loading) return;
                  e.target.style.background = '#9c6a50';
                  e.target.style.boxShadow = '0 8px 20px rgba(176,122,94,0.25)';
                }}
                onMouseLeave={(e) => {
                  if (loading) return;
                  e.target.style.background = '#b07a5e';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {loading ? 'Creando...' : 'Crear alquiler'}
              </button>
              <Link
                to="/listAlquileres"
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

      {mostrarModalContrato && alquilerCreado && (
        <ModalContrato
          alquiler={alquilerCreado}
          propietario={{
            email: usuario.email,
            nombre: `${usuario.nombre} ${usuario.apellido}`,
          }}
          onCerrar={() => {
            setMostrarModalContrato(false);
            setMensaje("Alquiler creado correctamente");
          }}
        />
      )}
    </div>
  );
}

export default CrearAlquiler;