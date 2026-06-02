import api from "../api/axiosConfig";

const BASE_URL = "/api/notificaciones";

class NotificacionService {

  listarPorInquilino(idInquilino) {
    return api.get(`${BASE_URL}/inquilino/${idInquilino}`);
  }

  listarPorPropietario(idPropietario) {
    return api.get(`${BASE_URL}/propietario/${idPropietario}`);
  }

  marcarComoLeida(idNotificacion) {
    return api.patch(`${BASE_URL}/${idNotificacion}/leer`);
  }

  marcarTodasLeidas(ids) {
    return Promise.all(ids.map(id => api.patch(`${BASE_URL}/${id}/leer`)));
  }
}

export default new NotificacionService();