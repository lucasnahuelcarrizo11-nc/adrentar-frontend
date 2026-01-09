import api from "../api/axiosConfig";

const BASE_URL = "/api/alquileres";

class NotificacionService {

  listarNotificaciones(idInquilino) {
    return api.get(`${BASE_URL}/notificaciones/${idInquilino}`);
  }

  marcarComoLeida(idNotificacion) {
    return api.put(`${BASE_URL}/notificaciones/${idNotificacion}/leer`);
  }
}

export default new NotificacionService();
