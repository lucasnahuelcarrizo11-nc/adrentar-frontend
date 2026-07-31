import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import NotificacionesBell from "./NotificacionesBell";

/* ── Nav items por rol ───────────────────────────────────── */
const NAV_PROPIETARIO = [
  {
    to: "/listPropiedades",
    label: "Propiedades",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },

  {
    to: "/gastosReparaciones",
    label: "Gastos",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-12V5m0 14v-2"
        />
      </svg>
    ),
  },
   {
    to: "/estadisticasAvanzadas",
    label: "Ganancia",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-12V5m0 14v-2"
        />
      </svg>
    ),
  },
];


const NAV_ADMIN = [
  {
    to: "/listInquilino",
    label: "Inquilinos",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    to: "/listPropietarios",
    label: "Propietarios",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const NAV_PROVEEDOR = [
  {
    to: "/reparaciones",
    label: "Reparaciones",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    to: "/misResenas",
    label: "Mis Reseñas",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

const NAV_ALQUILERES = [
  {
    to: "/listAlquileres",
    label: "Alquileres",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
  },
];

const NAV_TODOS = [
  {
    to: "/listProveedor",
    label: "Proveedores",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

/* ── NavLink con estado activo ───────────────────────────── */
const NavItem = ({ to, label, icon }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "10px 12px", borderRadius: "12px",
        textDecoration: "none", transition: "all 0.2s",
        fontSize: "14px", fontWeight: "500",
        background: active ? "#b07a5e" : "transparent",
        color: active ? "white" : "#6c625c",
        boxShadow: active ? "0 8px 20px -4px rgba(176,122,94,0.3)" : "none",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f6f2ee"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

/* ════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════════════ */
const HeaderComponent = () => {
  const { logout, usuario } = useAuth();
  const location = useLocation();
  const tipoUsuario = (localStorage.getItem("tipo_usuario") || "").toUpperCase();

  const iniciales = [usuario?.nombre?.[0], usuario?.apellido?.[0]]
    .filter(Boolean).join("").toUpperCase() || "U";

  const rolLabel = tipoUsuario === "ADMIN"
    ? "Administrador"
    : tipoUsuario === "PROPIETARIO"
    ? "Propietario"
    : "Inquilino"
    
    ;

  const navItems = [
    ...(tipoUsuario === "PROPIETARIO" ? NAV_PROPIETARIO : []),
    ...(tipoUsuario === "PROVEEDOR" ? NAV_PROVEEDOR : []),
    ...(tipoUsuario === "ADMIN" ? NAV_ADMIN : []),
    ...(tipoUsuario !== "PROVEEDOR" ? NAV_ALQUILERES : []),
    ...NAV_TODOS,
  ];

  const perfilActivo = location.pathname === "/perfil";

  return (
    <aside style={{
      width: "256px", flexShrink: 0,
      display: "flex", flexDirection: "column", height: "100%",
      background: "white", borderRight: "1px solid #e8e2dc",
      fontFamily: "Inter, sans-serif",
    }}>

      {/* Logo + usuario */}
      <div style={{ padding: "24px", borderBottom: "1px solid #e8e2dc" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#b07a5e"/>
            <path d="M20 10L10 18V30H15V22H25V30H30V18L20 10Z" fill="white"/>
            <path d="M20 15L23 20H17L20 15Z" fill="#b07a5e"/>
          </svg>
          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.02em", color: "#3b3735" }}>
            Adrentar<span style={{ color: "#b07a5e" }}>.</span>
          </span>
        </div>

        {/* Info usuario */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "12px", background: "#f6f2ee", borderRadius: "12px",
        }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "#b07a5e", color: "white", fontWeight: "700",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", flexShrink: 0,
            border: "2px solid white", boxShadow: "0 2px 6px rgba(176,122,94,0.25)",
          }}>
            {iniciales}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#b07a5e", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              {rolLabel}
            </p>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#3b3735", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {usuario?.nombre} {usuario?.apellido}
            </p>
          </div>
        </div>
      </div>

     
      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Perfil + Cerrar sesión */}
      <div style={{ padding: "16px", borderTop: "1px solid #e8e2dc", display: "flex", flexDirection: "column", gap: "4px" }}>
        <Link
          to="/perfil"
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 12px", borderRadius: "12px",
            textDecoration: "none", transition: "all 0.2s",
            fontSize: "14px", fontWeight: "600",
            background: perfilActivo ? "#b07a5e" : "transparent",
            color: perfilActivo ? "white" : "#3b3735",
            boxShadow: perfilActivo ? "0 8px 20px -4px rgba(176,122,94,0.3)" : "none",
          }}
          onMouseEnter={(e) => { if (!perfilActivo) e.currentTarget.style.background = "#f6f2ee"; }}
          onMouseLeave={(e) => { if (!perfilActivo) e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Perfil
        </Link>

        <button
          onClick={logout}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            width: "100%", padding: "10px 12px", borderRadius: "12px",
            border: "none", background: "transparent",
            color: "#ef4444", fontSize: "14px", fontWeight: "600",
            cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default HeaderComponent;