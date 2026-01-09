import axios from "../api/axiosConfig";

const CLIENTE_BASE_REST_API_URL = "/api/inquilinos";

class InquilinoService {

  listarInquilinos() {
    return axios.get(CLIENTE_BASE_REST_API_URL);
  }

  createInquilino(inquilino) {
    return axios.post(CLIENTE_BASE_REST_API_URL, inquilino);
  }

  eliminarInquilino(inquilinoId) {
    return axios.delete(`${CLIENTE_BASE_REST_API_URL}/${inquilinoId}`);
  }

  getInquilinoById(inquilinoId) {
    return axios.get(`/api/inquilinos/buscar/id/${inquilinoId}`);
  }

  getInquilinoByEmail(inquilinoEmail) {
    const emailEncoded = encodeURIComponent(inquilinoEmail);
    return axios.get(`/api/inquilinos/buscar/email/${emailEncoded}`);
  }

  actualizarInquilino(inquilinoId, inquilino) {
    return axios.put(
      `/api/inquilinos/actualizar/${inquilinoId}`,
      inquilino
    );
  }
}

export default new InquilinoService();
