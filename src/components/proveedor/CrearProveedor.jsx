import React, { useEffect, useState } from "react";
import ProveedorService from "../../service/ProveedorService";
import { useNavigate, useParams, Link } from "react-router-dom";

const CrearProveedor = () => {
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [especialidad, setEspecialidad] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [zona, setZona] = useState("");
    const [errores, setErrores] = useState({});

    const navigate = useNavigate();
    const { id } = useParams();

    // 🔍 Validaciones por campo
    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!nombreCompleto.trim())
            nuevosErrores.nombreCompleto = "El nombre es obligatorio";

        if (!telefono.trim())
            nuevosErrores.telefono = "El teléfono es obligatorio";

        if (!email.trim()) {
            nuevosErrores.email = "El email es obligatorio";
        } else if (!email.includes("@")) {
            nuevosErrores.email = "El email debe contener '@'";
        }

        if (!especialidad)
            nuevosErrores.especialidad = "Debe seleccionar una especialidad";

        if (!zona.trim()) nuevosErrores.zona = "La zona es obligatoria";

        return nuevosErrores;
    };

    const saveOrUpdateProveedor = async (e) => {
        e.preventDefault();
        setErrores({});

        const erroresFront = validarFormulario();
        if (Object.keys(erroresFront).length > 0) {
            setErrores(erroresFront);
            return;
        }

        const proveedor = {
            nombreCompleto,
            telefono,
            email,
            especialidad,
            descripcion,
            zona,
        };

        try {
            if (id) {
                await ProveedorService.actualizarProveedor(id, proveedor);
            } else {
                await ProveedorService.crearProveedor(proveedor);
            }
            navigate("/listProveedor");
        } catch (error) {
            console.error(error);
        }
    };

    // 🔄 Cargar proveedor si es edición
    useEffect(() => {
        if (id) {
            ProveedorService.getProveedorById(id)
                .then((response) => {
                    const p = response.data;
                    setNombreCompleto(p.nombreCompleto);
                    setTelefono(p.telefono);
                    setEmail(p.email);
                    setEspecialidad(p.especialidad);
                    setDescripcion(p.descripcion);
                    setZona(p.zona);
                })
                .catch((error) => console.log(error));
        }
    }, [id]);

    const title = () =>
        id ? (
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Editar Proveedor
            </h2>
        ) : (
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Agregar Proveedor
            </h2>
        );

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-md">
            {title()}

            <form className="space-y-5" onSubmit={saveOrUpdateProveedor}>
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2 ${errores.nombreCompleto ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Ej: Bob el constructor"
                    />
                    {errores.nombreCompleto && (
                        <p className="text-red-600 text-sm mt-1">
                            {errores.nombreCompleto}
                        </p>
                    )}
                </div>

                {/* Teléfono */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                    </label>
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2 ${errores.telefono ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Ej: 11505000"
                    />
                    {errores.telefono && (
                        <p className="text-red-600 text-sm mt-1">{errores.telefono}</p>
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
                        className={`w-full border rounded-lg px-4 py-2 ${errores.email ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="proveedor@email.com"
                    />
                    {errores.email && (
                        <p className="text-red-600 text-sm mt-1">{errores.email}</p>
                    )}
                </div>

                {/* Especialidad */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especialidad
                    </label>
                    <select
                        value={especialidad}
                        onChange={(e) => setEspecialidad(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2 ${errores.especialidad ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="">Seleccione una especialidad</option>
                        <option value="ELECTRICISTA">Electricista</option>
                        <option value="PLOMERIA">Plomería</option>
                        <option value="CARPINTERIA">Carpintería</option>
                        <option value="PINTOR">Pintor</option>
                        <option value="ALBAÑILERIA">Albañilería</option>
                        <option value="CRISTALERO">Cristalero</option>
                    </select>
                    {errores.especialidad && (
                        <p className="text-red-600 text-sm mt-1">
                            {errores.especialidad}
                        </p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        placeholder="Breve descripción del servicio"
                    />
                </div>

                {/* Zona */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zona
                    </label>
                    <input
                        type="text"
                        value={zona}
                        onChange={(e) => setZona(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2 ${errores.zona ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Ej: CABA"
                    />
                    {errores.zona && (
                        <p className="text-red-600 text-sm mt-1">{errores.zona}</p>
                    )}
                </div>

                {/* Botones */}
                <div className="flex justify-center gap-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Guardar
                    </button>

                    <Link
                        to="/listProveedor"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Volver
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CrearProveedor;
