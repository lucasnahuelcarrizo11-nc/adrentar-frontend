import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/resenas`;

const ResenaService = {
  listarPorProveedor: (idProveedor) => axios.get(`${API_URL}/proveedor/${idProveedor}`),
  crearResena: (resena) => axios.post(`${API_URL}/crear`, resena),
  eliminarResena: (idResena) => axios.delete(`${API_URL}/${idResena}`),
};

export default ResenaService;