import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const login = (usuario, token, tipo_usuario) => {
    const usuarioCompleto = { ...usuario, token, tipo_usuario };
    localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));
    setUsuario(usuarioCompleto);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  const isLoggedIn = !!usuario;

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
