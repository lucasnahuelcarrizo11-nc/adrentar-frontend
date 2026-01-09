import axios from "axios";

const CLIENTE_BASE_REST_API_URL = "http://localhost:8080/api/propiedad";

class PropiedadService {

  // 🔹 Listar solo las propiedades del propietario logueado
  listarMisPropiedades() {
    const token = localStorage.getItem("token");
    return axios.get(`${CLIENTE_BASE_REST_API_URL}/mis-propiedades`, {
      headers: { Authorization: token },
    });
  }

  // 🔹 Crear propiedad (requiere token)
  crearPropiedad(propiedad) {
    const token = localStorage.getItem("token");
    return axios.post(`${CLIENTE_BASE_REST_API_URL}/crear`, propiedad, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
  }

  // 🔹 Eliminar propiedad (requiere token)
  eliminarPropiedad(idPropiedad) {
    const token = localStorage.getItem("token");
    return axios.delete(`${CLIENTE_BASE_REST_API_URL}/${idPropiedad}`, {
      headers: { Authorization: token },
    });
  }

  // 🔹 Actualizar propiedad (requiere token)
  actualizarPropiedad(propiedadId, propiedad) {
    const token = localStorage.getItem("token");
    return axios.put(`${CLIENTE_BASE_REST_API_URL}/${propiedadId}`, propiedad, {
      headers: { 
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
  }

  // 🔹 Obtener por ID (puede ser público, pero enviamos token por consistencia)
  getPropiedadById(propiedadId) {
    const token = localStorage.getItem("token");
    return axios.get(`${CLIENTE_BASE_REST_API_URL}/${propiedadId}`, {
      headers: { Authorization: token },
    });
  }
}

export default new PropiedadService();
