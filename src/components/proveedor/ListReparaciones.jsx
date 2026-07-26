import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReparacionService from "../../service/ReparacionService";
import { getUsuarioActual } from "../../service/AuthService";

const obtenerIdProveedor = (usuario) => {
  return usuario?.idUsuario ?? usuario?.idProveedor ?? usuario?.id ?? null;
};

const ListReparaciones = () => {
  const usuario = getUsuarioActual();
  const idProveedor = obtenerIdProveedor(usuario);

  const [reparaciones, setReparaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [imagenAmpliada, setImagenAmpliada] = useState(null);

  useEffect(() => {
    if (!idProveedor) {
      setCargando(false);
      return;
    }

    ReparacionService.listarPorProveedor(idProveedor)
      .then((res) => setReparaciones(res.data))
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar las reparaciones.");
      })
      .finally(() => setCargando(false));
  }, [idProveedor]);

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: "2rem",
      background: "#f6f2ee", fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Cabecera */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "2.5rem",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "300", color: "#3b3735", margin: 0 }}>
              Mis <span style={{ fontWeight: "600", color: "#b07a5e" }}>Reparaciones</span>
            </h1>
            <p style={{ fontSize: "14px", color: "#6c625c", marginTop: "4px" }}>
              Historial de trabajos registrados.
            </p>
          </div>

          <Link
            to="/crearReparacion"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#3b3735", color: "white",
              padding: "12px 24px", borderRadius: "16px",
              fontSize: "14px", fontWeight: "500", textDecoration: "none",
              boxShadow: "0 10px 30px -8px rgba(59,55,53,0.25)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2725")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3b3735")}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva reparación
          </Link>
        </div>

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
            Cargando reparaciones...
          </p>
        ) : reparaciones.length === 0 ? (
          <div style={{
            background: "white", borderRadius: "2.5rem",
            border: "1px solid #e8e2dc", padding: "3rem",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "20px",
              background: "#f6f2ee", border: "1px solid #e8e2dc",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "28px",
            }}>
              🛠️
            </div>
            <p style={{ fontSize: "14px", fontWeight: "500", color: "#3b3735", margin: 0 }}>
              Todavía no registraste ninguna reparación
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {reparaciones.map((r) => (
              <div
                key={r.idReparacion}
                style={{
                  background: "white", borderRadius: "2rem",
                  border: "1px solid #e8e2dc", padding: "1.75rem 2rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#3b3735", margin: 0 }}>
                    {r.titulo?.trim() ? r.titulo : "Reparación sin título"}
                  </h3>
                  <span style={{ fontSize: "12px", color: "#9c9490" }}>
                    {r.fecha ? new Date(r.fecha).toLocaleDateString("es-AR") : ""}
                  </span>
                </div>

                <p style={{ fontSize: "13px", color: "#6c625c", marginTop: "8px" }}>
                  {r.descripcion}
                </p>

                {r.imagenes?.length > 0 && (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
                    {r.imagenes.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setImagenAmpliada(`${import.meta.env.VITE_API_URL}${url}`)}
                        style={{
                          width: "84px", height: "84px", borderRadius: "12px",
                          overflow: "hidden", border: "1px solid #eee4e4",
                          padding: 0, cursor: "pointer", background: "none",
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}${url}`}
                          alt={`Reparación ${i + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visor de imagen ampliada, sin salir de la página */}
      {imagenAmpliada && (
        <div
          onClick={() => setImagenAmpliada(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(59,55,53,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "2rem", cursor: "pointer",
          }}
        >
          <img
            src={imagenAmpliada}
            alt="Reparación ampliada"
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "1rem" }}
          />
        </div>
      )}
    </div>
  );
};

export default ListReparaciones;