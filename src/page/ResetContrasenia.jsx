import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetContrasenia } from "../service/AuthService";

const ResetContrasenia = () => {
  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaContrasenia !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await resetContrasenia(token, nuevaContrasenia);
      setMensaje("Contraseña actualizada correctamente.");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("El link es inválido o expiró. Solicitá uno nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f2ee] flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-3xl px-8 py-10 w-full max-w-sm border border-[#e8e2dc]">
        <h2 className="text-2xl font-light text-[#3b3735] text-center mb-2">
          Nueva contraseña
        </h2>
        <p className="text-sm text-center text-[#b0a9a4] mb-6">
          Ingresá tu nueva contraseña.
        </p>

        {mensaje && <p className="text-green-600 text-sm text-center mb-4">{mensaje}</p>}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full px-4 py-2.5 text-sm bg-[#f6f2ee] border border-[#e8e2dc] rounded-xl text-[#3b3735] placeholder-[#b0a9a4] focus:outline-none focus:border-[#b07a5e] transition"
            value={nuevaContrasenia}
            onChange={(e) => setNuevaContrasenia(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full px-4 py-2.5 text-sm bg-[#f6f2ee] border border-[#e8e2dc] rounded-xl text-[#3b3735] placeholder-[#b0a9a4] focus:outline-none focus:border-[#b07a5e] transition"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-[#b07a5e] hover:bg-[#9c6a50] text-white py-2.5 rounded-full text-sm font-medium transition"
          >
            Guardar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetContrasenia;