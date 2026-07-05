import { useState } from "react";
import { enviarContrato, obtenerUrlFirma } from "../service/DocuSignService";

const PDF_TEST =
  "JVBERi0xLjIgCjkgMCBvYmoKPDwKPj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgoxMDAgNzAwIFRkCihIZWxsbyBXb3JsZCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago=";

export default function ModalContrato({ alquiler, propietario, onCerrar }) {
  const [estado, setEstado] = useState("pregunta"); // pregunta | cargando | firmando | error
  const [signingUrl, setSigningUrl] = useState(null);
  const [error, setError] = useState("");

  const handleGenerar = async () => {
    setEstado("cargando");
    try {
      const { envelopeId } = await enviarContrato({
        propietarioEmail: propietario.email,
        propietarioNombre: propietario.nombre,
        inquilinoEmail: alquiler.emailInquilino,
        inquilinoNombre: alquiler.nombreInquilino,
        documentBase64: PDF_TEST, // reemplazar con PDF real cuando lo tengas
        documentName: `Contrato - ${alquiler.direccionPropiedad}`,
      });

      const { signingUrl } = await obtenerUrlFirma({
        envelopeId,
        signerEmail: propietario.email,
        signerName: propietario.nombre,
      });

      setSigningUrl(signingUrl);
      setEstado("firmando");
    } catch (e) {
      setError(e.message);
      setEstado("error");
    }
  };

  // Firma embebida: ocupa toda la pantalla
  if (estado === "firmando" && signingUrl) {
    return (
      <div style={styles.overlay}>
        <iframe
          src={signingUrl}
          title="Firma de contrato"
          style={styles.iframe}
        />
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
              El alquiler fue creado exitosamente. ¿Querés generar y firmar el
              contrato ahora?
            </p>
            <p style={styles.subtexto}>
              📋 <strong>{alquiler.direccionPropiedad}</strong>
              <br />
              👤 Inquilino: <strong>{alquiler.nombreInquilino}</strong>
              <br />
              📅 {alquiler.fechaInicio} → {alquiler.fechaFin}
            </p>
            <div style={styles.botones}>
              <button style={styles.btnSecundario} onClick={onCerrar}>
                Ahora no
              </button>
              <button style={styles.btnPrimario} onClick={handleGenerar}>
                Sí, generar contrato
              </button>
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
            <button style={styles.btnSecundario} onClick={onCerrar}>
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    borderRadius: 16,
    padding: "36px 32px",
    maxWidth: 460,
    width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  titulo: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1a202c",
    marginBottom: 12,
  },
  texto: {
    color: "#4a5568",
    fontSize: 15,
    marginBottom: 16,
    lineHeight: 1.6,
  },
  subtexto: {
    background: "#f7fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "14px 16px",
    fontSize: 14,
    color: "#2d3748",
    lineHeight: 1.8,
    marginBottom: 24,
  },
  botones: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
  },
  btnPrimario: {
    background: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  btnSecundario: {
    background: "#edf2f7",
    color: "#4a5568",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  centro: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: "20px 0",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #c0392b",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};