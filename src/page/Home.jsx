import React from "react";
import { Link } from "react-router-dom";

/* ── Datos de features ───────────────────────────────────── */
const FEATURES = [
  {
    title: "Contratos Digitales",
    desc: "Firma y almacena documentos con validez legal sin moverte de tu casa.",
    bg: "#f6f2ee",
    icon: (
      <svg width="20" height="20" fill="none" stroke="#b07a5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
  },
  {
    title: "Pagos Notificados",
    desc: "Sincronización de recibos y avisos automáticos de cobro cada mes.",
    bg: "#f3ece6",
    icon: (
      <svg width="20" height="20" fill="none" stroke="#b07a5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    ),
  },
  {
    title: "Mantenimiento",
    desc: "Reporte de incidencias con fotos y contacto directo con proveedores.",
    bg: "#f6f2ee",
    icon: (
      <svg width="20" height="20" fill="none" stroke="#b07a5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      </svg>
    ),
  },
];

const PROPS_LIST = ["Dashboard de ingresos", "Validación de inquilinos", "Gestión multi-propiedad"];
const INQ_LIST   = ["Pagos en un clic", "Historial de recibos", "Chat directo soporte"];

/* ── Hover Button ────────────────────────────────────────── */
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

/* ── Logo SVG ────────────────────────────────────────────── */
const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="12" fill="#b07a5e"/>
    <path d="M20 10L10 18V30H15V22H25V30H30V18L20 10Z" fill="white"/>
    <path d="M20 15L23 20H17L20 15Z" fill="#b07a5e"/>
  </svg>
);

/* ════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════════════ */
const Home = () => {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f6f2ee", color: "#3b3735" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(246,242,238,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e8e2dc",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "0 24px", height: "64px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Logo />
            <span style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-0.02em" }}>
              Adrentar<span style={{ color: "#b07a5e" }}>.</span>
            </span>
          </div>

          {/* Links centro */}
          <div style={{ display: "flex", gap: "32px" }} className="hidden md:flex">
            {["Funciones", "Propietarios", "Inquilinos"].map((l) => (
              <a key={l} href="#funciones" style={{
                fontSize: "13px", fontWeight: "500", color: "#6c625c",
                textDecoration: "none", transition: "color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#b07a5e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6c625c")}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Acciones */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link to="/login" style={{
              fontSize: "13px", fontWeight: "500", color: "#6c625c", textDecoration: "none",
            }}>
              Ingresar
            </Link>
            <Link to="/registro" style={{
              padding: "8px 20px", background: "#b07a5e", color: "white",
              borderRadius: "999px", fontSize: "13px", fontWeight: "500",
              textDecoration: "none", transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(176,122,94,0.25)",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#9c6a50")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#b07a5e")}
            >
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{ paddingTop: "128px", paddingBottom: "80px", textAlign: "center", padding: "128px 24px 80px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span style={{
            display: "inline-block", padding: "4px 14px", borderRadius: "999px",
            background: "rgba(176,122,94,0.1)", color: "#b07a5e",
            fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em",
            textTransform: "uppercase", marginBottom: "24px",
          }}>
            Gestión de Alquileres 2.0
          </span>

          <h1 style={{
            fontSize: "clamp(40px, 7vw, 72px)", fontWeight: "300",
            letterSpacing: "-0.02em", lineHeight: 1.1,
            color: "#3b3735", marginBottom: "24px",
          }}>
            La forma más simple de{" "}
            <br />
            <span style={{ fontWeight: "500", fontStyle: "italic", color: "#b07a5e" }}>
              gestionar tu alquiler
            </span>
          </h1>

          <p style={{
            fontSize: "17px", color: "#6c625c", lineHeight: 1.7,
            maxWidth: "520px", margin: "0 auto 40px",
          }}>
            Unimos a propietarios e inquilinos en una plataforma transparente.
            Sin comisiones ocultas, sin burocracia, todo bajo control.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/registro" style={{
              padding: "16px 40px", background: "#3b3735", color: "#f6f2ee",
              borderRadius: "16px", fontSize: "14px", fontWeight: "500",
              textDecoration: "none", transition: "all 0.2s",
              boxShadow: "0 20px 40px -12px rgba(59,55,53,0.3)",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2725")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3b3735")}
            >
              Registrar mi propiedad
            </Link>
            <a href="#funciones" style={{
              padding: "16px 40px", background: "white",
              border: "1px solid #e8e2dc", color: "#3b3735",
              borderRadius: "16px", fontSize: "14px", fontWeight: "500",
              textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f6f2ee")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              Ver cómo funciona
            </a>
          </div>
        </div>
      </section>

      {/* ── MOCKUP / VIDEO ──────────────────────────────────── */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          {/* Glow */}
          <div style={{
            position: "absolute", inset: "-4px",
            background: "linear-gradient(to right, #b07a5e, #f3ece6)",
            borderRadius: "3rem", filter: "blur(24px)", opacity: 0.2,
            pointerEvents: "none",
          }} />

          <div style={{
            position: "relative", background: "white",
            borderRadius: "2.5rem", padding: "12px",
            boxShadow: "0 40px 80px -20px rgba(59,55,53,0.2)",
            border: "1px solid #e8e2dc", overflow: "hidden",
          }}>
            {/* Browser bar */}
            <div style={{
              background: "#fcfaf9", borderBottom: "1px solid #e8e2dc",
              padding: "14px 24px", display: "flex",
              alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {["#ff605c", "#ffbd2e", "#27c93f"].map((c) => (
                  <div key={c} style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: `${c}33`, border: `1px solid ${c}66`,
                  }} />
                ))}
              </div>
              <span style={{
                fontSize: "9px", fontWeight: "700", color: "#b07a5e",
                textTransform: "uppercase", letterSpacing: "0.3em",
              }}>
                app.adrentar.com
              </span>
              <div style={{ width: "40px" }} />
            </div>

            {/* Video */}
            <div style={{ position: "relative", background: "#f6f2ee", aspectRatio: "16/9", overflow: "hidden" }}>
              <video
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                autoPlay muted loop playsInline
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-tablet-at-home-39879-large.mp4"
                  type="video/mp4"
                />
              </video>
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(59,55,53,0.4), transparent)",
              }} />
              <div style={{
                position: "absolute", bottom: "32px", left: "32px",
                display: "flex", alignItems: "center", gap: "16px",
              }}>
                <div style={{
                  width: "48px", height: "48px",
                  background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
                  borderRadius: "16px", border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                    Product Tour
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: "500", fontStyle: "italic", color: "white", margin: "2px 0 0" }}>
                    Vea Adrentar en acción
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id="funciones" style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", marginBottom: "64px",
            flexWrap: "wrap", gap: "24px",
          }}>
            <div style={{ maxWidth: "480px" }}>
              <p style={{
                fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em",
                color: "#b07a5e", textTransform: "uppercase", marginBottom: "16px",
              }}>
                Eficiencia total
              </p>
              <h2 style={{ fontSize: "28px", fontWeight: "300", color: "#3b3735", margin: 0 }}>
                Diseñado para eliminar las fricciones del{" "}
                <span style={{ fontWeight: "500" }}>alquiler directo</span>.
              </h2>
            </div>
            <p style={{ fontSize: "14px", color: "#6c625c", maxWidth: "280px", lineHeight: 1.7 }}>
              Herramientas profesionales para personas que buscan una gestión humana y transparente.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  background: f.bg, padding: "40px", borderRadius: "2rem",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{
                  width: "40px", height: "40px", background: "white",
                  borderRadius: "12px", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: "500", color: "#3b3735", marginBottom: "12px" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#6c625c", lineHeight: 1.7, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ───────────────────────────────────────────── */}
      <section id="roles" style={{ padding: "80px 24px", background: "#f6f2ee" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>

            {/* Propietario */}
            <div style={{
              background: "white", padding: "40px", borderRadius: "2.5rem",
              border: "1px solid #e8e2dc", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}>
              <p style={{
                fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em",
                textTransform: "uppercase", color: "#b07a5e", marginBottom: "24px",
              }}>
                Panel Propietario
              </p>
              <h3 style={{ fontSize: "24px", fontWeight: "300", color: "#3b3735", marginBottom: "24px", lineHeight: 1.3 }}>
                Tu patrimonio,{" "}
                <br />
                <span style={{ fontWeight: "500", color: "#b07a5e" }}>bajo control.</span>
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {PROPS_LIST.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#6c625c" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#b07a5e", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <HoverBtn
                style={{
                  width: "100%", padding: "16px", borderRadius: "16px",
                  border: "1px solid #b07a5e", background: "transparent",
                  color: "#b07a5e", fontSize: "14px", fontWeight: "500",
                  cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.2s",
                }}
                hoverStyle={{ background: "#b07a5e", color: "white" }}
              >
                Saber más
              </HoverBtn>
            </div>

            {/* Inquilino */}
            <div style={{
              background: "#3b3735", padding: "40px", borderRadius: "2.5rem",
              boxShadow: "0 20px 40px -12px rgba(59,55,53,0.3)",
            }}>
              <p style={{
                fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em",
                textTransform: "uppercase", color: "#b07a5e", marginBottom: "24px",
              }}>
                Panel Inquilino
              </p>
              <h3 style={{ fontSize: "24px", fontWeight: "300", color: "#f6f2ee", marginBottom: "24px", lineHeight: 1.3 }}>
                Tu hogar,{" "}
                <br />
                <span style={{ fontWeight: "500", color: "white" }}>sin complicaciones.</span>
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {INQ_LIST.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(246,242,238,0.7)" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#b07a5e", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/registro"
                style={{
                  display: "block", textAlign: "center",
                  padding: "16px", borderRadius: "16px",
                  background: "#b07a5e", color: "white",
                  fontSize: "14px", fontWeight: "500", textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#9c6a50")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#b07a5e")}
              >
                Registrarme como inquilino
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "300", color: "#3b3735", marginBottom: "20px" }}>
            ¿Empezamos?
          </h2>
          <p style={{ fontSize: "15px", color: "#6c625c", lineHeight: 1.7, marginBottom: "40px" }}>
            Unite a la comunidad de propietarios e inquilinos que ya están
            simplificando sus vidas con Adrentar.
          </p>
          <Link
            to="/registro"
            style={{
              display: "inline-block", padding: "18px 48px",
              background: "#b07a5e", color: "white",
              borderRadius: "16px", fontSize: "15px", fontWeight: "500",
              textDecoration: "none", transition: "all 0.2s",
              boxShadow: "0 20px 40px -8px rgba(176,122,94,0.4)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.background = "#9c6a50"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#b07a5e"; }}
          >
            Crear mi cuenta gratuita
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{
        padding: "40px 24px", borderTop: "1px solid #e8e2dc", background: "white",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Logo size={24} />
            <span style={{ fontSize: "18px", fontWeight: "600", letterSpacing: "-0.02em" }}>
              Adrentar<span style={{ color: "#b07a5e" }}>.</span>
            </span>
          </div>

          <div style={{ display: "flex", gap: "32px" }}>
            {["Términos Legales", "Privacidad", "Instagram"].map((l) => (
              <a key={l} href="#" style={{
                fontSize: "12px", color: "#9c8f8a", textDecoration: "none", transition: "color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3b3735")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9c8f8a")}
              >
                {l}
              </a>
            ))}
          </div>

          <p style={{ fontSize: "12px", color: "#9c8f8a", margin: 0 }}>
            © 2024 Adrentar. Gestión humana de alquileres.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Home;