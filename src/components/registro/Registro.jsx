import { useState } from "react";
import { registrarUsuario } from "../../service/AuthService";
import { Link } from "react-router-dom";

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

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    paddingLeft: "48px",
    paddingRight: "24px",
    paddingTop: "16px",
    paddingBottom: "16px",
    borderRadius: "16px",
    background: "white",
    border: "1px solid #e8e2dc",
    fontSize: "14px",
    color: "#3b3735",
    outline: "none",
    fontFamily: "Inter, sans-serif",
    transition: "border-color 0.2s",
  };

  const handleFocus = (e) => (e.target.style.borderColor = "#b07a5e");
  const handleBlur  = (e) => (e.target.style.borderColor = "#e8e2dc");

  const IconUser = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── LADO IZQUIERDO: Identidad de marca ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-16"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,55,53,0.4), rgba(59,55,53,0.8)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Logo */}
        <div className="absolute top-12 left-12 flex items-center gap-2">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="12" fill="#b07a5e" />
            <path d="M20 10L10 18V30H15V22H25V30H30V18L20 10Z" fill="white" />
            <path d="M20 15L23 20H17L20 15Z" fill="#b07a5e" />
          </svg>
          <span className="text-white text-xl font-bold tracking-tight">Adrentar.</span>
        </div>

        {/* Tagline */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-light text-white leading-tight mb-6">
            Comenzá tu camino <br />
            <span className="italic font-medium" style={{ color: "#b07a5e" }}>
              con nosotros.
            </span>
          </h2>
          <p className="text-white/80 text-lg font-light leading-relaxed">
            Unite a la red de gestión de alquileres más eficiente. Profesionalizá
            tu relación con tus inmuebles.
          </p>
        </div>

        {/* Badge flotante */}
        <div
          className="absolute bottom-12 left-12 flex items-center gap-4 p-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: "#b07a5e" }}
          >
            1k+
          </div>
          <p className="text-white text-sm">
            Propietarios activos <br />
            <span className="opacity-60 text-xs font-light">
              Confían en nuestra gestión
            </span>
          </p>
        </div>
      </div>

      {/* ── LADO DERECHO: Formulario ── */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16"
        style={{ background: "#f6f2ee" }}
      >
        <div className="max-w-xl w-full">

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl font-light" style={{ color: "#3b3735" }}>
              Crea tu cuenta en{" "}
              <span className="font-medium" style={{ color: "#b07a5e" }}>
                Adrentar.
              </span>
            </h1>
            <p className="mt-3 font-light" style={{ color: "#6c625c" }}>
              Completá tus datos para empezar la experiencia.
            </p>
          </div>

          {error   && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-sm text-center mb-4" style={{ color: "#1a6b5a" }}>{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nombre */}
              <div>
                <label
                  className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ml-1"
                  style={{ color: "#b07a5e" }}
                >
                  Nombre
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4" style={{ color: "#9c8f8a" }}>
                    <IconUser />
                  </span>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Juan"
                    value={formData.nombre}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Apellido */}
              <div>
                <label
                  className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ml-1"
                  style={{ color: "#b07a5e" }}
                >
                  Apellido
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4" style={{ color: "#9c8f8a" }}>
                    <IconUser />
                  </span>
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Ej: Pérez"
                    value={formData.apellido}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ml-1"
                style={{ color: "#b07a5e" }}
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4" style={{ color: "#9c8f8a" }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="nombre@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ml-1"
                style={{ color: "#b07a5e" }}
              >
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4" style={{ color: "#9c8f8a" }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="contrasenia"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.contrasenia}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Selector de rol */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-3 ml-1"
                style={{ color: "#b07a5e" }}
              >
                Soy...
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "PROPIETARIO", label: "Propietario" },
                  { value: "INQUILINO",   label: "Inquilino"   },
                ].map(({ value, label }) => {
                  const selected = formData.tipoUsuario === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, tipoUsuario: value })}
                      style={{
                        padding: "16px",
                        borderRadius: "16px",
                        border: selected ? "1px solid #b07a5e" : "1px solid #e8e2dc",
                        background: selected ? "white" : "transparent",
                        color: selected ? "#b07a5e" : "#6c625c",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        transition: "all 0.2s",
                        boxShadow: selected ? "0 10px 15px -3px rgba(176,122,94,0.1)" : "none",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Términos */}
            <div className="px-1 pt-2">
              <p className="text-[11px] leading-relaxed text-center lg:text-left" style={{ color: "#6c625c" }}>
                Al registrarte, aceptás nuestros{" "}
                <a href="#" className="font-bold hover:underline" style={{ color: "#b07a5e" }}>
                  Términos de Servicio
                </a>{" "}
                y las{" "}
                <a href="#" className="font-bold hover:underline" style={{ color: "#b07a5e" }}>
                  Políticas de Privacidad
                </a>.
              </p>
            </div>

            {/* Botón principal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-medium transition-all active:scale-[0.98]"
              style={{
                background: loading ? "#d4b5a5" : "#3b3735",
                color: "#f6f2ee",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Inter, sans-serif",
                boxShadow: "0 20px 40px -12px rgba(59,55,53,0.25)",
              }}
              onMouseEnter={(e) => { if (!loading) e.target.style.background = "#2a2725"; }}
              onMouseLeave={(e) => { if (!loading) e.target.style.background = "#3b3735"; }}
            >
              {loading ? "Registrando..." : "Crear cuenta gratis"}
            </button>

          </form>

          <p className="text-center mt-10 text-sm" style={{ color: "#6c625c" }}>
            ¿Ya sos miembro?{" "}
            <Link to="/login" className="font-bold hover:underline" style={{ color: "#b07a5e" }}>
              Inicia sesión
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}