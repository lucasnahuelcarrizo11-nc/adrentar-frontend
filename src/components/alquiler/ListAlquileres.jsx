import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
   Component
================================ */
const ListAlquileres = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [docs, setDocs] = useState([]);
  const [archivo, setArchivo] = useState(null);

  const [alquilerExpandidoPagos, setAlquilerExpandidoPagos] = useState(null);
  const [alquilerExpandidoDocs, setAlquilerExpandidoDocs] = useState(null);

  const rol = (localStorage.getItem("tipo_usuario") || "").toUpperCase();

  /* ===============================
     Data
  ================================ */
  const cargarAlquileres = () => {
    AlquilerService.obtenerMisAlquileres()
      .then((res) => setAlquileres(res.data))
      .catch(() => toast.error("Error al obtener alquileres"));
  };

  useEffect(() => {
    cargarAlquileres();
  }, []);

  /* ===============================
     Pagos
  ================================ */
  const pagarMes = async (idAlquiler, mes) => {
    try {
      const initPoint = await PagoService.crearPago(
        idAlquiler,
        mes.month,
        mes.year
      );
      window.location.href = initPoint;
    } catch {
      toast.error("Error al iniciar el pago");
    }
  };

  /* ===============================
     Documentos
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
     Render
  ================================ */
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mis Alquileres</h2>

        {(rol === "PROPIETARIO" || rol === "ADMIN") && (
          <Link
            to="/crearAlquiler"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Agregar Alquiler
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Propiedad
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Propietario
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Inquilino
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Inicio
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Fin
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {alquileres.map((alq) => (
              <React.Fragment key={alq.id}>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 border-t">
                    {alq.direccionPropiedad || "-"}
                  </td>
                  <td className="px-6 py-4 border-t">
                    {alq.propietario
                      ? `${alq.propietario.nombre} ${alq.propietario.apellido}`
                      : "-"}
                  </td>
                 <td className="px-6 py-4 border-t">
  {alq.nombreInquilino && alq.apellidoInquilino
    ? `${alq.nombreInquilino} ${alq.apellidoInquilino}`
    : "-"}
</td>

                  <td className="px-6 py-4 border-t">
                    {formatearFecha(alq.fechaInicio)}
                  </td>
                  <td className="px-6 py-4 border-t">
                    {formatearFecha(alq.fechaFin)}
                  </td>
                  <td className="px-6 py-4 border-t">{alq.estado}</td>

                  <td className="px-6 py-4 border-t text-center space-x-2">
                    <button
                      onClick={() =>
                        setAlquilerExpandidoPagos(
                          alquilerExpandidoPagos === alq.id ? null : alq.id
                        )
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                    >
                      Pagos
                    </button>

                    <button
                      onClick={() => toggleDocs(alq.id)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition"
                    >
                      Docs
                    </button>
                  </td>
                </tr>

                {/* PAGOS */}
                {alquilerExpandidoPagos === alq.id && (
                  <tr>
                    <td colSpan="7" className="bg-gray-50 px-6 py-4">
                      <div className="bg-white border rounded-lg p-4 space-y-2">
                        {generarMesesAlquiler(
                          alq.fechaInicio,
                          alq.fechaFin
                        ).map((mes, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center border rounded-md px-3 py-2"
                          >
                            <span className="capitalize">{mes.label}</span>
                            <button
                              onClick={() => pagarMes(alq.id, mes)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
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
                {alquilerExpandidoDocs === alq.id && (
                  <tr>
                    <td colSpan="7" className="bg-gray-50 px-6 py-6">
                      <div className="bg-white rounded-xl shadow-sm border p-5">
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">
                          📁 Documentos del alquiler
                        </h4>

                        {docs.length > 0 ? (
                          <div className="space-y-3">
                            {docs.map((d) => (
                              <div
                                key={d.id}
                                className="flex justify-between items-center border rounded-lg px-4 py-3 hover:bg-gray-50 transition"
                              >
                                <span className="font-medium">
                                  📄 {d.nombreArchivo}
                                </span>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => verDocumento(d)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                                  >
                                    Ver
                                  </button>

                                  <button
                                    onClick={() => eliminarDocumento(d.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            No hay documentos cargados.
                          </p>
                        )}

                        <div className="mt-6 border-t pt-4">
                          <div className="flex gap-3 items-center">
                            <input
                              type="file"
                              onChange={(e) =>
                                setArchivo(e.target.files[0])
                              }
                            />
                            <button
                              onClick={() => subirDocumento(alq.id)}
                              disabled={!archivo}
                              className={`px-4 py-2 rounded-md text-white ${
                                archivo
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-gray-400 cursor-not-allowed"
                              }`}
                            >
                              Subir documento
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {alquileres.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No hay alquileres registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListAlquileres;
