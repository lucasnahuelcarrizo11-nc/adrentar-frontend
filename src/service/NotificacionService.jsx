import axios from "axios";

const API_URL = "http://localhost:8080/api/alquileres";

class NotificacionService {
  // 📬 Obtener todas las notificaciones de un inquilino
  listarNotificaciones(idInquilino) {
    return axios.get(`${API_URL}/notificaciones/${idInquilino}`);
  }

  // ✅ Marcar notificación como leída
  marcarComoLeida(idNotificacion) {
    return axios.put(`${API_URL}/notificaciones/${idNotificacion}/leer`);
  }
}

export default new NotificacionService();
