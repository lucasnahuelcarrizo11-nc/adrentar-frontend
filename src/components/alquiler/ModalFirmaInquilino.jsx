import { useState, useEffect } from "react";
import { obtenerEnvelopeIdAlquiler } from "../../service/DocuSignService";

export default function ModalFirmaInquilino({ alquiler, inquilino, onConfirmar, onCerrar }) {
  const [estado, setEstado] = useState("verificando");
  const [error, setError] = useState("");

  useEffect(() => {
    verificarContrato();
  }, []);

  const verificarContrato = async () => {
    try {
      const data = await obtenerEnvelopeIdAlquiler(alquiler.idAlquiler);
      if (data?.envelopeId) {
        setEstado("pregunta");
      } else {
        setEstado("sin-contrato");
      }
    } catch {
      setEstado("sin-contrato");
    }
  };

  const handleFirmar = () => {
    onConfirmar();
    setEstado("email-enviado");
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {estado === "verificando" && (
          <div style={styles.centro}>
            <div style={styles.spinner} />
            <p style={{ color: "#4a5568" }}>Verificando contrato...</p>
          </div>
        )}

        {estado === "pregunta" && (
          <>
            <h2 style={styles.titulo}>📋 Contrato pendiente de firma</h2>
            <p style={styles.texto}>
              El propietario ya firmó el contrato de este alquiler. Al aceptar, te enviaremos un email para que puedas firmarlo.
            </p>
            <div style={styles.subtexto}>
              🏠 <strong>{alquiler.direccionPropiedad}</strong><br />
              📅 {alquiler.fechaInicio} → {alquiler.fechaFin}
            </div>
            <div style={styles.botones}>
              <button style={styles.btnSecundario} onClick={() => { onConfirmar(); onCerrar(); }}>
                Solo aceptar
              </button>
              <button style={styles.btnPrimario} onClick={handleFirmar}>
                Aceptar y firmar
              </button>
            </div>
          </>
        )}

        {estado === "email-enviado" && (
          <>
            <h2 style={styles.titulo}>📧 Revisá tu email</h2>
            <p style={styles.texto}>
              Aceptaste el alquiler correctamente. Te enviamos un email a <strong>{inquilino.email}</strong> con el link para firmar el contrato.
            </p>
            <div style={styles.botones}>
              <button style={styles.btnPrimario} onClick={onCerrar}>Entendido</button>
            </div>
          </>
        )}

        {estado === "sin-contrato" && (
          <>
            <h2 style={styles.titulo}>Aceptar alquiler</h2>
            <p style={styles.texto}>
              ¿Confirmás que querés aceptar este alquiler? El propietario aún no generó el contrato digital.
            </p>
            <div style={styles.botones}>
              <button style={styles.btnSecundario} onClick={onCerrar}>Cancelar</button>
              <button style={{ ...styles.btnPrimario, background: "#16a34a" }} onClick={() => { onConfirmar(); onCerrar(); }}>
                Aceptar alquiler
              </button>
            </div>
          </>
        )}

        {estado === "error" && (
          <>
            <h2 style={{ ...styles.titulo, color: "#e53e3e" }}>Error</h2>
            <p style={{ color: "#4a5568", marginBottom: 20 }}>{error}</p>
            <button style={styles.btnSecundario} onClick={onCerrar}>Cerrar</button>
          </>
        )}

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", borderRadius: 16, padding: "36px 32px", maxWidth: 460, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  titulo: { fontSize: 20, fontWeight: 700, color: "#1a202c", marginBottom: 12 },
  texto: { color: "#4a5568", fontSize: 14, lineHeight: 1.6, marginBottom: 16 },
  subtexto: { background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "#2d3748", lineHeight: 1.8, marginBottom: 24 },
  botones: { display: "flex", gap: 12, justifyContent: "flex-end" },
  btnPrimario: { background: "#b07a5e", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnSecundario: { background: "#edf2f7", color: "#4a5568", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  centro: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 0" },
  spinner: { width: 40, height: 40, border: "4px solid #e2e8f0", borderTop: "4px solid #b07a5e", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
};