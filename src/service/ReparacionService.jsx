import axios from "../api/axiosConfig";

const API_URL = "/api/reparaciones";

class ReparacionService {

  listarPorProveedor(idProveedor) {
    return axios.get(`${API_URL}/proveedor/${idProveedor}`);
  }

  crearReparacion({
    idProveedor,
    idPropiedad,
    titulo,
    descripcion,
    monto,
    imagenes,
  }) {
    const formData = new FormData();

    formData.append("idProveedor", idProveedor);
    formData.append("idPropiedad", idPropiedad);
    formData.append("descripcion", descripcion);

    if (titulo) {
      formData.append("titulo", titulo);
    }

    if (monto !== undefined && monto !== null) {
      formData.append("monto", monto);
    }

    (imagenes ?? []).forEach((img) => {
      formData.append("imagenes", img);
    });

    return axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  resumenGastos({ idPropietario, anio, mes }) {
    const params = { idPropietario };

    if (anio !== null && anio !== undefined) {
      params.anio = anio;
    }

    if (mes !== null && mes !== undefined) {
      params.mes = mes;
    }

    return axios.get(`${API_URL}/gastos/resumen`, {
      params,
    });
  }
}

export default new ReparacionService();