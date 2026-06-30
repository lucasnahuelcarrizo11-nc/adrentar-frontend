import React, { useState } from "react";
import { login as loginService } from "../service/AuthService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginService(email, contrasenia);
      const { usuario, token, tipo_usuario } = data;
      login(usuario, token, tipo_usuario);
      if (tipo_usuario === "INQUILINO") {
        navigate("/listAlquileres");
      } else {
        navigate("/listPropiedades");
      }
    } catch (err) {
      console.error("Error login:", err);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── LADO IZQUIERDO: Identidad de marca ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-16"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,55,53,0.4), rgba(59,55,53,0.8)), url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')",
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
            Tu patrimonio, <br />
            <span className="italic font-medium" style={{ color: "#b07a5e" }}>
              en buenas manos.
            </span>
          </h2>
          <p className="text-white/80 text-lg font-light leading-relaxed">
            Unite a la comunidad de propietarios que eligen una gestión
            transparente y eficiente.
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
            Propiedades gestionadas <br />
            <span className="opacity-60 text-xs font-light">
              este mes en la plataforma
            </span>
          </p>
        </div>
      </div>

      {/* ── LADO DERECHO: Formulario ── */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20"
        style={{ background: "#f6f2ee" }}
      >
        <div className="max-w-md w-full">

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-light" style={{ color: "#3b3735" }}>
              Bienvenido a{" "}
              <span className="font-medium" style={{ color: "#b07a5e" }}>
                Adrentar.
              </span>
            </h1>
            <p className="mt-3 font-light text-lg" style={{ color: "#6c625c" }}>
              Ingresá para gestionar tus alquileres.
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-6">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ml-1"
                style={{ color: "#b07a5e" }}
              >
                Email de usuario
              </label>
              <div className="relative group">
                <span
                  className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors"
                  style={{ color: "#9c8f8a" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border text-sm shadow-sm outline-none transition-all"
                  style={{ borderColor: "#e8e2dc", color: "#3b3735" }}
                  onFocus={(e) => (e.target.style.borderColor = "#b07a5e")}
                  onBlur={(e) => (e.target.style.borderColor = "#e8e2dc")}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label
                  className="block text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: "#b07a5e" }}
                >
                  Contraseña
                </label>
                <Link
                  to="/recuperar"
                  className="text-[11px] font-medium hover:underline"
                  style={{ color: "#6c625c" }}
                >
                  ¿Olvidaste tu clave?
                </Link>
              </div>
              <div className="relative group">
                <span
                  className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors"
                  style={{ color: "#9c8f8a" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={contrasenia}
                  onChange={(e) => setContrasenia(e.target.value)}
                  required
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border text-sm shadow-sm outline-none transition-all"
                  style={{ borderColor: "#e8e2dc", color: "#3b3735" }}
                  onFocus={(e) => (e.target.style.borderColor = "#b07a5e")}
                  onBlur={(e) => (e.target.style.borderColor = "#e8e2dc")}
                />
              </div>
            </div>

            {/* Recordarme */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded"
                style={{ accentColor: "#b07a5e" }}
              />
              <label htmlFor="remember" className="text-xs" style={{ color: "#6c625c" }}>
                Recordarme en este dispositivo
              </label>
            </div>

            {/* Botón principal */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-medium transition-all active:scale-[0.98]"
              style={{
                background: "#3b3735",
                color: "#f6f2ee",
                boxShadow: "0 20px 40px -12px rgba(59,55,53,0.25)",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#2a2725")}
              onMouseLeave={(e) => (e.target.style.background = "#3b3735")}
            >
              Iniciar Sesión
            </button>

            {/* Separador */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: "#e8e2dc" }} />
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-4 text-[10px] uppercase font-bold tracking-widest"
                  style={{ background: "#f6f2ee", color: "#9c8f8a" }}
                >
                  O ingresar con
                </span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition shadow-sm"
                style={{ border: "1px solid #e8e2dc", background: "white", color: "#3b3735" }}
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition shadow-sm"
                style={{ border: "1px solid #e8e2dc", background: "white", color: "#3b3735" }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                </svg>
                Apple
              </button>
            </div>

          </form>

          <p className="text-center mt-12 text-sm" style={{ color: "#6c625c" }}>
            ¿Todavía no sos parte?{" "}
            <Link to="/registro" className="font-bold hover:underline" style={{ color: "#b07a5e" }}>
              Crear cuenta gratis
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;