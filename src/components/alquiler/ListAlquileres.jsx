import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  FlagIcon,
} from "@heroicons/react/24/solid";

import AlquilerService from "../../service/AlquilerService";
import DocumentoService from "../../service/DocumentoService";
import PagoService from "../../service/PagoService";
import ReporteService from "../../service/ReporteService";

/* ===============================
   Utils
================================ */
const generarMesesAlquiler = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const meses = [];
  let actual = new Date(inicio);
  while (actual <= fin) {
    meses.push({
      year: actual.getFullYear(),
      month: actual.getMonth() + 1,
      label: actual.toLocaleString("es-AR", { month: "long", year: "numeric" }),
    });
    actual.setMonth(actual.getMonth() + 1);
  }
  return meses;
};

const formatearFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString("es-AR") : "-";

const formatearFechaHora = (fecha) =>
  fecha
    ? new Date(fecha).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

/* ===============================
   Badge Estado Alquiler
================================ */
const EstadoBadge = ({ estado }) => {
  const estilos = {
    PENDIENTE: "bg-yellow-100 text-yellow-700",
    ACEPTADO: "bg-green-100 text-green-700",
    RECHAZADO: "bg-red-100 text-red-700",
    CANCELADO: "bg-gray-200 text-gray-600",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        estilos[estado] || "bg-gray-100 text-gray-600"
      }`}
    >
      {estado}
    </span>
  );
};

/* ===============================
   Badge Estado Reporte
================================ */
const ReporteBadge = ({ estado }) => {
  const estilos = {
    PENDIENTE: "bg-red-100 text-red-700",
    EN_REVISION: "bg-yellow-100 text-yellow-700",
    RESUELTO: "bg-green-100 text-green-700",
  };
  const labels = {
    PENDIENTE: "Pendiente",
    EN_REVISION: "En revisión",
    RESUELTO: "Resuelto",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        estilos[estado] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[estado] || estado}
    </span>
  );
};

/* ===============================
   Component
================================ */
const ListAlquileres = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [docs, setDocs] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [pagos, setPagos] = useState({});
  const [reportes, setReportes] = useState({});
  const [idAlquilerPendiente, setIdAlquilerPendiente] = useState(null);

  const [nuevoReporte, setNuevoReporte] = useState({ titulo: "", descripcion: "" });
  const [enviandoReporte, setEnviandoReporte] = useState(false);

  const [modalCancelacion, setModalCancelacion] = useState(null);
  const [alquilerExpandidoPagos, setAlquilerExpandidoPagos] = useState(null);
  const [alquilerExpandidoDocs, setAlquilerExpandidoDocs] = useState(null);
  const [alquilerExpandidoReportes, setAlquilerExpandidoReportes] = useState(null);
  const [modalRechazo, setModalRechazo] = useState(null);
  const [animando, setAnimando] = useState(null);

  const rol = (localStorage.getItem("tipo_usuario") || "").toUpperCase();

  useEffect(() => {
    cargarAlquileres();
  }, []);

  // Detectar regreso desde MercadoPago
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const paymentId = params.get("payment_id");
    const externalReference = params.get("external_reference");

    if (status && paymentId) {
      window.history.replaceState({}, "", window.location.pathname);

      if (status === "approved") {
        toast.success("¡Pago aprobado! Actualizando...");
      } else if (status === "rejected") {
        toast.error("El pago fue rechazado");
      } else {
        toast.info("El pago está pendiente de confirmación");
      }

      if (externalReference) {
        const idAlquiler = Number(externalReference.split("-")[0]);
        setIdAlquilerPendiente(idAlquiler);
      }

      cargarAlquileres();
    }
  }, []);

  // Cuando alquileres cargan y hay idAlquilerPendiente
  useEffect(() => {
    if (idAlquilerPendiente && alquileres.length > 0) {
      setAlquilerExpandidoPagos(idAlquilerPendiente);
      cargarPagos(idAlquilerPendiente);
      setIdAlquilerPendiente(null);
    }
  }, [alquileres, idAlquilerPendiente]);

  const cargarAlquileres = () => {
    AlquilerService.obtenerMisAlquileres()
      .then((res) => setAlquileres(res.data))
      .catch(() => toast.error("Error al obtener alquileres"));
  };

  /* ===============================
     ACEPTAR / RECHAZAR / CANCELAR
  ================================ */
  const aceptarAlquiler = async (id) => {
    try {
      setAnimando(id);
      await AlquilerService.aceptarAlquiler(id);
      toast.success("Alquiler aceptado correctamente");
      cargarAlquileres();
      setTimeout(() => setAnimando(null), 600);
    } catch {
      toast.error("Error al aceptar alquiler");
    }
  };

  const confirmarRechazo = async () => {
    try {
      await AlquilerService.rechazarAlquiler(modalRechazo);
      toast.success("Alquiler rechazado");
      setModalRechazo(null);
      cargarAlquileres();
    } catch {
      toast.error("Error al rechazar alquiler");
    }
  };

  const confirmarCancelacion = async () => {
    try {
      await AlquilerService.cancelarAlquiler(modalCancelacion);
      toast.success("Alquiler cancelado correctamente");
      setModalCancelacion(null);
      cargarAlquileres();
    } catch (error) {
      console.log("❌ Error:", error);
      toast.error("Error al cancelar alquiler");
    }
  };

  /* ===============================
     PAGOS
  ================================ */
  const cargarPagos = async (idAlquiler) => {
    try {
      const res = await PagoService.obtenerPagosPorAlquiler(idAlquiler);
      setPagos((prev) => ({ ...prev, [idAlquiler]: res.data }));
    } catch {
      toast.error("Error al cargar pagos");
    }
  };

  const togglePagos = async (idAlquiler) => {
    if (alquilerExpandidoPagos === idAlquiler) {
      setAlquilerExpandidoPagos(null);
      return;
    }
    setAlquilerExpandidoPagos(idAlquiler);
    await cargarPagos(idAlquiler);
  };

  const pagarMes = async (idAlquiler, mes) => {
    try {
      const initPoint = await PagoService.crearPago(idAlquiler, mes.month, mes.year);
      if (!initPoint || typeof initPoint !== "string") {
        toast.error("No se recibió un link válido");
        return;
      }
      window.location.href = initPoint;
    } catch (error) {
      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Error al iniciar el pago");
      }
    }
  };

  /* ===============================
     REPORTES
  ================================ */
  const cargarReportes = async (idAlquiler) => {
    try {
      const res = await ReporteService.obtenerPorAlquiler(idAlquiler);
      setReportes((prev) => ({ ...prev, [idAlquiler]: res.data }));
    } catch {
      toast.error("Error al cargar reportes");
    }
  };

  const toggleReportes = async (idAlquiler) => {
    if (alquilerExpandidoReportes === idAlquiler) {
      setAlquilerExpandidoReportes(null);
      setNuevoReporte({ titulo: "", descripcion: "" });
      return;
    }
    setAlquilerExpandidoReportes(idAlquiler);
    await cargarReportes(idAlquiler);
  };

  const enviarReporte = async (idAlquiler) => {
    if (!nuevoReporte.titulo.trim() || !nuevoReporte.descripcion.trim()) {
      toast.warning("Completá el título y la descripción");
      return;
    }

    setEnviandoReporte(true);
    try {
      await ReporteService.crearReporte({
        idAlquiler,
        titulo: nuevoReporte.titulo,
        descripcion: nuevoReporte.descripcion,
      });
      toast.success("Reporte enviado correctamente");
      setNuevoReporte({ titulo: "", descripcion: "" });
      await cargarReportes(idAlquiler);
    } catch (error) {
      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Error al enviar el reporte");
      }
    } finally {
      setEnviandoReporte(false);
    }
  };

  const cambiarEstadoReporte = async (idReporte, estado, idAlquiler) => {
    try {
      await ReporteService.cambiarEstado(idReporte, estado);
      toast.success("Estado actualizado");
      await cargarReportes(idAlquiler);
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  /* ===============================
     DOCUMENTOS
  ================================ */
  const toggleDocs = async (idAlquiler) => {
    if (alquilerExpandidoDocs === idAlquiler) {
      setAlquilerExpandidoDocs(null);
      return;
    }
    try {
      setAlquilerExpandidoDocs(idAlquiler);
      const res = await DocumentoService.obtenerDocumentosPorAlquiler(idAlquiler);
      setDocs(res.data);
    } catch {
      toast.error("Error al cargar documentos");
    }
  };

  const subirDocumento = async (idAlquiler) => {
    if (!archivo) return;
    try {
      await DocumentoService.subirDocumento(idAlquiler, archivo);
      setArchivo(null);
      const res = await DocumentoService.obtenerDocumentosPorAlquiler(idAlquiler);
      setDocs(res.data);
      toast.success("Documento subido correctamente");
    } catch {
      toast.error("Error al subir documento");
    }
  };

  const eliminarDocumento = async (id) => {
    if (!window.confirm("¿Eliminar documento?")) return;
    try {
      await DocumentoService.eliminarDocumento(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
      toast.success("Documento eliminado");
    } catch {
      toast.error("Error al eliminar documento");
    }
  };

  const verDocumento = async (doc) => {
    try {
      const res = await DocumentoService.descargarDocumento(doc.id);
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: res.headers["content-type"] })
      );
      window.open(url);
    } catch {
      toast.error("Error al abrir documento");
    }
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 relative">

      {/* Overlay loader reporte */}
      {enviandoReporte && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-700 font-semibold text-base">Enviando reporte...</p>
          </div>
        </div>
      )}

      {rol === "PROPIETARIO" && (
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/CrearAlquiler"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Agregar Alquiler
          </Link>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mis Alquileres</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Propiedad</th>
              <th className="px-6 py-3">Inicio</th>
              <th className="px-6 py-3">Fin</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {alquileres.map((alq) => {
              const filaRechazada =
                alq.estado === "RECHAZADO" || alq.estado === "CANCELADO";
              const meses = generarMesesAlquiler(alq.fechaInicio, alq.fechaFin);

              return (
                <React.Fragment key={alq.idAlquiler}>
                  <tr
                    className={`border-t transition ${
                      filaRechazada ? "bg-gray-100 opacity-60" : "hover:bg-gray-50"
                    } ${animando === alq.idAlquiler ? "scale-105 duration-300" : ""}`}
                  >
                    <td className="px-6 py-4">{alq.direccionPropiedad}</td>
                    <td className="px-6 py-4">{formatearFecha(alq.fechaInicio)}</td>
                    <td className="px-6 py-4">{formatearFecha(alq.fechaFin)}</td>
                    <td className="px-6 py-4">
                      <EstadoBadge estado={alq.estado} />
                    </td>

                    <td className="px-6 py-4 text-center space-x-2">

                      {/* PENDIENTE - solo inquilino */}
                      {alq.estado === "PENDIENTE" && rol === "INQUILINO" && (
                        <>
                          <button
                            onClick={() => aceptarAlquiler(alq.idAlquiler)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                          >
                            <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                            Aceptar
                          </button>
                          <button
                            onClick={() => setModalRechazo(alq.idAlquiler)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                          >
                            <XCircleIcon className="w-4 h-4 inline mr-1" />
                            Rechazar
                          </button>
                        </>
                      )}

                      {/* ACEPTADO */}
                      {alq.estado === "ACEPTADO" && (
                        <>
                          <button
                            onClick={() => togglePagos(alq.idAlquiler)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                          >
                            <CreditCardIcon className="w-4 h-4 inline mr-1" />
                            Pagos
                          </button>

                          <button
                            onClick={() => toggleDocs(alq.idAlquiler)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition"
                          >
                            <DocumentIcon className="w-4 h-4 inline mr-1" />
                            Docs
                          </button>

                          {/* Reportes — inquilino crea, propietario gestiona */}
                          <button
                            onClick={() => toggleReportes(alq.idAlquiler)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                          >
                            <FlagIcon className="w-4 h-4 inline mr-1" />
                            Reportes
                          </button>
                        </>
                      )}

                      {/* CANCELAR */}
                      {(alq.estado === "PENDIENTE" || alq.estado === "ACEPTADO") && (
                        <button
                          onClick={() => setModalCancelacion(alq.idAlquiler)}
                          className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition"
                        >
                          <XCircleIcon className="w-4 h-4 inline mr-1" />
                          Cancelar
                        </button>
                      )}

                    </td>
                  </tr>

                  {/* PAGOS */}
                  {alquilerExpandidoPagos === alq.idAlquiler && (
                    <tr>
                      <td colSpan="5" className="bg-green-50 px-6 py-6">
                        <h4 className="font-semibold mb-4">Meses del alquiler</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          {meses.map((mes, i) => {
                            const pagosAlquiler = pagos[alq.idAlquiler] || [];
                            const pago = pagosAlquiler.find(
                              (p) => p.mes === mes.month && p.anio === mes.year
                            );
                            const estado = pago?.estado;
                            return (
                              <div
                                key={i}
                                className="flex justify-between items-center border rounded-lg px-4 py-3 bg-white"
                              >
                                <span className="capitalize">{mes.label}</span>
                                {estado === "APROBADO" ? (
                                  <span className="text-green-600 font-semibold text-sm">✔ Pagado</span>
                                ) : estado === "PENDIENTE" ? (
                                  <span className="text-yellow-600 font-semibold text-sm">⏳ Pendiente</span>
                                ) : estado === "RECHAZADO" ? (
                                  <button
                                    onClick={() => pagarMes(alq.idAlquiler, mes)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                                  >
                                    Reintentar
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => pagarMes(alq.idAlquiler, mes)}
                                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                                  >
                                    Pagar
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* REPORTES */}
                  {alquilerExpandidoReportes === alq.idAlquiler && (
                    <tr>
                      <td colSpan="5" className="bg-red-50 px-6 py-6">
                        <h4 className="font-semibold mb-4 text-red-700">
                          <FlagIcon className="w-4 h-4 inline mr-1" />
                          Reportes de la propiedad
                        </h4>

                        {/* Formulario — solo inquilino */}
                        {rol === "INQUILINO" && (
                          <div className="bg-white border border-red-200 rounded-xl p-4 mb-5">
                            <h5 className="font-medium text-gray-700 mb-3">
                              Reportar un problema
                            </h5>

                            <input
                              type="text"
                              placeholder="Título del problema (ej: Calefacción rota)"
                              value={nuevoReporte.titulo}
                              onChange={(e) =>
                                setNuevoReporte({ ...nuevoReporte, titulo: e.target.value })
                              }
                              className="w-full p-2 border rounded-md mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                            />

                            <textarea
                              placeholder="Descripción detallada del problema..."
                              value={nuevoReporte.descripcion}
                              onChange={(e) =>
                                setNuevoReporte({ ...nuevoReporte, descripcion: e.target.value })
                              }
                              className="w-full p-2 border rounded-md mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                              rows={3}
                            />

                            <button
                              onClick={() => enviarReporte(alq.idAlquiler)}
                              disabled={enviandoReporte}
                              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                            >
                              Enviar reporte
                            </button>
                          </div>
                        )}

                        {/* Lista de reportes */}
                        <div className="space-y-3">
                          {(reportes[alq.idAlquiler] || []).length === 0 ? (
                            <p className="text-gray-500 text-sm">
                              No hay reportes para este alquiler.
                            </p>
                          ) : (
                            (reportes[alq.idAlquiler] || []).map((r) => (
                              <div
                                key={r.idReporte}
                                className="bg-white border rounded-xl p-4 shadow-sm"
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-semibold text-gray-800">
                                    {r.titulo}
                                  </span>
                                  <ReporteBadge estado={r.estado} />
                                </div>

                                <p className="text-sm text-gray-600 mb-2">
                                  {r.descripcion}
                                </p>

                                <p className="text-xs text-gray-400 mb-3">
                                  Reportado el {formatearFechaHora(r.fechaCreacion)}
                                </p>

                                {/* Cambiar estado — solo propietario */}
                                {rol === "PROPIETARIO" && r.estado !== "RESUELTO" && (
                                  <div className="flex gap-2">
                                    {r.estado === "PENDIENTE" && (
                                      <button
                                        onClick={() =>
                                          cambiarEstadoReporte(
                                            r.idReporte,
                                            "EN_REVISION",
                                            alq.idAlquiler
                                          )
                                        }
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs"
                                      >
                                        Tomar en revisión
                                      </button>
                                    )}
                                    <button
                                      onClick={() =>
                                        cambiarEstadoReporte(
                                          r.idReporte,
                                          "RESUELTO",
                                          alq.idAlquiler
                                        )
                                      }
                                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs"
                                    >
                                      Marcar como resuelto
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* DOCUMENTOS */}
                  {alquilerExpandidoDocs === alq.idAlquiler && (
                    <tr>
                      <td colSpan="5" className="bg-indigo-50 px-6 py-6">
                        <h4 className="font-semibold mb-4">Documentos del alquiler</h4>
                        {docs.length > 0 ? (
                          docs.map((d) => (
                            <div
                              key={d.id}
                              className="flex justify-between items-center border rounded-lg px-4 py-3 mb-2 bg-white"
                            >
                              <span>{d.nombreArchivo}</span>
                              <div className="space-x-2">
                                <button
                                  onClick={() => verDocumento(d)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                  Ver
                                </button>
                                <button
                                  onClick={() => eliminarDocumento(d.id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No hay documentos cargados.</p>
                        )}
                        <div className="mt-4 space-y-3">
                          <input
                            type="file"
                            onChange={(e) => setArchivo(e.target.files[0])}
                          />
                          <button
                            onClick={() => subirDocumento(alq.idAlquiler)}
                            disabled={!archivo}
                            className="bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
                          >
                            Subir Documento
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL RECHAZO */}
      {modalRechazo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6" />
              <h3 className="font-semibold text-lg">Confirmar rechazo</h3>
            </div>
            <p className="text-gray-600 mb-6">¿Estás seguro de rechazar este alquiler?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalRechazo(null)}
                className="px-4 py-2 rounded-md border"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRechazo}
                className="px-4 py-2 rounded-md bg-red-600 text-white"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CANCELACIÓN */}
      {modalCancelacion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <div className="flex items-center gap-2 text-orange-500 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6" />
              <h3 className="font-semibold text-lg">Confirmar cancelación</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de cancelar este alquiler? Esta acción notificará a la otra parte.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalCancelacion(null)}
                className="px-4 py-2 rounded-md border"
              >
                Volver
              </button>
              <button
                onClick={confirmarCancelacion}
                className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
              >
                Cancelar alquiler
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ListAlquileres;