import { useEffect, useState, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import NotificacionService from "../service/NotificacionService";

// rol: "inquilino" | "propietario"
const NotificacionesBell = ({ idUsuario, rol }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen]                     = useState(false);
  const [cargando, setCargando]             = useState(false);
  const panelRef                            = useRef(null);

  /* ── Carga notificaciones según el rol ── */
  const cargar = useCallback(async () => {
    if (!idUsuario) return;
    setCargando(true);
    try {
      const res = rol === "propietario"
        ? await NotificacionService.listarPorPropietario(idUsuario)
        : await NotificacionService.listarPorInquilino(idUsuario);
      setNotificaciones(res.data);
    } catch (err) {
      console.error("Error cargando notificaciones", err);
    } finally {
      setCargando(false);
    }
  }, [idUsuario, rol]);

  /* ── Carga inicial + polling cada 30s ── */
  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 30_000);
    return () => clearInterval(intervalo);
  }, [cargar]);

  /* ── Cierra el panel al hacer click afuera ── */
  useEffect(() => {
    const handleClickAfuera = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickAfuera);
    return () => document.removeEventListener("mousedown", handleClickAfuera);
  }, [open]);

  /* ── Marcar una como leída ── */
  const marcarLeida = async (id) => {
    try {
      await NotificacionService.marcarComoLeida(id);
      setNotificaciones(prev =>
        prev.map(n => n.id === id ? { ...n, leida: true } : n)
      );
    } catch (err) {
      console.error("Error al marcar como leída", err);
    }
  };

  /* ── Marcar todas como leídas ── */
  const marcarTodasLeidas = async () => {
    const noLeidas = notificaciones.filter(n => !n.leida);
    if (noLeidas.length === 0) return;
    try {
      await NotificacionService.marcarTodasLeidas(noLeidas.map(n => n.id));
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    } catch (err) {
      console.error("Error al marcar todas como leídas", err);
    }
  };

  const cantidadNoLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="relative" ref={panelRef}>

      {/* ── Campanita ── */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-700 transition"
        aria-label="Notificaciones"
      >
        <Bell className={`w-6 h-6 ${cantidadNoLeidas > 0 ? "text-white" : "text-gray-400"}`} />
        {cantidadNoLeidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold">
            {cantidadNoLeidas > 99 ? "99+" : cantidadNoLeidas}
          </span>
        )}
      </button>

      {/* ── Panel ── */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <span className="font-semibold text-sm text-white">Notificaciones</span>
            <div className="flex items-center gap-3">
              {cantidadNoLeidas > 0 && (
                <button
                  onClick={marcarTodasLeidas}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Marcar todas como leídas
                </button>
              )}
              <button
                onClick={cargar}
                className="text-gray-400 hover:text-white transition text-xs"
                title="Actualizar"
              >
                {cargando ? "..." : "↻"}
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-700/50">
            {cargando && notificaciones.length === 0 ? (
              <p className="p-4 text-gray-400 text-sm text-center">Cargando...</p>
            ) : notificaciones.length === 0 ? (
              <p className="p-4 text-gray-400 text-sm text-center">No tenés notificaciones.</p>
            ) : (
              notificaciones.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.leida && marcarLeida(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 transition
                    ${n.leida
                      ? "opacity-50 cursor-default"
                      : "cursor-pointer hover:bg-gray-800"
                    }`}
                >
                  {/* Punto indicador */}
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0
                    ${n.leida ? "bg-gray-600" : "bg-blue-400"}`}
                  />
                  <p className={`text-sm leading-snug
                    ${n.leida ? "text-gray-400" : "text-white font-medium"}`}>
                    {n.mensaje}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notificaciones.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-700 text-center">
              <span className="text-xs text-gray-500">
                {cantidadNoLeidas > 0
                  ? `${cantidadNoLeidas} sin leer`
                  : "Todo al día ✓"}
              </span>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default NotificacionesBell;