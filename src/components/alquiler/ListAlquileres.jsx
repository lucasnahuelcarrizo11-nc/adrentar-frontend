import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

import AlquilerService from "../../service/AlquilerService";
import DocumentoService from "../../service/DocumentoService";
import PagoService from "../../service/PagoService";

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
      label: actual.toLocaleString("es-AR", {
        month: "long",
        year: "numeric",
      }),
    });
    actual.setMonth(actual.getMonth() + 1);
  }

  return meses;
};

const formatearFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString("es-AR") : "-";

/* ===============================
   Badge Estado
================================ */
const EstadoBadge = ({ estado }) => {
  const estilos = {
    PENDIENTE: "bg-yellow-100 text-yellow-700",
    ACEPTADO: "bg-green-100 text-green-700",
    RECHAZADO: "bg-red-100 text-red-700",
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
   Component
================================ */
const ListAlquileres = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [docs, setDocs] = useState([]);
  const [archivo, setArchivo] = useState(null);

  const [alquilerExpandidoPagos, setAlquilerExpandidoPagos] = useState(null);
  const [alquilerExpandidoDocs, setAlquilerExpandidoDocs] = useState(null);

  const [modalRechazo, setModalRechazo] = useState(null);
  const [animando, setAnimando] = useState(null);

  const rol = (localStorage.getItem("tipo_usuario") || "").toUpperCase();

  useEffect(() => {
    cargarAlquileres();
  }, []);

  const cargarAlquileres = () => {
    AlquilerService.obtenerMisAlquileres()
      .then((res) => setAlquileres(res.data))
      .catch(() => toast.error("Error al obtener alquileres"));
  };

  /* ===============================
     ACEPTAR / RECHAZAR
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

  /* ===============================
     PAGOS
  ================================ */
 const pagarMes = async (idAlquiler, mes) => {
  try {
    console.log("ID:", idAlquiler);
    console.log("MES:", mes.month);
    console.log("AÑO:", mes.year);

    const initPoint = await PagoService.crearPago(
      idAlquiler,
      mes.month,
      mes.year
    );

    console.log("LINK RECIBIDO:", initPoint);

    if (!initPoint || typeof initPoint !== "string") {
      toast.error("No se recibió un link válido");
      return;
    }

    window.location.href = initPoint;

  } catch (error) {
    console.error("ERROR COMPLETO:", error);

    if (error.response?.data) {
      toast.error(error.response.data);
    } else {
      toast.error("Error al iniciar el pago");
    }
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
      const res =
        await DocumentoService.obtenerDocumentosPorAlquiler(idAlquiler);
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

      const res =
        await DocumentoService.obtenerDocumentosPorAlquiler(idAlquiler);
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

      <div className="flex justify-between items-center mb-6">
              <Link
                to="/CrearAlquiler"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                + Agregar Alquiler
              </Link>
            </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Mis Alquileres
      </h2>

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
              const filaRechazada = alq.estado === "RECHAZADO";
              const meses = generarMesesAlquiler(
                alq.fechaInicio,
                alq.fechaFin
              );

              return (
                <React.Fragment key={alq.idAlquiler}>
                  <tr
                    className={`border-t transition ${
                      filaRechazada
                        ? "bg-gray-100 opacity-60"
                        : "hover:bg-gray-50"
                    } ${
                      animando === alq.idAlquiler
                        ? "scale-105 duration-300"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      {alq.direccionPropiedad}
                    </td>
                    <td className="px-6 py-4">
                      {formatearFecha(alq.fechaInicio)}
                    </td>
                    <td className="px-6 py-4">
                      {formatearFecha(alq.fechaFin)}
                    </td>
                    <td className="px-6 py-4">
                      <EstadoBadge estado={alq.estado} />
                    </td>

                   <td className="px-6 py-4 text-center space-x-2">

  {/* PENDIENTE - SOLO INQUILINO PUEDE ACEPTAR / RECHAZAR */}
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

  {/* ACEPTADO - AMBOS PUEDEN VER PAGOS Y DOCS */}
  {alq.estado === "ACEPTADO" && (
    <>
      <button
        onClick={() =>
          setAlquilerExpandidoPagos(
            alquilerExpandidoPagos === alq.idAlquiler
              ? null
              : alq.idAlquiler
          )
        }
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
    </>
  )}

</td>
                  </tr>

                  {/* PAGOS */}
                  {alquilerExpandidoPagos === alq.idAlquiler && (
                    <tr>
                      <td colSpan="5" className="bg-green-50 px-6 py-6">
                        <h4 className="font-semibold mb-4">
                          Meses del alquiler
                        </h4>

                        <div className="grid md:grid-cols-3 gap-3">
                          {meses.map((mes, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center border rounded-lg px-4 py-3 bg-white"
                            >
                              <span className="capitalize">
                                {mes.label}
                              </span>

                              <button
                                onClick={() =>
                                  pagarMes(alq.idAlquiler, mes)
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                              >
                                Pagar
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* DOCUMENTOS */}
                  {alquilerExpandidoDocs === alq.idAlquiler && (
                    <tr>
                      <td colSpan="5" className="bg-indigo-50 px-6 py-6">
                        <h4 className="font-semibold mb-4">
                          Documentos del alquiler
                        </h4>

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
                                  onClick={() =>
                                    eliminarDocumento(d.id)
                                  }
                                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">
                            No hay documentos cargados.
                          </p>
                        )}

                        <div className="mt-4 space-y-3">
                          <input
                            type="file"
                            onChange={(e) =>
                              setArchivo(e.target.files[0])
                            }
                          />

                          <button
                            onClick={() =>
                              subirDocumento(alq.idAlquiler)
                            }
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
              <h3 className="font-semibold text-lg">
                Confirmar rechazo
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              ¿Estás seguro de rechazar este alquiler?
            </p>

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
    </div>
  );
};

export default ListAlquileres;