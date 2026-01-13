import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import NotificacionesBell from "./NotificacionesBell"; // 👈 importar el componente

const HeaderComponent = () => {
  const { logout, usuario } = useAuth();

  const tipoUsuario = (localStorage.getItem("tipo_usuario") || "").toUpperCase();

  return (
    <aside className="flex flex-col h-full p-4 bg-gray-800 text-white">
      <h2 className="text-2xl font-bold mb-6">Adrentar</h2>
      <p className="mb-4 text-sm text-gray-300">Hola, {usuario?.nombre}</p>

      {/* 👇 Campanita de notificaciones */}
      {usuario && usuario.tipo_usuario?.toLowerCase() === "inquilino" && (
        <div className="mb-4">
          <NotificacionesBell idInquilino={usuario.idUsuario} />
        </div>
      )}
      <nav className="flex flex-col gap-3">
        {/* ⭐ Solo PROPIETARIO ve estas opciones */}
        {tipoUsuario === "PROPIETARIO" && (
          <>
            <Link to="/listPropietarios" className="hover:text-indigo-400">
              Propietarios
            </Link>
            <Link to="/listInquilino" className="hover:text-indigo-400">
              Inquilinos
            </Link>
            <Link to="/listPropiedades" className="hover:text-indigo-400">
              Propiedades
            </Link>
          </>
        )}



        {/* ⭐ TODOS LOS USUARIOS VEN ALQUILERES */}
        <Link to="/listAlquileres" className="hover:text-indigo-400">
          Alquileres
        </Link>
        <Link to="/listProveedor" className="hover:text-indigo-400">
          Proveedores
        </Link>
      </nav>

      <button
        onClick={logout}
        className="mt-auto bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
      >
        Cerrar sesión
      </button>
    </aside>
  );
};

export default HeaderComponent;
