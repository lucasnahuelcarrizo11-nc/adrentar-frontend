import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/operaciones`;

const OperacionesService = {
  detalle: ({ idPropietario }) =>
    axios.get(`${API_URL}/detalle`, { params: { idPropietario } }),

  ingresosMensuales: ({ idPropietario, anio }) =>
    axios.get(`${API_URL}/ingresos-mensuales`, { params: { idPropietario, anio } }),
};

export default OperacionesService;