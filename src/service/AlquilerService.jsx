import axios from "axios";

const API_URL = "http://localhost:8080/api/alquileres";

class AlquilerService {
  crearAlquiler = async (data) => {
    const token = localStorage.getItem("token");

    return axios.post(`${API_URL}/crear`, data, {
      headers: {
        Authorization: token
      }
    });
  };

  obtenerMisAlquileres() {
    const token = localStorage.getItem("token");

    return axios.get(`${API_URL}/mis-alquileres`, {
      headers: {
        Authorization: token
      }
    });
  }

  aceptarAlquiler(idAlquiler) {
    const token = localStorage.getItem("token");

    return axios.put(`${API_URL}/${idAlquiler}/aceptar`, null, {
      headers: {
        Authorization: token
      }
    });
  }

  rechazarAlquiler(idAlquiler) {
    const token = localStorage.getItem("token");

    return axios.put(`${API_URL}/${idAlquiler}/rechazar`, null, {
      headers: {
        Authorization: token
      }
    });
  }
}

export default new AlquilerService();
