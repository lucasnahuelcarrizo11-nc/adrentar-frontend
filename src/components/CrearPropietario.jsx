import React, { useEffect, useState } from 'react';
import PropietarioService from '../service/PropietarioService';
import { useNavigate, useParams, Link } from 'react-router-dom';

const CrearPropietario = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [errores, setErrores] = useState({}); //errores por campo

  const navigate = useNavigate();
  const { id } = useParams();

  // 🔍 Validaciones por campo
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio";

    if (!email.trim()) {
      nuevosErrores.email = "El email es obligatorio";
    } else if (!email.includes('@')) {
      nuevosErrores.email = "El email debe contener '@'";
    }

    if (!contrasenia.trim()) {
      nuevosErrores.contrasenia = "La contraseña es obligatoria";
    } else if (contrasenia.length < 8) {
      nuevosErrores.contrasenia = "La contraseña debe tener al menos 8 caracteres";
    }

    return nuevosErrores;
  };

  const saveOrUpdatePropietario = async (e) => {
    e.preventDefault();
    setErrores({});

    const erroresFront = validarFormulario();
    if (Object.keys(erroresFront).length > 0) {
      setErrores(erroresFront);
      return; // No continúa si hay errores
    }

    const propietario = { nombre, apellido, email, contrasenia };

    try {
      if (id) {
        await PropietarioService.actualizarPropietario(id, propietario);
      } else {
        await PropietarioService.crearPropietario(propietario);
      }
      navigate('/listPropietarios');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      PropietarioService.getPropietarioById(id)
        .then((response) => {
          setNombre(response.data.nombre);
          setApellido(response.data.apellido);
          setEmail(response.data.email);
          setContrasenia(response.data.contrasenia);
        })
        .catch((error) => console.log(error));
    }
  }, [id]);

  const title = () =>
    id ? (
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Editar Propietario
      </h2>
    ) : (
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Agregar Propietario
      </h2>
    );

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-md">
      {title()}

      <form className="space-y-5" onSubmit={saveOrUpdatePropietario}>
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errores.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingrese el nombre"
          />
          {errores.nombre && (
            <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errores.apellido ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingrese el apellido"
          />
          {errores.apellido && (
            <p className="text-red-600 text-sm mt-1">{errores.apellido}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errores.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingrese el email"
          />
          {errores.email && (
            <p className="text-red-600 text-sm mt-1">{errores.email}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errores.contrasenia ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingrese la contraseña"
          />
          {errores.contrasenia && (
            <p className="text-red-600 text-sm mt-1">{errores.contrasenia}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Guardar
          </button>
          &nbsp;&nbsp;
          <Link
            to="/listPropietarios"
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
          >
            Volver
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CrearPropietario;
