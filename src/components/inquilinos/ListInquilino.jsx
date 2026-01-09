import React, { useEffect, useState } from 'react'
import InquilinoService from '../../service/InquilinoService';
import { Link } from "react-router-dom";

const ListInquilino = () => {
    const [inquilinos,setInquilinos] = useState([]);

    const listarInquilinos = () => {
        InquilinoService.listarInquilinos()
        .then(response => {
            setInquilinos(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    useEffect(()=>{
        listarInquilinos();
    },[]);

    const deleteInquilino = (idInquilino) => {
        if(window.confirm("¿Estás seguro de eliminar este propietario?")){
            InquilinoService.eliminarInquilino(idInquilino)
            .then(()=> {
                listarInquilinos();
            })
            .catch(error=> {
                console.log(error);
            });
        }
    }


  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Inquilinos</h2>
     <Link 
          to='/crearInquilino' 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Agregar Inquilino
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
            {inquilinos.map((inquilino) => (
              <tr key={inquilino.idInquilino} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 border-t text-gray-800">{inquilino.nombre}</td>
                <td className="px-6 py-4 border-t text-gray-800">{inquilino.apellido}</td>
                <td className="px-6 py-4 border-t text-gray-800">{inquilino.email}</td>
                <td className="px-6 py-4 border-t text-gray-800">{inquilino.contrasenia}</td>
                <td className="px-6 py-4 border-t text-center">
                  <Link 
                    to={`/editInquilino/${inquilino.idInquilino}`} 
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition mr-2"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => deleteInquilino(inquilino.idInquilino)} 
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {inquilinos.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No hay inquilinos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListInquilino