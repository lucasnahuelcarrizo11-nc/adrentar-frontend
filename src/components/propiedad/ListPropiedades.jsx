import React, { useEffect, useState } from 'react'
import PropiedadService from '../../service/PropiedadService';
import { Link } from "react-router-dom";

const ListPropiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);

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
        .then(() => {
          listarPropiedades();
        })
        .catch(error => {
          console.log(error);
        });
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
          to='/CrearPropiedad' 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Agregar Propiedad
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Dirección</th>
  
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Ambientes</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Estado</th>
              <th className="text-center px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propiedades.length > 0 ? (
              propiedades.map((propiedad) => (
                <tr key={propiedad.idPropiedad} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 border-t text-gray-800">{propiedad.direccion}</td>
                 
                  <td className="px-6 py-4 border-t text-gray-800">{propiedad.ambientes}</td>
                  <td className="px-6 py-4 border-t text-gray-800">{propiedad.estado}</td>
                  <td className="px-6 py-4 border-t text-center">
                    <Link 
                      to={`/editPropiedad/${propiedad.idPropiedad}`} 
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition mr-2"
                    >
                      Editar
                    </Link>
                    <button 
                      onClick={() => deletePropiedad(propiedad.idPropiedad)} 
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No tienes propiedades registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPropiedades;
