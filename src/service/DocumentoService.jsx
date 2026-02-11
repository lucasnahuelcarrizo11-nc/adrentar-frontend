import axios from "../api/axiosConfig";

const BASE_URL = import.meta.env.VITE_API_URL;
const DOCUMENTO_BASE_REST_API_URL = `${BASE_URL}/api/documentos`;

class DocumentoService {
  subirDocumento = (idAlquiler, archivo) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("archivo", archivo);

    return axios.post(
      `${DOCUMENTO_BASE_REST_API_URL}/subir/${idAlquiler}`,
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data"
        }
      }
    );
  };
  obtenerDocumentosPorAlquiler(idAlquiler) {
    const token = localStorage.getItem("token");

    return axios.get(
      `${DOCUMENTO_BASE_REST_API_URL}/alquiler/${idAlquiler}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  descargarDocumento = (idDocumento) => {
    const token = localStorage.getItem("token");

    return axios.get(
      `${DOCUMENTO_BASE_REST_API_URL}/descargar/${idDocumento}`,
      {
        headers: {
          Authorization: token
        },
        responseType: "blob"
      }
    );
  };

  eliminarDocumento = (id) => {
    const token = localStorage.getItem("token");

    return axios.delete(
      `${DOCUMENTO_BASE_REST_API_URL}/${id}`,
      {
        headers: {
          Authorization: token
        }
      }
    );
  };
}

export default new DocumentoService();
