import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import NotificacionService from "../service/NotificacionService";

const NotificacionesBell = ({ idInquilino }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);

  const cargarNotificaciones = async () => {
    try {
      const res = await NotificacionService.listarNotificaciones(idInquilino);
      setNotificaciones(res.data);
    } catch (error) {
      console.error("Error cargando notificaciones", error);
    }
  };

  useEffect(() => {
    if (idInquilino) cargarNotificaciones();
  }, [idInquilino]);

  const notificacionesNuevas = notificaciones.filter((n) => !n.leida).length;

  // 🟢 Marcar una notificación como leída
  const handleMarcarLeida = async (id) => {
    try {
      await NotificacionService.marcarComoLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, leida: true } : n
        )
      );
    } catch (error) {
      console.error("Error al marcar como leída", error);
    }
  };

  return (
    <div className="relative">
      {/* Botón de campanita */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-700 transition"
      >
        <Bell className="w-6 h-6" />
        {notificacionesNuevas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
            {notificacionesNuevas}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
          <div className="p-3 border-b border-gray-700 font-semibold text-sm text-gray-200">
            Notificaciones
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <p className="p-3 text-gray-400 text-sm">No hay notificaciones.</p>
            ) : (
              notificaciones.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarcarLeida(n.id)}
                  className={`p-3 text-sm border-b border-gray-700 cursor-pointer hover:bg-gray-800 ${
                    n.leida ? "text-gray-400" : "text-white font-medium"
                  }`}
                >
                  {n.mensaje}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificacionesBell;
