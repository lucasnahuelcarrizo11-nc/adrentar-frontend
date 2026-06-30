import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import AlquilerService from "../../service/AlquilerService";
import DocumentoService from "../../service/DocumentoService";
import PagoService from "../../service/PagoService";
import ReporteService from "../../service/ReporteService";

/* ── Utils ───────────────────────────────────────────────── */
const generarMesesAlquiler = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const meses = [];
  let actual = new Date(inicio);
  while (actual <= fin) {
    meses.push({
      year: actual.getFullYear(),
      month: actual.getMonth() + 1,
      label: actual.toLocaleString("es-AR", { month: "long", year: "numeric" }),
    });
    actual.setMonth(actual.getMonth() + 1);
  }
  return meses;
};

const formatearFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString("es-AR") : "-";

const formatearFechaHora = (fecha) =>
  fecha
    ? new Date(fecha).toLocaleString("es-AR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "-";

/* ── Badges ──────────────────────────────────────────────── */
const ESTADO_BADGE = {
  PENDIENTE:  { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  ACEPTADO:   { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  RECHAZADO:  { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
  CANCELADO:  { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
};

const EstadoBadge = ({ estado }) => {
  const s = ESTADO_BADGE[estado] || ESTADO_BADGE.CANCELADO;
  return (
    <span style={{
      padding: "4px 12px", borderRadius: "999px",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: "10px", fontWeight: "700",
      textTransform: "uppercase", letterSpacing: "0.05em",
    }}>
      {estado}
    </span>
  );
};

const REPORTE_BADGE = {
  PENDIENTE:   { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca", label: "Pendiente" },
  EN_REVISION: { bg: "#fffbeb", color: "#b45309", border: "#fde68a", label: "En revisión" },
  RESUELTO:    { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", label: "Resuelto" },
};

const ReporteBadge = ({ estado }) => {
  const s = REPORTE_BADGE[estado] || { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb", label: estado };
  return (
    <span style={{
      padding: "3px 10px", borderRadius: "999px",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em",
    }}>
      {s.label}
    </span>
  );
};

/* ── Estilos compartidos ─────────────────────────────────── */
const S = {
  // botón de acción de la tabla (ojo, lápiz, etc.)
  iconBtn: (color = "#6c625c", hoverBg = "#f6f2ee", hoverColor = "#b07a5e") => ({
    base: { padding: "10px", borderRadius: "12px", border: "none", background: "transparent", color, cursor: "pointer", transition: "all 0.2s", display: "inline-flex", alignItems: "center", justifyContent: "center" },
    hover: { background: hoverBg, color: hoverColor },
  }),
  // botón de acción con texto dentro de la fila expandida
  actionBtn: (bg, hoverBg, color = "white") => ({
    padding: "8px 16px", borderRadius: "12px", border: "none",
    background: bg, color, fontSize: "12px", fontWeight: "600",
    cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.2s",
    display: "inline-flex", alignItems: "center", gap: "6px",
  }),
  label: {
    display: "block", fontSize: "10px", fontWeight: "700",
    textTransform: "uppercase", letterSpacing: "0.1em",
    color: "#b07a5e", marginBottom: "6px", marginLeft: "2px",
  },
  input: {
    width: "100%", boxSizing: "border-box",
    background: "#fcfaf9", border: "1px solid #eee4e4",
    borderRadius: "12px", padding: "10px 14px",
    fontSize: "14px", color: "#3b3735", outline: "none",
    fontFamily: "Inter, sans-serif", transition: "all 0.2s",
  },
};

/* ── SVG Icons ───────────────────────────────────────────── */
const IconEye = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
  </svg>
);
const IconCard = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);
const IconDoc = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
  </svg>
);
const IconFlag = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21V4m0 0l9-1 9 1v11l-9-1-9 1V4z"/>
  </svg>
);
const IconWarn = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
  </svg>
);

/* ── Hover helper ────────────────────────────────────────── */
const HoverBtn = ({ style, hoverStyle, children, ...props }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      style={{ ...style, ...(hovered ? hoverStyle : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
};

/* ── Modal de confirmación reutilizable ──────────────────── */
const ConfirmModal = ({ accentColor = "#b07a5e", titulo, descripcion, labelConfirm, onConfirm, onCancel }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 50,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
  }}>
    <div style={{
      background: "white", borderRadius: "24px", padding: "32px",
      width: "100%", maxWidth: "400px",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", color: accentColor }}>
        <IconWarn />
        <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>{titulo}</h3>
      </div>
      <p style={{ fontSize: "14px", color: "#6c625c", marginBottom: "28px", lineHeight: 1.6 }}>{descripcion}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <HoverBtn
          onClick={onCancel}
          style={{ padding: "10px 20px", borderRadius: "12px", border: "1px solid #e8e2dc", background: "white", color: "#3b3735", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
          hoverStyle={{ background: "#f6f2ee" }}
        >
          Volver
        </HoverBtn>
        <HoverBtn
          onClick={onConfirm}
          style={{ padding: "10px 20px", borderRadius: "12px", border: "none", background: accentColor, color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
          hoverStyle={{ opacity: 0.88 }}
        >
          {labelConfirm}
        </HoverBtn>
      </div>
    </div>
  </div>
);

/* ── Panel expandible wrapper ────────────────────────────── */
const PanelExpandido = ({ accentBg, accentBorder, children }) => (
  <tr>
    <td colSpan="5" style={{ padding: 0 }}>
      <div style={{
        margin: "0 24px 16px",
        background: accentBg,
        border: `1px solid ${accentBorder}`,
        borderRadius: "20px",
        padding: "24px",
      }}>
        {children}
      </div>
    </td>
  </tr>
);

/* ════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════════════ */
const ListAlquileres = () => {
  const [alquileres, setAlquileres]       = useState([]);
  const [docs, setDocs]                   = useState([]);
  const [archivo, setArchivo]             = useState(null);
  const [pagos, setPagos]                 = useState({});
  const [reportes, setReportes]           = useState({});
  const [idAlquilerPendiente, setIdAlquilerPendiente] = useState(null);

  const [nuevoReporte, setNuevoReporte]   = useState({ titulo: "", descripcion: "" });
  const [enviandoReporte, setEnviandoReporte] = useState(false);

  const [modalCancelacion, setModalCancelacion]   = useState(null);
  const [modalRechazo, setModalRechazo]           = useState(null);
  const [alquilerExpandidoPagos, setAlquilerExpandidoPagos]       = useState(null);
  const [alquilerExpandidoDocs, setAlquilerExpandidoDocs]         = useState(null);
  const [alquilerExpandidoReportes, setAlquilerExpandidoReportes] = useState(null);
  const [animando, setAnimando]           = useState(null);

  const rol = (localStorage.getItem("tipo_usuario") || "").toUpperCase();

  useEffect(() => { cargarAlquileres(); }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const paymentId = params.get("payment_id");
    const externalReference = params.get("external_reference");
    if (status && paymentId) {
      window.history.replaceState({}, "", window.location.pathname);
      if (status === "approved")  toast.success("¡Pago aprobado! Actualizando...");
      else if (status === "rejected") toast.error("El pago fue rechazado");
      else toast.info("El pago está pendiente de confirmación");
      if (externalReference) {
        setIdAlquilerPendiente(Number(externalReference.split("-")[0]));
      }
      cargarAlquileres();
    }
  }, []);

  useEffect(() => {
    if (idAlquilerPendiente && alquileres.length > 0) {
      setAlquilerExpandidoPagos(idAlquilerPendiente);
      cargarPagos(idAlquilerPendiente);
      setIdAlquilerPendiente(null);
    }
  }, [alquileres, idAlquilerPendiente]);

  const cargarAlquileres = () =>
    AlquilerService.obtenerMisAlquileres()
      .then((res) => setAlquileres(res.data))
      .catch(() => toast.error("Error al obtener alquileres"));

  /* Aceptar / Rechazar / Cancelar */
  const aceptarAlquiler = async (id) => {
    try {
      setAnimando(id);
      await AlquilerService.aceptarAlquiler(id);
      toast.success("Alquiler aceptado correctamente");
      cargarAlquileres();
      setTimeout(() => setAnimando(null), 600);
    } catch { toast.error("Error al aceptar alquiler"); }
  };

  const confirmarRechazo = async () => {
    try {
      await AlquilerService.rechazarAlquiler(modalRechazo);
      toast.success("Alquiler rechazado");
      setModalRechazo(null);
      cargarAlquileres();
    } catch { toast.error("Error al rechazar alquiler"); }
  };

  const confirmarCancelacion = async () => {
    try {
      await AlquilerService.cancelarAlquiler(modalCancelacion);
      toast.success("Alquiler cancelado correctamente");
      setModalCancelacion(null);
      cargarAlquileres();
    } catch { toast.error("Error al cancelar alquiler"); }
  };

  /* Pagos */
  const cargarPagos = async (id) => {
    try {
      const res = await PagoService.obtenerPagosPorAlquiler(id);
      setPagos((p) => ({ ...p, [id]: res.data }));
    } catch { toast.error("Error al cargar pagos"); }
  };

  const togglePagos = async (id) => {
    if (alquilerExpandidoPagos === id) { setAlquilerExpandidoPagos(null); return; }
    setAlquilerExpandidoPagos(id);
    await cargarPagos(id);
  };

  const pagarMes = async (idAlquiler, mes) => {
    try {
      const initPoint = await PagoService.crearPago(idAlquiler, mes.month, mes.year);
      if (!initPoint || typeof initPoint !== "string") { toast.error("No se recibió un link válido"); return; }
      window.location.href = initPoint;
    } catch (error) {
      toast.error(error.response?.data || "Error al iniciar el pago");
    }
  };

  /* Reportes */
  const cargarReportes = async (id) => {
    try {
      const res = await ReporteService.obtenerPorAlquiler(id);
      setReportes((r) => ({ ...r, [id]: res.data }));
    } catch { toast.error("Error al cargar reportes"); }
  };

  const toggleReportes = async (id) => {
    if (alquilerExpandidoReportes === id) {
      setAlquilerExpandidoReportes(null);
      setNuevoReporte({ titulo: "", descripcion: "" });
      return;
    }
    setAlquilerExpandidoReportes(id);
    await cargarReportes(id);
  };

  const enviarReporte = async (idAlquiler) => {
    if (!nuevoReporte.titulo.trim() || !nuevoReporte.descripcion.trim()) {
      toast.warning("Completá el título y la descripción"); return;
    }
    setEnviandoReporte(true);
    try {
      await ReporteService.crearReporte({ idAlquiler, ...nuevoReporte });
      toast.success("Reporte enviado correctamente");
      setNuevoReporte({ titulo: "", descripcion: "" });
      await cargarReportes(idAlquiler);
    } catch (error) {
      toast.error(error.response?.data || "Error al enviar el reporte");
    } finally { setEnviandoReporte(false); }
  };

  const cambiarEstadoReporte = async (idReporte, estado, idAlquiler) => {
    try {
      await ReporteService.cambiarEstado(idReporte, estado);
      toast.success("Estado actualizado");
      await cargarReportes(idAlquiler);
    } catch { toast.error("Error al actualizar estado"); }
  };

  /* Documentos */
  const toggleDocs = async (id) => {
    if (alquilerExpandidoDocs === id) { setAlquilerExpandidoDocs(null); return; }
    try {
      setAlquilerExpandidoDocs(id);
      const res = await DocumentoService.obtenerDocumentosPorAlquiler(id);
      setDocs(res.data);
    } catch { toast.error("Error al cargar documentos"); }
  };

  const subirDocumento = async (idAlquiler) => {
    if (!archivo) return;
    try {
      await DocumentoService.subirDocumento(idAlquiler, archivo);
      setArchivo(null);
      const res = await DocumentoService.obtenerDocumentosPorAlquiler(idAlquiler);
      setDocs(res.data);
      toast.success("Documento subido correctamente");
    } catch { toast.error("Error al subir documento"); }
  };

  const eliminarDocumento = async (id) => {
    if (!window.confirm("¿Eliminar documento?")) return;
    try {
      await DocumentoService.eliminarDocumento(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
      toast.success("Documento eliminado");
    } catch { toast.error("Error al eliminar documento"); }
  };

  const verDocumento = async (doc) => {
    try {
      const res = await DocumentoService.descargarDocumento(doc.id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }));
      window.open(url);
    } catch { toast.error("Error al abrir documento"); }
  };

  /* ── RENDER ────────────────────────────────────────────── */
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "2rem", background: "#f6f2ee", fontFamily: "Inter, sans-serif", position: "relative" }}>

      {/* Overlay loader reporte */}
      {enviandoReporte && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ width: "48px", height: "48px", border: "3px solid #e8e2dc", borderTopColor: "#b07a5e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: "#3b3735", fontWeight: "600", fontSize: "15px", margin: 0 }}>Enviando reporte...</p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>

        {/* Cabecera */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "300", color: "#3b3735", margin: 0 }}>
              Mis <span style={{ fontWeight: "600", color: "#b07a5e" }}>Alquileres</span>
            </h1>
            <p style={{ fontSize: "14px", color: "#6c625c", marginTop: "4px" }}>
              Seguimiento de contratos y períodos de vigencia.
            </p>
          </div>

          {rol === "PROPIETARIO" && (
            <Link
              to="/CrearAlquiler"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#3b3735", color: "white",
                padding: "12px 24px", borderRadius: "16px",
                fontSize: "14px", fontWeight: "500", textDecoration: "none",
                boxShadow: "0 10px 30px -8px rgba(59,55,53,0.25)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2725")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3b3735")}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Nuevo Alquiler
            </Link>
          )}
        </div>

        {/* Tabla */}
        <div style={{ background: "white", borderRadius: "2.5rem", border: "1px solid #e8e2dc", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#fcfaf9", borderBottom: "1px solid #e8e2dc" }}>
                  {["Propiedad", "Inicio", "Fin", "Estado", "Acciones"].map((h, i) => (
                    <th key={h} style={{
                      padding: "20px 32px", fontSize: "10px", fontWeight: "700",
                      textTransform: "uppercase", letterSpacing: "0.12em", color: "#b07a5e",
                      textAlign: i === 4 ? "right" : "left",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {alquileres.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: "48px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "#f6f2ee", border: "1px solid #e8e2dc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>📋</div>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#3b3735", margin: 0 }}>No tenés alquileres registrados</p>
                      </div>
                    </td>
                  </tr>
                )}

                {alquileres.map((alq) => {
                  const filaAtenuada = alq.estado === "RECHAZADO" || alq.estado === "CANCELADO";
                  const meses = generarMesesAlquiler(alq.fechaInicio, alq.fechaFin);

                  return (
                    <React.Fragment key={alq.idAlquiler}>

                      {/* ── Fila principal ── */}
                      <tr style={{
                        borderBottom: "1px solid #e8e2dc",
                        opacity: filaAtenuada ? 0.55 : 1,
                        transition: "background 0.15s",
                        transform: animando === alq.idAlquiler ? "scale(1.01)" : "scale(1)",
                      }}
                        onMouseEnter={(e) => { if (!filaAtenuada) e.currentTarget.style.background = "#fcfaf9"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
                      >
                        {/* Propiedad */}
                        <td style={{ padding: "24px 32px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f6f2ee", border: "1px solid #e8e2dc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🏠</div>
                            <div>
                              <p style={{ fontSize: "14px", fontWeight: "700", color: "#3b3735", margin: 0 }}>{alq.direccionPropiedad}</p>
                              <p style={{ fontSize: "11px", color: "#6c625c", margin: "2px 0 0" }}>ID #{alq.idAlquiler}</p>
                            </div>
                          </div>
                        </td>

                        {/* Fechas */}
                        <td style={{ padding: "24px 32px", fontSize: "14px", fontWeight: "500", color: "#3b3735" }}>{formatearFecha(alq.fechaInicio)}</td>
                        <td style={{ padding: "24px 32px", fontSize: "14px", fontWeight: "500", color: "#3b3735" }}>{formatearFecha(alq.fechaFin)}</td>

                        {/* Estado */}
                        <td style={{ padding: "24px 32px" }}><EstadoBadge estado={alq.estado} /></td>

                        {/* Acciones */}
                        <td style={{ padding: "24px 32px" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", flexWrap: "wrap" }}>

                            {/* Pendiente → inquilino acepta/rechaza */}
                            {alq.estado === "PENDIENTE" && rol === "INQUILINO" && (
                              <>
                                <HoverBtn
                                  onClick={() => aceptarAlquiler(alq.idAlquiler)}
                                  style={{ ...S.actionBtn("#16a34a", "#15803d"), fontSize: "11px" }}
                                  hoverStyle={{ opacity: 0.88 }}
                                  title="Aceptar"
                                >
                                  <IconCheck /> Aceptar
                                </HoverBtn>
                                <HoverBtn
                                  onClick={() => setModalRechazo(alq.idAlquiler)}
                                  style={{ ...S.actionBtn("#dc2626", "#b91c1c"), fontSize: "11px" }}
                                  hoverStyle={{ opacity: 0.88 }}
                                  title="Rechazar"
                                >
                                  <IconX /> Rechazar
                                </HoverBtn>
                              </>
                            )}

                            {/* Aceptado → pagos / docs / reportes / cancelar */}
                            {alq.estado === "ACEPTADO" && (
                              <>
                                <HoverBtn
                                  onClick={() => togglePagos(alq.idAlquiler)}
                                  style={{ ...S.actionBtn(alquilerExpandidoPagos === alq.idAlquiler ? "#3b3735" : "#f6f2ee", "#3b3735", alquilerExpandidoPagos === alq.idAlquiler ? "white" : "#3b3735"), fontSize: "11px", border: "1px solid #e8e2dc" }}
                                  hoverStyle={{ background: "#3b3735", color: "white", border: "1px solid #3b3735" }}
                                  title="Pagos"
                                >
                                  <IconCard /> Pagos
                                </HoverBtn>
                                <HoverBtn
                                  onClick={() => toggleDocs(alq.idAlquiler)}
                                  style={{ ...S.actionBtn(alquilerExpandidoDocs === alq.idAlquiler ? "#3b3735" : "#f6f2ee", "#3b3735", alquilerExpandidoDocs === alq.idAlquiler ? "white" : "#3b3735"), fontSize: "11px", border: "1px solid #e8e2dc" }}
                                  hoverStyle={{ background: "#3b3735", color: "white", border: "1px solid #3b3735" }}
                                  title="Documentos"
                                >
                                  <IconDoc /> Docs
                                </HoverBtn>
                                <HoverBtn
                                  onClick={() => toggleReportes(alq.idAlquiler)}
                                  style={{ ...S.actionBtn(alquilerExpandidoReportes === alq.idAlquiler ? "#b07a5e" : "#f6f2ee", "#b07a5e", alquilerExpandidoReportes === alq.idAlquiler ? "white" : "#b07a5e"), fontSize: "11px", border: "1px solid #e8e2dc" }}
                                  hoverStyle={{ background: "#b07a5e", color: "white", border: "1px solid #b07a5e" }}
                                  title="Reportes"
                                >
                                  <IconFlag /> Reportes
                                </HoverBtn>
                                <HoverBtn
                                  onClick={() => setModalCancelacion(alq.idAlquiler)}
                                  style={{ padding: "8px 10px", borderRadius: "12px", border: "none", background: "transparent", color: "#f87171", cursor: "pointer", transition: "all 0.2s", display: "inline-flex" }}
                                  hoverStyle={{ background: "#fef2f2" }}
                                  title="Cancelar alquiler"
                                >
                                  <IconX />
                                </HoverBtn>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* ── Panel PAGOS ── */}
                      {alquilerExpandidoPagos === alq.idAlquiler && (
                        <PanelExpandido accentBg="#f0fdf4" accentBorder="#bbf7d0">
                          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#15803d", marginBottom: "16px" }}>
                            📅 Meses del alquiler
                          </p>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
                            {meses.map((mes, i) => {
                              const pagosAlquiler = pagos[alq.idAlquiler] || [];
                              const pago = pagosAlquiler.find((p) => p.mes === mes.month && p.anio === mes.year);
                              const estado = pago?.estado;
                              return (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", border: "1px solid #e8e2dc", borderRadius: "14px", padding: "12px 16px" }}>
                                  <span style={{ fontSize: "13px", color: "#3b3735", textTransform: "capitalize", fontWeight: "500" }}>{mes.label}</span>
                                  {estado === "APROBADO" ? (
                                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#15803d" }}>✔ Pagado</span>
                                  ) : estado === "PENDIENTE" ? (
                                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#b45309" }}>⏳ Pendiente</span>
                                  ) : estado === "RECHAZADO" ? (
                                    <HoverBtn onClick={() => pagarMes(alq.idAlquiler, mes)} style={S.actionBtn("#dc2626", "#b91c1c")} hoverStyle={{ opacity: 0.88 }}>Reintentar</HoverBtn>
                                  ) : (
                                    <HoverBtn onClick={() => pagarMes(alq.idAlquiler, mes)} style={S.actionBtn("#b07a5e", "#9c6a50")} hoverStyle={{ opacity: 0.88 }}>Pagar</HoverBtn>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </PanelExpandido>
                      )}

                      {/* ── Panel REPORTES ── */}
                      {alquilerExpandidoReportes === alq.idAlquiler && (
                        <PanelExpandido accentBg="#fff8f6" accentBorder="#f5d5c8">
                          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#b07a5e", marginBottom: "16px" }}>
                            🚩 Reportes de la propiedad
                          </p>

                          {/* Formulario — solo inquilino */}
                          {rol === "INQUILINO" && (
                            <div style={{ background: "white", border: "1px solid #f5d5c8", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                              <p style={{ fontSize: "12px", fontWeight: "700", color: "#b07a5e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Reportar un problema</p>
                              <input
                                type="text"
                                placeholder="Título del problema (ej: Calefacción rota)"
                                value={nuevoReporte.titulo}
                                onChange={(e) => setNuevoReporte({ ...nuevoReporte, titulo: e.target.value })}
                                style={{ ...S.input, marginBottom: "10px" }}
                                onFocus={(e) => { e.target.style.borderColor = "#b07a5e"; e.target.style.background = "#fff"; }}
                                onBlur={(e) => { e.target.style.borderColor = "#eee4e4"; e.target.style.background = "#fcfaf9"; }}
                              />
                              <textarea
                                placeholder="Descripción detallada del problema..."
                                value={nuevoReporte.descripcion}
                                onChange={(e) => setNuevoReporte({ ...nuevoReporte, descripcion: e.target.value })}
                                rows={3}
                                style={{ ...S.input, resize: "vertical", marginBottom: "14px" }}
                                onFocus={(e) => { e.target.style.borderColor = "#b07a5e"; e.target.style.background = "#fff"; }}
                                onBlur={(e) => { e.target.style.borderColor = "#eee4e4"; e.target.style.background = "#fcfaf9"; }}
                              />
                              <HoverBtn
                                onClick={() => enviarReporte(alq.idAlquiler)}
                                disabled={enviandoReporte}
                                style={{ ...S.actionBtn("#b07a5e", "#9c6a50"), opacity: enviandoReporte ? 0.6 : 1, cursor: enviandoReporte ? "not-allowed" : "pointer" }}
                                hoverStyle={{ opacity: 0.88 }}
                              >
                                Enviar reporte
                              </HoverBtn>
                            </div>
                          )}

                          {/* Lista de reportes */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {(reportes[alq.idAlquiler] || []).length === 0 ? (
                              <p style={{ fontSize: "13px", color: "#6c625c" }}>No hay reportes para este alquiler.</p>
                            ) : (
                              (reportes[alq.idAlquiler] || []).map((r) => (
                                <div key={r.idReporte} style={{ background: "white", border: "1px solid #e8e2dc", borderRadius: "16px", padding: "16px 20px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#3b3735" }}>{r.titulo}</span>
                                    <ReporteBadge estado={r.estado} />
                                  </div>
                                  <p style={{ fontSize: "13px", color: "#6c625c", margin: "0 0 8px" }}>{r.descripcion}</p>
                                  <p style={{ fontSize: "11px", color: "#9c8f8a", margin: "0 0 12px" }}>Reportado el {formatearFechaHora(r.fechaCreacion)}</p>
                                  {rol === "PROPIETARIO" && r.estado !== "RESUELTO" && (
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                      {r.estado === "PENDIENTE" && (
                                        <HoverBtn onClick={() => cambiarEstadoReporte(r.idReporte, "EN_REVISION", alq.idAlquiler)} style={S.actionBtn("#b45309", "#92400e")} hoverStyle={{ opacity: 0.88 }}>
                                          Tomar en revisión
                                        </HoverBtn>
                                      )}
                                      <HoverBtn onClick={() => cambiarEstadoReporte(r.idReporte, "RESUELTO", alq.idAlquiler)} style={S.actionBtn("#15803d", "#166534")} hoverStyle={{ opacity: 0.88 }}>
                                        Marcar como resuelto
                                      </HoverBtn>
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </PanelExpandido>
                      )}

                      {/* ── Panel DOCUMENTOS ── */}
                      {alquilerExpandidoDocs === alq.idAlquiler && (
                        <PanelExpandido accentBg="#f8f7ff" accentBorder="#c7d2fe">
                          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#4f46e5", marginBottom: "16px" }}>
                            📄 Documentos del alquiler
                          </p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                            {docs.length === 0 ? (
                              <p style={{ fontSize: "13px", color: "#6c625c" }}>No hay documentos cargados.</p>
                            ) : docs.map((d) => (
                              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", border: "1px solid #e8e2dc", borderRadius: "14px", padding: "12px 18px" }}>
                                <span style={{ fontSize: "13px", color: "#3b3735", fontWeight: "500" }}>{d.nombreArchivo}</span>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <HoverBtn onClick={() => verDocumento(d)} style={S.actionBtn("#3b3735", "#2a2725")} hoverStyle={{ opacity: 0.88 }}>Ver</HoverBtn>
                                  <HoverBtn onClick={() => eliminarDocumento(d.id)} style={S.actionBtn("#dc2626", "#b91c1c")} hoverStyle={{ opacity: 0.88 }}>Eliminar</HoverBtn>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <input
                              type="file"
                              onChange={(e) => setArchivo(e.target.files[0])}
                              style={{ fontSize: "13px", color: "#3b3735" }}
                            />
                            <HoverBtn
                              onClick={() => subirDocumento(alq.idAlquiler)}
                              disabled={!archivo}
                              style={{ ...S.actionBtn("#b07a5e", "#9c6a50"), opacity: !archivo ? 0.5 : 1, cursor: !archivo ? "not-allowed" : "pointer" }}
                              hoverStyle={{ opacity: archivo ? 0.88 : 0.5 }}
                            >
                              Subir Documento
                            </HoverBtn>
                          </div>
                        </PanelExpandido>
                      )}

                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer tabla */}
          {alquileres.length > 0 && (
            <div style={{ padding: "16px 32px", borderTop: "1px solid #e8e2dc", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: "500", color: "#6c625c", margin: 0 }}>
                <span style={{ color: "#3b3735", fontWeight: "700" }}>{alquileres.length}</span> contrato{alquileres.length !== 1 ? "s" : ""} registrado{alquileres.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Rechazo */}
      {modalRechazo && (
        <ConfirmModal
          accentColor="#dc2626"
          titulo="Confirmar rechazo"
          descripcion="¿Estás seguro de rechazar este alquiler? Esta acción no se puede deshacer."
          labelConfirm="Rechazar"
          onConfirm={confirmarRechazo}
          onCancel={() => setModalRechazo(null)}
        />
      )}

      {/* Modal Cancelación */}
      {modalCancelacion && (
        <ConfirmModal
          accentColor="#b07a5e"
          titulo="Confirmar cancelación"
          descripcion="¿Estás seguro de cancelar este alquiler? Esta acción notificará a la otra parte."
          labelConfirm="Cancelar alquiler"
          onConfirm={confirmarCancelacion}
          onCancel={() => setModalCancelacion(null)}
        />
      )}

    </div>
  );
};

export default ListAlquileres;