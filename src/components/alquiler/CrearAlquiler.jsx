import React, { useEffect, useState } from "react";
import PropiedadService from "../../service/PropiedadService";
import AlquilerService from "../../service/AlquilerService";

function CrearAlquiler() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");  // ⬅️ IMPORTANTE

  const [propiedades, setPropiedades] = useState([]);

  const [form, setForm] = useState({
    idPropiedad: "",
    emailInquilino: "",
    precio: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    PropiedadService.listarMisPropiedades()
      .then((res) => setPropiedades(res.data))
      .catch(() => setMensaje("Error cargando propiedades"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const alquilerData = {
        idPropiedad: Number(form.idPropiedad),
        emailInquilino: form.emailInquilino,
        precio: Number(form.precio),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
      };

      await AlquilerService.crearAlquiler(alquilerData);

      setMensaje("Alquiler creado correctamente");

      setForm({
        idPropiedad: "",
        emailInquilino: "",
        precio: "",
        fechaInicio: "",
        fechaFin: "",
      });

    } catch (error) {
      if (error.response?.data?.message) {
        setMensaje(error.response.data.message);
      } else {
        setMensaje("Error al crear el alquiler");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg p-8 rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Crear Alquiler
      </h2>

      {mensaje && (
        <div className="mb-4 p-3 text-sm text-white bg-blue-500 rounded-md">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium">Propiedad</label>
          <select
            name="idPropiedad"
            value={form.idPropiedad}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-md"
          >
            <option value="">Seleccione una propiedad</option>

            {propiedades.map((p) => (
              <option key={p.idPropiedad} value={p.idPropiedad}>
                {p.direccion}
              </option>

            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">
            Email del Inquilino
          </label>
          <input
            type="email"
            name="emailInquilino"
            value={form.emailInquilino}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Precio</label>
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">
            Fecha de Inicio
          </label>
          <input
            type="date"
            name="fechaInicio"
            value={form.fechaInicio}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">
            Fecha de Fin
          </label>
          <input
            type="date"
            name="fechaFin"
            value={form.fechaFin}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          Crear Alquiler
        </button>
      </form>
    </div>
  );
}

export default CrearAlquiler;
