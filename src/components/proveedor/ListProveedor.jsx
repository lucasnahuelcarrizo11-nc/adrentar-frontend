import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProveedorService from "../../service/ProveedorService";
import { useAuth } from "../../context/AuthContext";

const ListProveedor = () => {
  const { usuario } = useAuth();
  const [proveedores, setProveedores] = useState([]);

  // 🔐 Validación ADMIN (según tu backend)
  const esAdmin = usuario?.tipo_usuario?.toUpperCase() === "ADMIN";

  // 📌 Traer proveedores
  const listarProveedores = () => {
    ProveedorService.listarProveedores()
      .then((response) => {
        // 👉 Si NO es admin, solo ve los activos
        if (esAdmin) {
          setProveedores(response.data);
        } else {
          setProveedores(response.data.filter((p) => p.activo));
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    listarProveedores();
  }, []);

  // 🔄 Activar / Desactivar proveedor (ADMIN)
  const toggleActivo = (proveedor) => {
    if (!esAdmin) return;

    const proveedorActualizado = {
      ...proveedor,
      activo: !proveedor.activo,
    };

    ProveedorService.actualizarProveedor(
      proveedor.idProveedor,
      proveedorActualizado
    )
      .then(() => listarProveedores())
      .catch((error) => console.error(error));
  };

  // ❌ Eliminar proveedor (ADMIN)
  const eliminarProveedor = (idProveedor) => {
    if (!esAdmin) return;

    if (window.confirm("¿Eliminar proveedor?")) {
      ProveedorService.eliminarProveedor(idProveedor)
        .then(() => listarProveedores())
        .catch((error) => console.error(error));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Proveedores disponibles
        </h2>

        {esAdmin && (
          <Link
            to="/crearProveedor"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Agregar proveedor
          </Link>
        )}
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Especialidad
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Zona
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Email
              </th>

              {esAdmin && (
                <>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                    Activo
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                    Acciones
                  </th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {proveedores.map((p) => (
              <tr key={p.idProveedor} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-t">{p.nombreCompleto}</td>
                <td className="px-6 py-4 border-t">{p.especialidad}</td>
                <td className="px-6 py-4 border-t">{p.zona}</td>
                <td className="px-6 py-4 border-t">{p.telefono}</td>
                <td className="px-6 py-4 border-t">{p.email}</td>

                {/* ✅ SWITCH SIEMPRE VISIBLE PARA ADMIN */}
                {esAdmin && (
                  <>
                    <td className="px-6 py-4 border-t text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={p.activo}
                          onChange={() => toggleActivo(p)}
                        />
                        <div
                          className="
                            w-11 h-6 bg-gray-300 rounded-full peer
                            peer-checked:bg-green-600
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                            after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                            peer-checked:after:translate-x-full
                          "
                        ></div>
                      </label>
                    </td>

                    <td className="px-6 py-4 border-t text-center">
                      <Link
                        to={`/editarProveedor/${p.idProveedor}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Editar
                      </Link>

                      <button
                        onClick={() => eliminarProveedor(p.idProveedor)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {proveedores.length === 0 && (
              <tr>
                <td
                  colSpan={esAdmin ? 7 : 5}
                  className="text-center py-6 text-gray-500"
                >
                  No hay proveedores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProveedor;
