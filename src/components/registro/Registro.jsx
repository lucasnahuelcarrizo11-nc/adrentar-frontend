import { useState } from "react";
import { registrarUsuario } from "../../service/AuthService";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasenia: "",
    tipoUsuario: "PROPIETARIO",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await registrarUsuario(formData);
      setSuccess("Usuario registrado correctamente");
      setFormData({ nombre: "", apellido: "", email: "", contrasenia: "", tipoUsuario: "PROPIETARIO" });
    } catch (err) {
      setError(err.response?.data || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-9 pr-4 py-2.5 text-sm bg-[#f6f2ee] border border-[#e8e2dc] rounded-xl text-[#3b3735] placeholder-[#b0a9a4] focus:outline-none focus:border-[#b07a5e] transition";

  return (
    <div className="min-h-screen bg-[#f6f2ee] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-[#b07a5e] rounded-xl flex items-center justify-center">
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
            <rect x="2" y="6" width="12" height="9" rx="1"/>
            <path d="M1 7L8 2l7 5"/>
            <path d="M6 15V10h4v5"/>
          </svg>
        </div>
        <span className="text-xl font-medium text-[#3b3735]">Adrentar</span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl px-8 py-10 w-full max-w-sm border border-[#e8e2dc]">

        <h2 className="text-2xl font-light text-[#3b3735] text-center mb-2">
          Crear cuenta
        </h2>
        <p className="text-xs text-[#b0a9a4] text-center mb-8">
          Registrate como propietario o inquilino
        </p>

        {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
        {success && <p className="text-[#1a6b5a] text-xs text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Nombre */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b07a5e]">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                <circle cx="8" cy="5" r="3"/>
                <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"/>
              </svg>
            </span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Apellido */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b07a5e]">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                <circle cx="8" cy="5" r="3"/>
                <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"/>
              </svg>
            </span>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b07a5e]">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                <rect x="2" y="4" width="12" height="9" rx="1"/>
                <path d="M2 4l6 5 6-5"/>
              </svg>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b07a5e]">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                <rect x="3" y="7" width="10" height="8" rx="1"/>
                <path d="M5 7V5a3 3 0 016 0v2"/>
                <circle cx="8" cy="11" r="1"/>
              </svg>
            </span>
            <input
              type="password"
              name="contrasenia"
              placeholder="Contraseña"
              value={formData.contrasenia}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Tipo de usuario */}
          <div className="flex gap-2">
            {["PROPIETARIO", "INQUILINO"].map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setFormData({ ...formData, tipoUsuario: tipo })}
                className={`flex-1 py-2.5 rounded-full text-xs font-medium border transition ${
                  formData.tipoUsuario === tipo
                    ? "bg-[#b07a5e] text-white border-[#b07a5e]"
                    : "bg-transparent text-[#b07a5e] border-[#b07a5e] hover:bg-[#b07a5e]/10"
                }`}
              >
                {tipo === "PROPIETARIO" ? "Propietario" : "Inquilino"}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#b07a5e] hover:bg-[#9c6a50] disabled:bg-[#d4b5a5] text-white py-2.5 rounded-full text-sm font-medium transition mt-1"
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[#e8e2dc]" />
            <span className="text-xs text-[#b0a9a4]">¿ya tenés cuenta?</span>
            <div className="flex-1 h-px bg-[#e8e2dc]" />
          </div>

          {/* Login */}
          
            
          <a href="/login"
            className="w-full text-center border border-[#b07a5e] text-[#b07a5e] py-2.5 rounded-full text-sm hover:bg-[#b07a5e]/10 transition">
            Iniciar sesión
          </a>

        </form>
      </div>

    </div>
  );
}