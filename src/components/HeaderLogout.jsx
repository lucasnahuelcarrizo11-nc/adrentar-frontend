import { Link } from "react-router-dom";

const HeaderLogout = () => {
  return (
    <header className="w-full bg-white shadow-md flex items-center justify-between px-8 py-4">
      <h1 className="text-2xl font-bold text-indigo-600">Adrentar</h1>

      <nav className="flex gap-4">
        <Link
          to="/"
          className="text-gray-700 hover:text-indigo-600 font-medium"
        >
          Inicio
        </Link>
        <Link
          to="/login"
          className="border border-indigo-600 text-indigo-600 px-4 py-1 rounded hover:bg-indigo-600 hover:text-white transition"
        >
          Login
        </Link>
        <Link
          to="/registro"
          className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
        >
          Registro
        </Link>
      </nav>
    </header>
  );
};

export default HeaderLogout;
