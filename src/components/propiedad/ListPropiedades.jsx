import React, { useEffect, useState } from 'react';
import PropiedadService from '../../service/PropiedadService';
import { EyeIcon } from '@heroicons/react/24/outline';
import DetallePropiedadModal from './DetallePropiedadModal';
import { Link } from "react-router-dom";

const ListPropiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);

  const listarPropiedades = () => {
    PropiedadService.listarMisPropiedades()
      .then(response => {
        setPropiedades(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log("Error al obtener propiedades:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    listarPropiedades();
  }, []);

  const deletePropiedad = (idPropiedad) => {
    if (window.confirm("¿Estás seguro de eliminar esta propiedad?")) {
      PropiedadService.eliminarPropiedad(idPropiedad)
        .then(() => listarPropiedades())
        .catch(error => console.log(error));
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Cargando propiedades...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mis Propiedades</h2>
        <Link
          to="/CrearPropiedad"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Agregar Propiedad
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Dirección</th>
              <th className="px-6 py-3 text-left">Ambientes</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propiedades.length > 0 ? (
              propiedades.map((propiedad) => (
                <tr key={propiedad.idPropiedad} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{propiedad.direccion}</td>
                  <td className="px-6 py-4">{propiedad.ambientes}</td>
                  <td className="px-6 py-4">{propiedad.estado}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">

                    {/* VER DETALLE */}
                    <button
                      onClick={() => setPropiedadSeleccionada(propiedad)}
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                      title="Ver detalle"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>

                    {/* EDITAR */}
                    <Link
                      to={`/editPropiedad/${propiedad.idPropiedad}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Editar
                    </Link>

                    {/* ELIMINAR */}
                    <button
                      onClick={() => deletePropiedad(propiedad.idPropiedad)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No tienes propiedades registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {propiedadSeleccionada && (
        <DetallePropiedadModal
          propiedad={propiedadSeleccionada}
          onClose={() => setPropiedadSeleccionada(null)}
        />
      )}
    </div>
  );
};

export default ListPropiedades;
