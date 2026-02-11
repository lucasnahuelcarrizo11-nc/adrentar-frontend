import axios from "../api/axiosConfig";

const BASE_URL = import.meta.env.VITE_API_URL;
const CLIENTE_BASE_REST_API_URL = `${BASE_URL}/api/alquileres`;

class AlquilerService {
  crearAlquiler(data) {
    const token = localStorage.getItem("token");

    return axios.post(`${CLIENTE_BASE_REST_API_URL}/crear`, data, {
      headers: {
        Authorization: token
      }
    });
  }

  obtenerMisAlquileres() {
    const token = localStorage.getItem("token");

    return axios.get(`${CLIENTE_BASE_REST_API_URL}/mis-alquileres`, {
      headers: {
        Authorization: token
      }
    });
  }

  aceptarAlquiler(id) {
    const token = localStorage.getItem("token");

    return axios.put(
      `${CLIENTE_BASE_REST_API_URL}/${id}/aceptar`,
      null,
      {
        headers: {
          Authorization: token
        }
      }
    );
  }

  rechazarAlquiler(id) {
    const token = localStorage.getItem("token");

    return axios.put(
      `${CLIENTE_BASE_REST_API_URL}/${id}/rechazar`,
      null,
      {
        headers: {
          Authorization: token
        }
      }
    );
  }
}

export default new AlquilerService();
