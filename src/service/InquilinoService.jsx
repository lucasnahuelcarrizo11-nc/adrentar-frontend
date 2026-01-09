import axios from "axios";

const CLIENTE_BASE_REST_API_URL = "http://localhost:8080/api/inquilinos";

class InquilinoService{

    listarInquilinos(){
        return axios.get(CLIENTE_BASE_REST_API_URL);
    }

    createInquilino(inquilino){
      return axios.post(CLIENTE_BASE_REST_API_URL, inquilino, {
      headers: { "Content-Type": "application/json" },
    });
    }

     eliminarInquilino(inquilinoId) {
    return axios.delete(`${CLIENTE_BASE_REST_API_URL}/${inquilinoId}`);
  }

    getInquilinoById(inquilinoId) {
        return axios.get(`${CLIENTE_BASE_REST_API_URL}/buscar/id/${inquilinoId}`);
}

getInquilinoByEmail(inquilinoEmail) {
    const emailEncoded = encodeURIComponent(inquilinoEmail);
    return axios.get(`${CLIENTE_BASE_REST_API_URL}/buscar/email/${emailEncoded}`);
}


actualizarInquilino(inquilinoId, inquilino) {
  return axios.put(`${CLIENTE_BASE_REST_API_URL}/actualizar/${inquilinoId}`, inquilino, {
    headers: { "Content-Type": "application/json" },
  });
}
}

export default new InquilinoService();