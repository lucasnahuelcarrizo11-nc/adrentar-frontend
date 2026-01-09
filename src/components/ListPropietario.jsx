import React, { useEffect, useState } from 'react';
import PropietarioService from '../service/PropietarioService';
import { Link } from "react-router-dom";

const ListPropietario = () => {
  const [propietarios, setPropietarios] = useState([]);

  // Función para listar propietarios
  const listarPropietarios = () => {
    PropietarioService.listarPropietarios()
      .then(response => {
        setPropietarios(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Se ejecuta una sola vez al montar el componente
  useEffect(() => {
    listarPropietarios();
  }, []);

  // Función para eliminar propietario
  const deletePropietario = (idPropietario) => {
    if (window.confirm("¿Estás seguro de eliminar este propietario?")) {
      PropietarioService.eliminarPropietario(idPropietario)
        .then(() => {
          // Refresca la lista después de eliminar
          listarPropietarios();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Propietarios</h2>
        <Link 
          to='/crearPropietario' 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Agregar Propietario
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Nombre</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Apellido</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Contraseña</th>
              <th className="text-center px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propietarios.map((propietario) => (
              <tr key={propietario.idPropietario} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 border-t text-gray-800">{propietario.nombre}</td>
                <td className="px-6 py-4 border-t text-gray-800">{propietario.apellido}</td>
                <td className="px-6 py-4 border-t text-gray-800">{propietario.email}</td>
                <td className="px-6 py-4 border-t text-gray-800">{propietario.contrasenia}</td>
                <td className="px-6 py-4 border-t text-center">
                  <Link 
                    to={`/editPropietario/${propietario.idPropietario}`} 
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition mr-2"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => deletePropietario(propietario.idPropietario)} 
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {propietarios.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No hay propietarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPropietario;
