import { useState } from "react";
import { enviarContrato, obtenerUrlFirma } from "../../service/DocuSignService";

export default function ModalContrato({ alquiler, onCerrar }) {
  const [estado, setEstado] = useState("pregunta");
  const [signingUrl, setSigningUrl] = useState(null);
  const [error, setError] = useState("");

  const handleGenerar = async () => {
    setEstado("cargando");
    try {
      // El backend genera el PDF del contrato con los datos reales del alquiler.
      const { envelopeId } = await enviarContrato({
        idAlquiler: alquiler.idAlquiler,
      });

      // El backend recalcula el email/nombre del propietario desde la misma
      // entidad Alquiler, así garantizamos que coincidan exactamente con el
      // recipient que se usó al crear el envelope.
      const { signingUrl } = await obtenerUrlFirma({
        idAlquiler: alquiler.idAlquiler,
        returnUrl: window.location.href,
      });

      setSigningUrl(signingUrl);
      setEstado("firmando");
    } catch (e) {
      setError(e.message);
      setEstado("error");
    }
  };

  if (estado === "firmando" && signingUrl) {
    return (
      <div style={styles.overlay}>
        <iframe src={signingUrl} title="Firma de contrato" style={styles.iframe} />
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {estado === "pregunta" && (
          <>
            <h2 style={styles.titulo}>¿Generar contrato?</h2>
            <p style={styles.texto}>
              El alquiler fue creado exitosamente. ¿Querés generar y firmar el contrato ahora?
            </p>
            <p style={styles.subtexto}>
              📋 <strong>{alquiler.direccionPropiedad}</strong><br />
              👤 Inquilino: <strong>{alquiler.nombreInquilino}</strong><br />
              📅 {alquiler.fechaInicio} → {alquiler.fechaFin}
            </p>
            <div style={styles.botones}>
              <button style={styles.btnSecundario} onClick={onCerrar}>Ahora no</button>
              <button style={styles.btnPrimario} onClick={handleGenerar}>Sí, generar contrato</button>
            </div>
          </>
        )}

        {estado === "cargando" && (
          <div style={styles.centro}>
            <div style={styles.spinner} />
            <p style={styles.texto}>Preparando el contrato...</p>
          </div>
        )}

        {estado === "error" && (
          <>
            <h2 style={styles.titulo}>Error</h2>
            <p style={{ color: "#e53e3e", marginBottom: 20 }}>{error}</p>
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
  iframe: { width: "100%", height: "100%", border: "none" },
  titulo: { fontSize: 22, fontWeight: 700, color: "#1a202c", marginBottom: 12 },
  texto: { color: "#4a5568", fontSize: 15, marginBottom: 16, lineHeight: 1.6 },
  subtexto: { background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "#2d3748", lineHeight: 1.8, marginBottom: 24 },
  botones: { display: "flex", gap: 12, justifyContent: "flex-end" },
  btnPrimario: { background: "#b07a5e", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnSecundario: { background: "#edf2f7", color: "#4a5568", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  centro: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 0" },
  spinner: { width: 40, height: 40, border: "4px solid #e2e8f0", borderTop: "4px solid #b07a5e", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
};
