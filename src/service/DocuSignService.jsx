const API_BASE = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const enviarContrato = async ({
  propietarioEmail,
  propietarioNombre,
  inquilinoEmail,
  inquilinoNombre,
  documentBase64,
  documentName,
}) => {
  const res = await fetch(`${API_BASE}/api/docusign/send-contrato`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      propietarioEmail,
      propietarioNombre,
      inquilinoEmail,
      inquilinoNombre,
      documentBase64,
      documentName,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Error backend send-contrato:", errorBody);
    throw new Error(errorBody);
  }

  return res.json();
};

export const obtenerUrlFirma = async ({ envelopeId, signerEmail, signerName }) => {
  const res = await fetch(`${API_BASE}/api/docusign/embedded-url`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      envelopeId,
      signerEmail,
      signerName,
      returnUrl: `${window.location.origin}/firma-completada`,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Error backend embedded-url:", errorBody);
    throw new Error(errorBody);
  }

  return res.json();
};