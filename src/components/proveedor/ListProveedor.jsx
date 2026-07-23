import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProveedorService from "../../service/ProveedorService";
import { useAuth } from "../../context/AuthContext";
import { StarRatingDisplay } from "./StartRating";
import ResenasModal from "../ResenasModal";

/* ── Icon Box ────────────────────────────────────────────── */
const IconBox = ({ bg = "#f3ece6", color = "#b07a5e", children }) => (
  <div style={{
    width: "32px", height: "32px", borderRadius: "10px",
    background: bg, color, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    {children}
  </div>
);

/* ── SVG Icons ───────────────────────────────────────────── */
const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconWrench = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconPin = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.828a2 2 0 01-2.827 0l-4.244-4.171a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconEdit = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const IconTrash = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

/* ── Toggle Switch ───────────────────────────────────────── */
const ToggleSwitch = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: "44px", height: "24px", borderRadius: "999px",
      background: checked ? "#16a34a" : "#d1d5db",
      position: "relative", cursor: "pointer", transition: "background 0.2s",
    }}
  >
    <div style={{
      position: "absolute", top: "2px",
      left: checked ? "22px" : "2px",
      width: "20px", height: "20px", borderRadius: "50%",
      background: "white", transition: "left 0.2s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    }} />
  </div>
);

/* ── Hover Button ────────────────────────────────────────── */
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

/* ── Fila Proveedor ──────────────────────────────────────── */
const FilaProveedor = ({ p, esAdmin, onToggle, onEliminar, onVerResenas }) => {
  const [hovered, setHovered] = useState(false);

  const celdasAdmin = esAdmin ? (
    <>
      <td style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ToggleSwitch checked={p.activo} onChange={() => onToggle(p)} />
        </div>
      </td>
      <td style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
          <Link
            to={`/editarProveedor/${p.idProveedor}`}
            title="Editar"
            style={{
              padding: "9px", borderRadius: "12px",
              background: "transparent", color: "#6c625c",
              display: "inline-flex", alignItems: "center",
              textDecoration: "none", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f6f2ee";
              e.currentTarget.style.color = "#b07a5e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6c625c";
            }}
          >
            <IconEdit />
          </Link>
          <HoverBtn
            onClick={() => onEliminar(p.idProveedor)}
            title="Eliminar"
            style={{
              padding: "9px", borderRadius: "12px", border: "none",
              background: "transparent", color: "#f87171",
              cursor: "pointer", display: "inline-flex", alignItems: "center",
              transition: "all 0.2s", fontFamily: "Inter, sans-serif",
            }}
            hoverStyle={{ background: "#fef2f2" }}
          >
            <IconTrash />
          </HoverBtn>
        </div>
      </td>
    </>
  ) : null;

  return (
    <tr
      style={{
        borderBottom: "1px solid #e8e2dc",
        background: hovered ? "#fcfaf9" : "white",
        transition: "background 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Nombre */}
      <td style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconBox><IconUser /></IconBox>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#3b3735" }}>
            {p.nombre}
          </span>
        </div>
      </td>

      {/* Especialidad */}
      <td style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconBox bg="#f0fdf4" color="#16a34a"><IconWrench /></IconBox>
          <span style={{ fontSize: "14px", color: "#3b3735" }}>{p.especialidad}</span>
        </div>
      </td>

      {/* Zona */}
      <td style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconBox bg="#eff6ff" color="#2563eb"><IconPin /></IconBox>
          <span style={{ fontSize: "14px", color: "#6c625c" }}>{p.zona}</span>
        </div>
      </td>

      {/* Teléfono */}
      <td style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconBox bg="#f6f2ee" color="#3b3735"><IconPhone /></IconBox>
          <span style={{ fontSize: "14px", fontWeight: "500", color: "#3b3735" }}>{p.telefono}</span>
        </div>
      </td>

      {/* Email */}
      <td style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconBox>
            <IconMail />
          </IconBox>

          <a
            href={`mailto:${p.email}`}
            style={{
              fontSize: "14px",
              color: "#b07a5e",
              textDecoration: "underline",
            }}
          >
            {p.email}
          </a>
        </div>
      </td>

      {/* Puntuación */}
      <td style={{ padding: "20px 24px" }}>
        <button
          onClick={() => onVerResenas(p)}
          style={{
            border: "none", background: "transparent", cursor: "pointer",
            padding: 0, fontFamily: "inherit",
          }}
          title="Ver reseñas"
        >
          <StarRatingDisplay promedio={p.promedioPuntuacion} cantidad={p.cantidadResenas} />
        </button>
      </td>

      {celdasAdmin}
    </tr>
  );
};

/* ════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════════════ */
const ListProveedor = () => {
  const { usuario } = useAuth();
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  const esAdmin = usuario?.tipo_usuario?.toUpperCase() === "ADMIN";

  const listarProveedores = () => {
    ProveedorService.listarProveedores()
      .then((response) => {
        setProveedores(
          esAdmin ? response.data : response.data.filter((p) => p.activo)
        );
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => { listarProveedores(); }, []);

  const toggleActivo = (proveedor) => {
    if (!esAdmin) return;
    ProveedorService.actualizarProveedor(proveedor.idProveedor, {
      ...proveedor,
      activo: !proveedor.activo,
    })
      .then(() => listarProveedores())
      .catch((error) => console.error(error));
  };

  const eliminarProveedor = (idProveedor) => {
    if (!esAdmin) return;
    if (window.confirm("¿Eliminar proveedor?")) {
      ProveedorService.eliminarProveedor(idProveedor)
        .then(() => listarProveedores())
        .catch((error) => console.error(error));
    }
  };

  const colSpanTotal = esAdmin ? 8 : 6;
  const headers = [
    "Nombre", "Especialidad", "Zona", "Teléfono", "Email", "Puntuación",
    ...(esAdmin ? ["Activo", "Acciones"] : []),
  ];

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: "2rem",
      background: "#f6f2ee", fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Cabecera */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "2.5rem",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "300", color: "#3b3735", margin: 0 }}>
              Nuestros <span style={{ fontWeight: "600", color: "#b07a5e" }}>Proveedores</span>
            </h1>
            <p style={{ fontSize: "14px", color: "#6c625c", marginTop: "4px" }}>
              Directorio de contacto profesional para tus propiedades.
            </p>
          </div>

          {esAdmin ? (
            <Link
              to="/crearProveedor"
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
              Agregar proveedor
            </Link>
          ) : null}
        </div>

        {/* Tabla */}
        <div style={{
          background: "white", borderRadius: "2.5rem",
          border: "1px solid #e8e2dc", overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>

              <thead>
                <tr style={{ background: "#fcfaf9", borderBottom: "1px solid #e8e2dc" }}>
                  {headers.map((h) => (
                    <th key={h} style={{
                      padding: "20px 24px", fontSize: "10px", fontWeight: "700",
                      textTransform: "uppercase", letterSpacing: "0.12em", color: "#b07a5e",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {proveedores.length === 0 ? (
                  <tr>
                    <td colSpan={colSpanTotal} style={{ padding: "48px", textAlign: "center" }}>
                      <div style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "12px",
                      }}>
                        <div style={{
                          width: "64px", height: "64px", borderRadius: "20px",
                          background: "#f6f2ee", border: "1px solid #e8e2dc",
                          display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "28px",
                        }}>
                          👷
                        </div>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#3b3735", margin: 0 }}>
                          No hay proveedores registrados
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  proveedores.map((p) => (
                    <FilaProveedor
                      key={p.idProveedor}
                      p={p}
                      esAdmin={esAdmin}
                      onToggle={toggleActivo}
                      onEliminar={eliminarProveedor}
                      onVerResenas={setProveedorSeleccionado}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {proveedores.length > 0 ? (
            <div style={{
              padding: "16px 24px", borderTop: "1px solid #e8e2dc",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <p style={{
                fontSize: "11px", fontWeight: "500", color: "#6c625c",
                margin: 0, textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                Mostrando{" "}
                <span style={{ color: "#3b3735", fontWeight: "700" }}>
                  {proveedores.length} proveedor{proveedores.length !== 1 ? "es" : ""}
                </span>{" "}
                verificado{proveedores.length !== 1 ? "s" : ""}
              </p>
            </div>
          ) : null}
        </div>

      </div>

      {proveedorSeleccionado ? (
        <ResenasModal
          proveedor={proveedorSeleccionado}
          onClose={() => setProveedorSeleccionado(null)}
          onResenaCreada={listarProveedores}
        />
      ) : null}
    </div>
  );
};

export default ListProveedor;