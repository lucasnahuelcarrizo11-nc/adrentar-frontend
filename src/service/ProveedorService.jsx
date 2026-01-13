import axios from "../api/axiosConfig";


const CLIENTE_BASE_REST_API_URL = `/api/proveedores`;

class ProveedorService {
  listarProveedores() {
    return axios.get(`${CLIENTE_BASE_REST_API_URL}/listarProveedores`);
  }

  crearProveedor(proveedor) {
    return axios.post(`${CLIENTE_BASE_REST_API_URL}/crear`, proveedor, {
      headers: { "Content-Type": "application/json" },
    });
  }

  getProveedorById(proveedorId) {
    return axios.get(`${CLIENTE_BASE_REST_API_URL}/buscar/id/${proveedorId}`);
  }

  actualizarProveedor(proveedorId, proveedor) {
    return axios.put(
      `${CLIENTE_BASE_REST_API_URL}/actualizar/${proveedorId}`,
      proveedor,
      { headers: { "Content-Type": "application/json" } }
    );
  }

  eliminarProveedor(proveedorId) {
    return axios.delete(`${CLIENTE_BASE_REST_API_URL}/${proveedorId}`);
  }

}

export default new ProveedorService();
