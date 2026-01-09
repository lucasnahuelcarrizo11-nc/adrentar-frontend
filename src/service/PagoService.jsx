import axios from "axios";

const API_URL = "http://localhost:8080/api/pagos";

const crearPago = async (idAlquiler, mes, anio) => {
  const response = await axios.post(
    `${API_URL}/preference`,
    null,
    {
      params: {
        idAlquiler,
        mes,
        anio
      }
    }
  );

  return response.data;
};

export default {
  crearPago
};
