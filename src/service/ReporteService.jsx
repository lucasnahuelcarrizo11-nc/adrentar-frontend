import api from "../api/axiosConfig";

const BASE_URL = import.meta.env.VITE_API_URL;
const BASE = `${BASE_URL}/api/reportes`;

const crearReporte = async (dto) => {
  const response = await api.post(BASE, dto);
  return response;
};

const obtenerPorAlquiler = async (idAlquiler) => {
  const response = await api.get(`${BASE}/alquiler/${idAlquiler}`);
  return response;
};

const cambiarEstado = async (idReporte, estado) => {
  const response = await api.put(`${BASE}/${idReporte}/estado`, null, {
    params: { estado },
  });
  return response;
};

export default {
  crearReporte,
  obtenerPorAlquiler,
  cambiarEstado,
};
