import api from "../api/axiosConfig";

const BASE_URL = import.meta.env.VITE_API_URL;

const CLIENTE_BASE_REST_API_URL = `${BASE_URL}/api/pagos`;

const crearPago = async (idAlquiler, mes, anio) => {
  const response = await axios.post(
    `${CLIENTE_BASE_REST_API_URL}/preference`,
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
