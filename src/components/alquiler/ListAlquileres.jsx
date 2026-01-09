import React, { useEffect, useState } from "react";
import AlquilerService from "../../service/AlquilerService";
import PagoService from "../../service/PagoService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
      month: actual.getMonth() + 1, // 1-12
      label: actual.toLocaleString("es-AR", {
        month: "long",
        year: "numeric"
      }),
      estado: "PENDIENTE" // luego vendrá del backend
    });

    actual.setMonth(actual.getMonth() + 1);
  }

  return meses;
};

/* ===============================
   Component
================================ */
const ListAlquileres = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alquilerExpandido, setAlquilerExpandido] = useState(null);

  const tipoUsuario = (localStorage.getItem("tipo_usuario") || "").toUpperCase();

  const cargarAlquileres = () => {
    AlquilerService.obtenerMisAlquileres()
      .then((res) => {
        setAlquileres(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error al obtener alquileres");
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarAlquileres();
  }, []);

  /* ===============================
     Acciones
  ================================ */
  const aceptar = (id) => {
    AlquilerService.aceptarAlquiler(id)
      .then(() => {
        toast.success("Alquiler aceptado");
        cargarAlquileres();
      })
      .catch(() => toast.error("Error al aceptar alquiler"));
  };

  const rechazar = (id) => {
    AlquilerService.rechazarAlquiler(id)
      .then(() => {
        toast.success("Alquiler rechazado");
        cargarAlquileres();
      })
      .catch(() => toast.error("Error al rechazar alquiler"));
  };

  const pagarMes = async (idAlquiler, mes) => {
    try {
      const initPoint = await PagoService.crearPago(idAlquiler, mes.month, mes.year);
      window.location.href = initPoint;
    } catch (error) {
      toast.error("Error al iniciar el pago");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Cargando alquileres...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mis Alquileres</h2>

        {tipoUsuario === "PROPIETARIO" && (
          <Link
            to="/crearAlquiler"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Agregar Alquiler
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Propiedad</th>
              {tipoUsuario !== "INQUILINO" && <th className="px-6 py-3 text-left">Inquilino</th>}
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Inicio</th>
              <th className="px-6 py-3 text-left">Fin</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {alquileres.map((alq) => (
              <React.Fragment key={alq.idAlquiler}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-t">
                    {alq.propiedad?.direccion}
                  </td>

                  {tipoUsuario !== "INQUILINO" && (
                    <td className="px-6 py-4 border-t">
                      {alq.inquilino
                        ? `${alq.inquilino.nombre} ${alq.inquilino.apellido}`
                        : "Sin asignar"}
                    </td>
                  )}

                  <td className="px-6 py-4 border-t">
                    <span
                      className={`px-2 py-1 rounded-md text-sm
                        ${alq.estado === "PENDIENTE"
                          ? "bg-yellow-200 text-yellow-800"
                          : alq.estado === "ACEPTADO"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-300 text-gray-800"}
                      `}
                    >
                      {alq.estado}
                    </span>
                  </td>

                  <td className="px-6 py-4 border-t">{alq.fechaInicio}</td>
                  <td className="px-6 py-4 border-t">{alq.fechaFin}</td>

                  <td className="px-6 py-4 border-t text-center">
                    {tipoUsuario === "INQUILINO" && alq.estado === "PENDIENTE" && (
                      <>
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                          onClick={() => aceptar(alq.idAlquiler)}
                        >
                          Aceptar
                        </button>

                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => rechazar(alq.idAlquiler)}
                        >
                          Rechazar
                        </button>
                      </>
                    )}

                    {tipoUsuario === "INQUILINO" && alq.estado === "ACEPTADO" && (
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() =>
                          setAlquilerExpandido(
                            alquilerExpandido === alq.idAlquiler
                              ? null
                              : alq.idAlquiler
                          )
                        }
                      >
                        Ver pagos
                      </button>
                    )}
                  </td>
                </tr>

                {/* ======= DETALLE MENSUAL ======= */}
                {alquilerExpandido === alq.idAlquiler && (
                  <tr>
                    <td colSpan="6" className="bg-gray-50 px-6 py-4">
                      <h4 className="font-semibold mb-3">
                        Detalle de pagos mensuales
                      </h4>

                      <ul className="space-y-2">
                        {generarMesesAlquiler(alq.fechaInicio, alq.fechaFin).map(
                          (mes, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center bg-white p-3 rounded shadow-sm"
                            >
                              <span className="capitalize">{mes.label}</span>

                              <div className="flex items-center gap-3">
                                <span className="text-sm px-2 py-1 rounded bg-yellow-200 text-yellow-800">
                                  {mes.estado}
                                </span>

                                <button
                                  className="bg-green-600 text-white px-3 py-1 rounded"
                                  onClick={() =>
                                    pagarMes(alq.idAlquiler, mes)
                                  }
                                >
                                  Pagar
                                </button>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListAlquileres;
