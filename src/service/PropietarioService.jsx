import axios from "axios";

const CLIENTE_BASE_REST_API_URL = "http://localhost:8080/api/propietarios";

class PropietarioService {
  listarPropietarios() {
    return axios.get(`${CLIENTE_BASE_REST_API_URL}/listarPropietarios`);
  }

  crearPropietario(propietario) {
    return axios.post(`${CLIENTE_BASE_REST_API_URL}/registrar`, propietario, {
      headers: { "Content-Type": "application/json" },
    });
  }

  getPropietarioById(propietarioId) {
    return axios.get(`${CLIENTE_BASE_REST_API_URL}/buscar/id/${propietarioId}`);
  }

  actualizarPropietario(propietarioId, propietario) {
    return axios.put(
      `${CLIENTE_BASE_REST_API_URL}/actualizar/${propietarioId}`,
      propietario,
      { headers: { "Content-Type": "application/json" } }
    );
  }

  eliminarPropietario(propietarioId) {
    return axios.delete(`${CLIENTE_BASE_REST_API_URL}/${propietarioId}`);
  }

}

export default new PropietarioService();
