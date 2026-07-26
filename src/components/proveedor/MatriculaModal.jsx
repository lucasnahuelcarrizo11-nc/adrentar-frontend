import React from "react";

const MatriculaModal = ({ url, nombreProveedor, onClose }) => {
  if (!url) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(59,55,53,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "2rem", fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: "1.5rem",
          width: "100%", maxWidth: "800px", height: "85vh",
          display: "flex", flexDirection: "column",
          overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.25rem 1.5rem", borderBottom: "1px solid #e8e2dc",
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#b07a5e" }}>
              Matrícula profesional
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: "600", color: "#3b3735" }}>
              {nombreProveedor}
            </p>
          </div>
          <button
            onClick={onClose}
            title="Cerrar"
            style={{
              width: "36px", height: "36px", borderRadius: "10px", border: "none",
              background: "#f6f2ee", color: "#6c625c", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#f6f2ee"; e.currentTarget.style.color = "#6c625c"; }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Visor PDF */}
        <div style={{ flex: 1, background: "#f6f2ee" }}>
          <iframe
            src={url}
            title="Matrícula profesional"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MatriculaModal;