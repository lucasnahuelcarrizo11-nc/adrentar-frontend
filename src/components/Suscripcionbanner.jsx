    import { useSuscripcion } from "../hooks/useSuscripcion";

// Colores de ejemplo siguiendo tu paleta cálida/terracota — ajustá los hex
// exactos si en tu sistema de diseño están definidos en otro lado.
const styles = {
  bannerTrial: {
    background: "#FDF3E7",
    border: "1px solid #E8C9A0",
    borderRadius: 16,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },
  bannerVencida: {
    background: "#FBE9E5",
    border: "1px solid #E8A692",
    borderRadius: 16,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },
  texto: {
    margin: 0,
    color: "#3A2E28",
    fontSize: 14,
  },
  boton: {
    background: "#C1694F",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};

export default function SuscripcionBanner() {
  const { estado, loading, suscribirse } = useSuscripcion();

  if (loading || !estado) return null;
  if (estado.estado === "ACTIVA") return null;

  const handleSuscribirse = async () => {
    try {
      await suscribirse();
    } catch (err) {
      alert(err.message);
    }
  };

  if (estado.estado === "TRIAL" && estado.accesoActivo) {
    return (
      <div style={styles.bannerTrial}>
        <p style={styles.texto}>
          Te quedan <strong>{estado.diasRestantesTrial}</strong> día
          {estado.diasRestantesTrial === 1 ? "" : "s"} de prueba gratuita.
        </p>
        <button style={styles.boton} onClick={handleSuscribirse}>
          Suscribirme ahora
        </button>
      </div>
    );
  }

  return (
    <div style={styles.bannerVencida}>
      <p style={styles.texto}>
        Tu período de prueba terminó. Suscribite para seguir usando Adrentar sin interrupciones.
      </p>
      <button style={styles.boton} onClick={handleSuscribirse}>
        Suscribirme — $5.000/mes
      </button>
    </div>
  );
}