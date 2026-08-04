import React, { useState } from 'react';
import AlquilerService from '../../service/AlquilerService';
import { toast } from 'react-toastify';

const inputBase = {
  width: '100%', boxSizing: 'border-box',
  background: '#fcfaf9', border: '1px solid #eee4e4',
  borderRadius: '12px', padding: '10px 14px',
  fontSize: '14px', color: '#3b3735', outline: 'none',
  fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
};

const labelStyle = {
  display: 'block', fontSize: '10px', fontWeight: '700',
  textTransform: 'uppercase', letterSpacing: '0.1em',
  color: '#b07a5e', marginBottom: '6px', marginLeft: '2px',
};

const handleFocus = (e) => {
  e.target.style.borderColor = '#b07a5e';
  e.target.style.backgroundColor = '#fff';
};
const handleBlur = (e) => {
  e.target.style.borderColor = '#eee4e4';
  e.target.style.backgroundColor = '#fcfaf9';
};

const aFechaInput = (fecha) => {
  if (!fecha) return '';
  // Tomamos directamente los primeros 10 caracteres del string ISO ("YYYY-MM-DD"),
  // sin pasar por new Date()/toISOString(), para no correr el día según el
  // huso horario del navegador.
  if (typeof fecha === 'string') {
    return fecha.slice(0, 10);
  }
  // Fallback por si llega como objeto Date u otro tipo
  const d = new Date(fecha);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const ModalEditarAlquiler = ({ alquiler, onGuardado, onCerrar }) => {
  const [precio, setPrecio] = useState(alquiler.precio ?? '');
  const [fechaInicio, setFechaInicio] = useState(aFechaInput(alquiler.fechaInicio));
  const [fechaFin, setFechaFin] = useState(aFechaInput(alquiler.fechaFin));
  const [porcentajeAumento, setPorcentajeAumento] = useState(alquiler.porcentajeAumento ?? '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const guardar = async () => {
    setError('');

    if (!precio || Number(precio) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }
    if (!fechaInicio || !fechaFin) {
      setError('Completá fecha de inicio y fin');
      return;
    }
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    try {
      setGuardando(true);
      await AlquilerService.editarAlquiler(alquiler.idAlquiler, {
        precio: Number(precio),
        fechaInicio,
        fechaFin,
        porcentajeAumento: porcentajeAumento !== '' ? Number(porcentajeAumento) : null,
      });
      toast.success('Alquiler actualizado correctamente');
      onGuardado();
    } catch (err) {
      const mensaje = err.response?.data || 'No se pudo actualizar el alquiler';
      setError(typeof mensaje === 'string' ? mensaje : 'No se pudo actualizar el alquiler');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: '1rem',
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '32px',
        width: '100%', maxWidth: '440px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#3b3735', margin: '0 0 4px' }}>
          Editar alquiler
        </h3>
        <p style={{ fontSize: '13px', color: '#6c625c', margin: '0 0 24px' }}>
          {alquiler.direccionPropiedad}
        </p>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '12px', padding: '10px 14px',
            color: '#dc2626', fontSize: '13px', marginBottom: '18px',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={labelStyle}>Precio base</label>
            <input
              type="number" min="0" step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              style={inputBase}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Fecha inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                style={inputBase}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Fecha fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                style={inputBase}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Aumento cada 4 meses (%, opcional)</label>
            <input
              type="number" min="0" step="0.1"
              value={porcentajeAumento}
              onChange={(e) => setPorcentajeAumento(e.target.value)}
              placeholder="Ej: 10"
              style={inputBase}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
          <button
            onClick={onCerrar}
            disabled={guardando}
            style={{
              padding: '10px 20px', borderRadius: '12px', border: '1px solid #e8e2dc',
              background: 'white', color: '#3b3735', fontSize: '13px', fontWeight: '600',
              cursor: guardando ? 'default' : 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            style={{
              padding: '10px 20px', borderRadius: '12px', border: 'none',
              background: guardando ? '#d8b8a6' : '#b07a5e', color: 'white',
              fontSize: '13px', fontWeight: '600', cursor: guardando ? 'default' : 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarAlquiler;