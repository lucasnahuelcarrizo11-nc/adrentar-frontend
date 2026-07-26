import React, { useEffect, useState } from "react";
import ResenaService from "../../service/ResenaService";
import { getUsuarioActual } from "../../service/AuthService";
import { StarRatingDisplay } from "./StartRating";

const obtenerIdProveedor = (usuario) => {
  return usuario?.idUsuario ?? usuario?.idProveedor ?? usuario?.id ?? null;
};

const MisResenas = () => {
  const usuario = getUsuarioActual();
  const idProveedor = obtenerIdProveedor(usuario);

  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idProveedor) {
      setCargando(false);
      return;
    }

    ResenaService.listarPorProveedor(idProveedor)
      .then((res) => setResenas(res.data))
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar las reseñas.");
      })
      .finally(() => setCargando(false));
  }, [idProveedor]);

  const promedio =
    resenas.length > 0
      ? resenas.reduce((acc, r) => acc + (r.puntuacion ?? 0), 0) / resenas.length
      : 0;

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: "2rem",
      background: "#f6f2ee", fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* Cabecera */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "300", color: "#3b3735", margin: 0 }}>
            Mis <span style={{ fontWeight: "600", color: "#b07a5e" }}>Reseñas</span>
          </h1>
          <p style={{ fontSize: "14px", color: "#6c625c", marginTop: "4px" }}>
            Lo que los usuarios opinaron sobre tus servicios.
          </p>
        </div>

        {/* Resumen */}
        {!cargando && resenas.length > 0 && (
          <div style={{
            background: "white", borderRadius: "2rem",
            border: "1px solid #e8e2dc", padding: "1.5rem 2rem",
            marginBottom: "1.5rem", display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div>
              <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#b07a5e", margin: 0 }}>
                Promedio general
              </p>
              <div style={{ marginTop: "6px" }}>
                <StarRatingDisplay promedio={promedio} cantidad={resenas.length} />
              </div>
            </div>
          </div>
        )}

        {/* Card principal */}
        <div style={{
          background: "white", borderRadius: "2.5rem",
          border: "1px solid #e8e2dc", padding: "2.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "12px", padding: "12px 16px",
              color: "#dc2626", fontSize: "13px", marginBottom: "20px",
            }}>
              {error}
            </div>
          )}

          {cargando ? (
            <p style={{ fontSize: "14px", color: "#6c625c", textAlign: "center" }}>
              Cargando reseñas...
            </p>
          ) : resenas.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "12px", padding: "2rem 0",
            }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "20px",
                background: "#f6f2ee", border: "1px solid #e8e2dc",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "28px",
              }}>
                ⭐
              </div>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#3b3735", margin: 0 }}>
                Todavía no recibiste reseñas
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {resenas.map((r) => (
                <div
                  key={r.idResena}
                  style={{ border: "1px solid #e8e2dc", borderRadius: "1.25rem", padding: "16px 20px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#3b3735" }}>
                      {r.nombreUsuario}{" "}
                      <span style={{ fontWeight: "400", color: "#918a83", fontSize: "12px" }}>
                        ({r.tipoUsuario?.toLowerCase()})
                      </span>
                    </span>
                    <StarRatingDisplay promedio={r.puntuacion} showValue={false} size={15} />
                  </div>
                  {r.comentario ? (
                    <p style={{ fontSize: "13px", color: "#6c625c", marginTop: "8px" }}>{r.comentario}</p>
                  ) : null}
                  <p style={{ fontSize: "11px", color: "#b3aca5", marginTop: "8px" }}>
                    {new Date(r.fecha).toLocaleDateString("es-AR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisResenas;