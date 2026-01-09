import React, { useState } from "react";
import AuthService from "../service/AuthService";
import { useNavigate } from "react-router-dom";
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
    const data = await AuthService.login(email, contrasenia);
    const { usuario, token, tipo_usuario } = data;
    login(usuario, token, tipo_usuario); // ✅ ahora incluye tipo_usuario
    if(tipo_usuario ==="INQUILINO"){
      navigate("/listAlquileres");
    }else{
      navigate("/listPropiedades");
    }
  } catch (err) {
    setError("Credenciales incorrectas");
  }
};
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">
          Iniciar sesión
        </h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border rounded"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
