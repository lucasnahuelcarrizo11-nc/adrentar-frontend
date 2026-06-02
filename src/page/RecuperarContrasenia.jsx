import { useState } from "react";
import { solicitarRecuperacion } from "../service/AuthService";

const RecuperarContrasenia = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await solicitarRecuperacion(email);
      setMensaje("Si el email existe, recibirás un correo con las instrucciones.");
      setError("");
    } catch {
      setError("Ocurrió un error, intentá de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f2ee] flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-3xl px-8 py-10 w-full max-w-sm border border-[#e8e2dc]">
        <h2 className="text-2xl font-light text-[#3b3735] text-center mb-2">
          Recuperar contraseña
        </h2>
        <p className="text-sm text-center text-[#b0a9a4] mb-6">
          Ingresá tu email y te enviaremos un link para resetear tu contraseña.
        </p>

        {mensaje && <p className="text-green-600 text-sm text-center mb-4">{mensaje}</p>}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2.5 text-sm bg-[#f6f2ee] border border-[#e8e2dc] rounded-xl text-[#3b3735] placeholder-[#b0a9a4] focus:outline-none focus:border-[#b07a5e] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-[#b07a5e] hover:bg-[#9c6a50] text-white py-2.5 rounded-full text-sm font-medium transition"
          >
            Enviar link
          </button>

          <a href="/login" className="text-xs text-center text-[#b07a5e] hover:underline">
            Volver al inicio de sesión
          </a>
        </form>
      </div>
    </div>
  );
};

export default RecuperarContrasenia;