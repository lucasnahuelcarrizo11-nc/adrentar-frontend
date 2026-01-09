import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const CLIENTE_BASE_REST_API_URL = `${BASE_URL}/api/alquileres`;

class AlquilerService {
  crearAlquiler = async (data) => {
    const token = localStorage.getItem("token");

    return axios.post(`${CLIENTE_BASE_REST_API_URL}/crear`, data, {
      headers: {
        Authorization: token
      }
    });
  };

  obtenerMisAlquileres() {
    const token = localStorage.getItem("token");

    return axios.get(`${CLIENTE_BASE_REST_API_URL}/mis-alquileres`, {
      headers: {
        Authorization: token
      }
    });
  }

  aceptarAlquiler(idAlquiler) {
    const token = localStorage.getItem("token");

    return axios.put(`${CLIENTE_BASE_REST_API_URL}/${idAlquiler}/aceptar`, null, {
      headers: {
        Authorization: token
      }
    });
  }

  rechazarAlquiler(idAlquiler) {
    const token = localStorage.getItem("token");

    return axios.put(`${CLIENTE_BASE_REST_API_URL}/${idAlquiler}/rechazar`, null, {
      headers: {
        Authorization: token
      }
    });
  }
}

export default new AlquilerService();
