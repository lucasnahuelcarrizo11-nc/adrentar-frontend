import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const API_URL = `${BASE_URL}/api/auditorias`;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const AuditoriaService = {
  obtenerOCrear: (idAlquiler, tipo) =>
    axios.post(`${API_URL}/alquiler/${idAlquiler}?tipo=${tipo}`, null, authHeader()),

  obtener: (idAlquiler, tipo) =>
    axios.get(`${API_URL}/alquiler/${idAlquiler}?tipo=${tipo}`, authHeader())
      .catch((err) => {
        if (err.response?.status === 404) return { data: null };
        throw err;
      }),

  subirImagenes: (idAuditoria, archivos) => {
    const formData = new FormData();
    archivos.forEach((a) => formData.append("archivos", a));
    return axios.post(`${API_URL}/${idAuditoria}/imagenes`, formData, {
      headers: {
        ...authHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  eliminarImagen: (idImagen) =>
    axios.delete(`${API_URL}/imagenes/${idImagen}`, authHeader()),
};

export default AuditoriaService;