import React, { useEffect, useState } from "react";
import PropiedadService from "../../service/PropiedadService";
import AlquilerService from "../../service/AlquilerService";
import ModalContrato from "./ModalContrato";

function CrearAlquiler() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  const [mostrarModalContrato, setMostrarModalContrato] = useState(false);
  const [alquilerCreado, setAlquilerCreado] = useState(null);
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (loading) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMensaje("");

    try {
      const alquilerData = {
        idPropiedad: Number(form.idPropiedad),
        emailInquilino: form.emailInquilino,
        precio: Number(form.precio),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
      };

      const resultado = await AlquilerService.crearAlquiler(alquilerData);
      setAlquilerCreado(resultado.data);
      setMostrarModalContrato(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-700 font-semibold text-base">Creando alquiler...</p>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white shadow-lg p-8 rounded-xl mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Alquiler</h2>

        {mensaje && (
          <div
            className={`mb-4 p-3 text-sm text-white rounded-md ${
              mensaje.includes("correctamente") ? "bg-green-500" : "bg-red-500"
            }`}
          >
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
              disabled={loading}
              className="w-full mt-1 p-3 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
            <label className="block text-gray-700 font-medium">Email del Inquilino</label>
            <input
              type="email"
              name="emailInquilino"
              value={form.emailInquilino}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full mt-1 p-3 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={loading}
              className="w-full mt-1 p-3 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Fecha de Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full mt-1 p-3 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Fecha de Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full mt-1 p-3 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Creando..." : "Crear Alquiler"}
          </button>
        </form>
      </div>

      {mostrarModalContrato && alquilerCreado && (
        <ModalContrato
          alquiler={alquilerCreado}
          propietario={{
            email: usuario.email,
            nombre: `${usuario.nombre} ${usuario.apellido}`,
          }}
          onCerrar={() => {
            setMostrarModalContrato(false);
            setMensaje("Alquiler creado correctamente");
          }}
        />
      )}
    </div>
  );
}

export default CrearAlquiler;