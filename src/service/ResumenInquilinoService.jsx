import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/inquilino`;

const ResumenInquilinoService = {
  obtenerResumen: (idAlquiler, idInquilino) =>
    axios.get(`${API_URL}/mi-alquiler/${idAlquiler}/resumen`, { params: { idInquilino } }),
};

export default ResumenInquilinoService;