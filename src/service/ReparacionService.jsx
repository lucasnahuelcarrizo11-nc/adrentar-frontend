import axios from "../api/axiosConfig";

const API_URL = "/api/reparaciones";

class ReparacionService {
  listarPorProveedor(idProveedor) {
    return axios.get(`${API_URL}/proveedor/${idProveedor}`);
  }

  crearReparacion({ idProveedor, titulo, descripcion, imagenes }) {
    const formData = new FormData();
    formData.append("idProveedor", idProveedor);
    formData.append("descripcion", descripcion);
    if (titulo) formData.append("titulo", titulo);
    (imagenes ?? []).forEach((img) => formData.append("imagenes", img));

    return axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export default new ReparacionService();