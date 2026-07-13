import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuditoriaService from "../../service/AuditoriaService";

/* ── Estilos ─────────────────────────────────────────────── */
const S = {
  actionBtn: (bg, hoverBg, color = "white") => ({
    padding: "10px 20px", borderRadius: "12px", border: "none",
    background: bg, color, fontSize: "13px", fontWeight: "600",
    cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.2s",
    display: "inline-flex", alignItems: "center", gap: "8px",
  }),
};

const HoverBtn = ({ style, hoverStyle, children, ...props }) => {
  const [hovered, setHovered] = useState(false);
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

const IconArrowLeft = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);
const IconCamera = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 17a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);

const API_URL = import.meta.env.VITE_API_URL || "https://TU-BACKEND.onrender.com";

/* ── Galería de una sección (ENTRADA o SALIDA) ──────────── */
const SeccionAuditoria = ({ titulo, subtitulo, datos, puedeSubir, onSubir, onEliminar, subiendo }) => {
  const [archivos, setArchivos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  const handleArchivos = (e) => {
    const files = Array.from(e.target.files);
    setArchivos(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const subir = async () => {
    await onSubir(archivos);
    setArchivos([]);
    setPreviews([]);
  };

  const imagenes = datos?.imagenes || [];

  return (
    <div style={{
      background: "white", border: "1px solid #e8e2dc", borderRadius: "24px",
      padding: "28px", marginBottom: "24px",
    }}>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#b07a5e", margin: 0 }}>
          {titulo}
        </p>
        <p style={{ fontSize: "13px", color: "#6c625c", margin: "4px 0 0" }}>{subtitulo}</p>
      </div>

      {/* Galería */}
      {imagenes.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "40px", background: "#fcfaf9", border: "1px dashed #e8e2dc", borderRadius: "16px",
          marginBottom: puedeSubir ? "20px" : 0,
        }}>
          <span style={{ fontSize: "28px", marginBottom: "8px" }}>🖼️</span>
          <p style={{ fontSize: "13px", color: "#9c8f8a", margin: 0 }}>Todavía no hay imágenes cargadas</p>
        </div>
      ) : (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "12px", marginBottom: puedeSubir ? "20px" : 0,
        }}>
          {imagenes.map((img) => (
            <div key={img.id} style={{ position: "relative", aspectRatio: "1", borderRadius: "14px", overflow: "hidden", border: "1px solid #e8e2dc" }}>
              <img
                src={`${API_URL}${img.url}`}
                alt="auditoria"
                onClick={() => setLightbox(`${API_URL}${img.url}`)}
                style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
              />
              {puedeSubir && (
                <button
                  onClick={() => onEliminar(img.id)}
                  style={{
                    position: "absolute", top: "6px", right: "6px",
                    background: "rgba(220,38,38,0.9)", color: "white", border: "none",
                    borderRadius: "50%", width: "24px", height: "24px", fontSize: "13px",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Zona de carga (solo si corresponde al rol) */}
      {puedeSubir && (
        <div style={{ borderTop: "1px solid #f0ebe6", paddingTop: "20px" }}>
          {previews.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
              {previews.map((src, i) => (
                <img key={i} src={src} alt={`preview-${i}`} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "10px", border: "1px solid #e8e2dc" }} />
              ))}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <label
              htmlFor={`file-${titulo}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#f6f2ee", color: "#3b3735", border: "1px solid #e8e2dc",
                padding: "10px 18px", borderRadius: "12px", cursor: "pointer",
                fontSize: "13px", fontWeight: "600",
              }}
            >
              <IconCamera /> Elegir o tomar fotos
            </label>
            <input
              id={`file-${titulo}`}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleArchivos}
              style={{ display: "none" }}
            />
            <HoverBtn
              onClick={subir}
              disabled={subiendo || archivos.length === 0}
              style={{ ...S.actionBtn("#b07a5e", "#9c6a50"), opacity: (subiendo || archivos.length === 0) ? 0.5 : 1, cursor: (subiendo || archivos.length === 0) ? "not-allowed" : "pointer" }}
              hoverStyle={{ opacity: 0.88 }}
            >
              {subiendo ? "Subiendo..." : "Subir fotos"}
            </HoverBtn>
          </div>
        </div>
      )}

      {/* Lightbox simple */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: "24px",
          }}
        >
          <img src={lightbox} alt="ampliada" style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "12px" }} />
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
════════════════════════════════════════════════════════════ */
const AuditoriaAlquiler = () => {
  const { idAlquiler } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const alquiler = location.state?.alquiler;

  const rol = (localStorage.getItem("tipo_usuario") || "").toUpperCase();

  const [auditoria, setAuditoria] = useState({ entrada: null, salida: null });
  const [cargando, setCargando] = useState(true);
  const [subiendoEntrada, setSubiendoEntrada] = useState(false);
  const [subiendoSalida, setSubiendoSalida] = useState(false);

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idAlquiler]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [entrada, salida] = await Promise.all([
        AuditoriaService.obtener(idAlquiler, "ENTRADA"),
        AuditoriaService.obtener(idAlquiler, "SALIDA"),
      ]);
      setAuditoria({ entrada: entrada.data, salida: salida.data });
    } catch {
      toast.error("Error al cargar la auditoría");
    } finally {
      setCargando(false);
    }
  };

  const subirImagenes = async (tipo, archivos, setSubiendo) => {
    if (!archivos || archivos.length === 0) return;
    setSubiendo(true);
    try {
      const res = await AuditoriaService.obtenerOCrear(idAlquiler, tipo);
      await AuditoriaService.subirImagenes(res.data.id, archivos);
      toast.success("Imágenes subidas correctamente");
      await cargarDatos();
    } catch {
      toast.error("Error al subir las imágenes");
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarImagen = async (idImagen) => {
    if (!window.confirm("¿Eliminar imagen?")) return;
    try {
      await AuditoriaService.eliminarImagen(idImagen);
      toast.success("Imagen eliminada");
      await cargarDatos();
    } catch {
      toast.error("Error al eliminar imagen");
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "2rem", background: "#f6f2ee", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>

        {/* Cabecera */}
        <div style={{ marginBottom: "28px" }}>
          <HoverBtn
            onClick={() => navigate("/alquileres")}
            style={{ ...S.actionBtn("transparent", "transparent", "#6c625c"), padding: "6px 0", marginBottom: "16px" }}
            hoverStyle={{ color: "#3b3735" }}
          >
            <IconArrowLeft /> Volver a mis alquileres
          </HoverBtn>

          <h1 style={{ fontSize: "26px", fontWeight: "300", color: "#3b3735", margin: 0 }}>
            Auditoría <span style={{ fontWeight: "600", color: "#b07a5e" }}>del inmueble</span>
          </h1>
          {alquiler && (
            <p style={{ fontSize: "14px", color: "#6c625c", marginTop: "4px" }}>
              {alquiler.direccionPropiedad} · ID #{alquiler.idAlquiler}
            </p>
          )}
        </div>

        {cargando ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #e8e2dc", borderTopColor: "#b07a5e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            <SeccionAuditoria
              titulo="📷 Estado de entrada"
              subtitulo="Fotos del inmueble antes de comenzar el alquiler, a cargo del propietario."
              datos={auditoria.entrada}
              puedeSubir={rol === "PROPIETARIO"}
              onSubir={(archivos) => subirImagenes("ENTRADA", archivos, setSubiendoEntrada)}
              onEliminar={eliminarImagen}
              subiendo={subiendoEntrada}
            />

            <SeccionAuditoria
              titulo="📷 Estado de salida"
              subtitulo="Fotos del inmueble antes de finalizar el alquiler, a cargo del inquilino."
              datos={auditoria.salida}
              puedeSubir={rol === "INQUILINO"}
              onSubir={(archivos) => subirImagenes("SALIDA", archivos, setSubiendoSalida)}
              onEliminar={eliminarImagen}
              subiendo={subiendoSalida}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AuditoriaAlquiler;
