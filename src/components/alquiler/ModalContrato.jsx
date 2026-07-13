import { useState } from "react";
import { enviarContrato, obtenerUrlFirma } from "../../service/DocuSignService";

const PDF_TEST =
  "JVBERi0xLjQKJeLjz9MKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDQgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA2IDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA3IDAgUgo+Pgo+Pgo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDIwMAo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjUwIDcwMCBUZAooQ09OVFJBVE8gREUgQUxRVUlMRVIpIFRqCjAgLTMwIFRkCihQcm9waWVkYWQ6IFVzcGFsbGF0YSAxMjMpIFRqCjAgLTMwIFRkCihJbnF1aWxpbm86IG51ZXZvIGlucXVpbGlubykgVGoKMCAtMzAgVGQKKFByb3BpZXRhcmlvOiBudWV2byBwcm9waWV0YXJpbykgVGoKMCAtMTAwIFRkCigvZmlybWEtcHJvcGlldGFyaW8vKSBUagowIC0xMDAgVGQKKC9maXJtYS1pbnF1aWxpbm8vKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjcgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNSAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoxIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyA0IDAgUgo+PgplbmRvYmoKeHJlZgowIDgKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwNDU4IDAwMDAwIG4gCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwNDAxIDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDE1MCAwMDAwMCBuIAowMDAwMDAwMzU0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgOAovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNTA3CiUlRU9GCg==";

export default function ModalContrato({ alquiler, propietario, onCerrar }) {
  const [estado, setEstado] = useState("pregunta");
  const [signingUrl, setSigningUrl] = useState(null);
  const [error, setError] = useState("");

  const handleGenerar = async () => {
    setEstado("cargando");
    try {
      const { envelopeId } = await enviarContrato({
        idAlquiler: alquiler.idAlquiler,
        propietarioEmail: propietario.email,
        propietarioNombre: propietario.nombre,
        inquilinoEmail: alquiler.emailInquilino,
        inquilinoNombre: alquiler.nombreInquilino,
        documentBase64: PDF_TEST,
        documentName: `Contrato - ${alquiler.direccionPropiedad}`.substring(0, 70),
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