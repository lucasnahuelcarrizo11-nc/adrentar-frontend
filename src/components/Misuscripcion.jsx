import { useSuscripcion } from "../service/Usesuscripcion";

const styles = {
  page: {
    maxWidth: 560,
    margin: "40px auto",
    padding: "0 20px",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #EFE6DC",
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  },
  titulo: {
    margin: "0 0 8px",
    color: "#3A2E28",
    fontSize: 22,
    fontWeight: 700,
  },
  subtitulo: {
    margin: "0 0 24px",
    color: "#8A7A6D",
    fontSize: 14,
  },
  fila: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #F2ECE4",
    fontSize: 14,
    color: "#3A2E28",
  },
  boton: {
    marginTop: 24,
    width: "100%",
    background: "#C1694F",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "14px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  botonCancelar: {
    marginTop: 12,
    width: "100%",
    background: "transparent",
    color: "#B84A3E",
    border: "1px solid #E8A692",
    borderRadius: 12,
    padding: "12px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};

const badgeStyle = (color, bg) => ({
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  color,
  background: bg,
  marginBottom: 20,
});

const ESTADO_LABELS = {
  TRIAL: { label: "Período de prueba", color: "#8A5A00", bg: "#FDF3E7" },
  ACTIVA: { label: "Suscripción activa", color: "#2F6B3F", bg: "#E7F4EA" },
  VENCIDA: { label: "Vencida", color: "#B84A3E", bg: "#FBE9E5" },
  CANCELADA: { label: "Cancelada", color: "#6B6259", bg: "#F2ECE4" },
  PENDIENTE_AUTORIZACION: { label: "Pendiente de autorización", color: "#8A5A00", bg: "#FDF3E7" },
};

export default function MiSuscripcion() {
  const { estado, loading, error, suscribirse, cancelar } = useSuscripcion();

  const handleSuscribirse = async () => {
    try {
      await suscribirse();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelar = async () => {
    if (!window.confirm("¿Seguro que querés cancelar tu suscripción?")) return;
    try {
      await cancelar();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={styles.page}>Cargando...</div>;
  if (error) return <div style={styles.page}>Error: {error}</div>;
  if (!estado) return null;

  const badge = ESTADO_LABELS[estado.estado] || ESTADO_LABELS.VENCIDA;

  return (
   <>
        <h2 style={styles.titulo}>Mi suscripción</h2>
        <p style={styles.subtitulo}>Adrentar — $5.000/mes</p>

        <span style={badgeStyle(badge.color, badge.bg)}>{badge.label}</span>

        {estado.estado === "TRIAL" && (
          <div style={styles.fila}>
            <span>Días restantes de prueba</span>
            <strong>{estado.diasRestantesTrial}</strong>
          </div>
        )}

        {estado.fechaFinTrial && (
          <div style={styles.fila}>
            <span>Fin del período de prueba</span>
            <strong>{estado.fechaFinTrial}</strong>
          </div>
        )}

        {estado.fechaProximoPago && (
          <div style={styles.fila}>
            <span>Próximo pago</span>
            <strong>{estado.fechaProximoPago}</strong>
          </div>
        )}

        {estado.estado !== "ACTIVA" && (
          <button style={styles.boton} onClick={handleSuscribirse}>
            {estado.estado === "PENDIENTE_AUTORIZACION" ? "Completar suscripción" : "Suscribirme"}
          </button>
        )}

        {estado.estado === "ACTIVA" && (
          <button style={styles.botonCancelar} onClick={handleCancelar}>
            Cancelar suscripción
          </button>
        )}
     </>
  );
}