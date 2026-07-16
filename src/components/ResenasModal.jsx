import React, { useEffect, useState } from "react";
import ResenaService from "../service/ResenaService";
import { useAuth } from "../context/AuthContext";
import { StarRatingDisplay, StarRatingInput } from "./proveedor/StartRating";

const ResenasModal = ({ proveedor, onClose, onResenaCreada }) => {
  const { usuario } = useAuth();
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const esAdmin = usuario?.tipo_usuario?.toUpperCase() === "ADMIN";

  const cargarResenas = () => {
    setCargando(true);
    ResenaService.listarPorProveedor(proveedor.idProveedor)
      .then((res) => setResenas(res.data))
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargarResenas(); }, [proveedor.idProveedor]);

  const enviarResena = () => {
    if (puntuacion < 1) {
      setError("Elegí una puntuación de al menos 1 estrella.");
      return;
    }
    setEnviando(true);
    setError("");

    ResenaService.crearResena({
      proveedor: { idProveedor: proveedor.idProveedor },
      idUsuario: usuario.idUsuario ?? usuario.id,
      nombreUsuario: usuario.nombre ?? usuario.nombreCompleto ?? "Usuario",
      tipoUsuario: usuario.tipo_usuario,
      puntuacion,
      comentario,
    })
      .then(() => {
        setPuntuacion(0);
        setComentario("");
        cargarResenas();
        if (onResenaCreada) onResenaCreada();
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo enviar la reseña. Probá de nuevo.");
      })
      .finally(() => setEnviando(false));
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(59,55,53,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white", borderRadius: "2rem", width: "100%", maxWidth: "560px",
          maxHeight: "85vh", overflowY: "auto", padding: "2rem",
          fontFamily: "Inter, sans-serif", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#3b3735", margin: 0 }}>
              {proveedor.nombreCompleto}
            </h2>
            <p style={{ fontSize: "13px", color: "#6c625c", marginTop: "4px" }}>{proveedor.especialidad}</p>
            <div style={{ marginTop: "8px" }}>
              <StarRatingDisplay promedio={proveedor.promedioPuntuacion} cantidad={proveedor.cantidadResenas} />
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none", background: "#f6f2ee", borderRadius: "12px",
              width: "32px", height: "32px", cursor: "pointer", color: "#6c625c", fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>

        {!esAdmin ? (
          <div style={{
            background: "#fcfaf9", border: "1px solid #e8e2dc", borderRadius: "1.5rem",
            padding: "1.25rem", marginBottom: "1.5rem",
          }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#3b3735", marginBottom: "10px" }}>
              Dejá tu reseña
            </p>
            <StarRatingInput value={puntuacion} onChange={setPuntuacion} />
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Contanos tu experiencia con este proveedor..."
              rows={3}
              style={{
                width: "100%", marginTop: "12px", padding: "10px 12px",
                borderRadius: "12px", border: "1px solid #e8e2dc",
                fontSize: "13px", fontFamily: "Inter, sans-serif", resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            {error ? <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "6px" }}>{error}</p> : null}
            <button
              onClick={enviarResena}
              disabled={enviando}
              style={{
                marginTop: "10px", background: "#3b3735", color: "white",
                border: "none", borderRadius: "12px", padding: "10px 20px",
                fontSize: "13px", fontWeight: "500", cursor: enviando ? "default" : "pointer",
                opacity: enviando ? 0.6 : 1,
              }}
            >
              {enviando ? "Enviando..." : "Publicar reseña"}
            </button>
          </div>
        ) : null}

        <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#b07a5e", marginBottom: "10px" }}>
          Reseñas ({resenas.length})
        </p>

        {cargando ? (
          <p style={{ fontSize: "13px", color: "#6c625c" }}>Cargando...</p>
        ) : resenas.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#6c625c" }}>Todavía no hay reseñas para este proveedor.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {resenas.map((r) => (
              <div key={r.idResena} style={{ border: "1px solid #e8e2dc", borderRadius: "16px", padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#3b3735" }}>
                    {r.nombreUsuario}{" "}
                    <span style={{ fontWeight: "400", color: "#918a83", fontSize: "11px" }}>
                      ({r.tipoUsuario?.toLowerCase()})
                    </span>
                  </span>
                  <StarRatingDisplay promedio={r.puntuacion} showValue={false} size={14} />
                </div>
                {r.comentario ? (
                  <p style={{ fontSize: "13px", color: "#6c625c", marginTop: "6px" }}>{r.comentario}</p>
                ) : null}
                <p style={{ fontSize: "11px", color: "#b3aca5", marginTop: "6px" }}>
                  {new Date(r.fecha).toLocaleDateString("es-AR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResenasModal;