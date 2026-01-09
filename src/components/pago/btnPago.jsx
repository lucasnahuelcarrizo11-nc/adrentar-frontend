import { crearPago } from "../services/pagoService";

const BotonPago = ({ idAlquiler, monto }) => {

  const handlePago = async () => {
    try {
      const initPoint = await crearPago(
        "Alquiler de vehículo",
        monto,
        idAlquiler
      );

      // 🔴 Redirigir a Mercado Pago
      window.location.href = initPoint;

    } catch (error) {
      console.error(error);
      alert("Error al iniciar el pago");
    }
  };

  return (
    <button onClick={handlePago}>
      Pagar con Mercado Pago
    </button>
  );
};

export default BotonPago;
