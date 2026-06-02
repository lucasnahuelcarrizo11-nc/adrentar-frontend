import React, { useState } from "react";
import { login as loginService } from "../service/AuthService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

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
    console.error("Error login:", err); // 👈 agregá esto para debug
    setError("Credenciales incorrectas");
  }
};
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

        <h2 className="text-2xl font-light text-[#3b3735] text-center mb-8">
          Iniciar sesión
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b07a5e]">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                <circle cx="8" cy="6" r="3"/>
                <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"/>
              </svg>
            </span>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#f6f2ee] border border-[#e8e2dc] rounded-xl text-[#3b3735] placeholder-[#b0a9a4] focus:outline-none focus:border-[#b07a5e] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              placeholder="Contraseña"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#f6f2ee] border border-[#e8e2dc] rounded-xl text-[#3b3735] placeholder-[#b0a9a4] focus:outline-none focus:border-[#b07a5e] transition"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              required
            />
          </div>
{/* Olvidé contraseña */}
<div className="text-right -mt-1">
  <Link to="/recuperar" className="text-xs text-[#b07a5e] hover:underline">
    Olvidé mi contraseña
  </Link>
</div>
          {/* Botón ingresar */}
          <button
            type="submit"
            className="w-full bg-[#b07a5e] hover:bg-[#9c6a50] text-white py-2.5 rounded-full text-sm font-medium transition mt-1"
          >
            Ingresar
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[#e8e2dc]" />
            <span className="text-xs text-[#b0a9a4]">o</span>
            <div className="flex-1 h-px bg-[#e8e2dc]" />
          </div>

          {/* Crear cuenta */}
         <a
  href="/registro"
  className="w-full flex justify-center items-center bg-[#b07a5e] hover:bg-[#9c6a50] text-white py-2.5 rounded-full text-sm font-medium transition mt-1 text-center"
>
  Crear Cuenta
</a>
    

        </form>
      </div>

    </div>
  );
};

export default Login;
