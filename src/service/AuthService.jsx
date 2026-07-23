import api from "../api/axiosConfig";

export const login = async (email, contrasenia) => {
  const response = await api.post("/api/auth/login", {
    email,
    contrasenia,
  });

  const { usuario, token, tipo_usuario } = response.data;

  const tokenFinal = `Bearer ${token}`;

  localStorage.setItem("token", tokenFinal);
  localStorage.setItem("tipo_usuario", tipo_usuario?.toUpperCase());

  localStorage.setItem(
    "usuario",
    JSON.stringify({
      ...usuario,
      tipo_usuario: tipo_usuario?.toUpperCase(),
    })
  );

  return { usuario, token: tokenFinal, tipo_usuario };
};

export const registrarUsuario = async (data) => {
  const url =
    data.tipoUsuario === "PROPIETARIO"
      ? "/api/propietarios/registrar"
      : data.tipoUsuario === "PROVEEDOR"
      ? "/api/proveedores/crear"
      : "/api/inquilinos";

  return api.post(url, data);
};

export const solicitarRecuperacion = async (email) => {
  return api.post("/api/auth/recuperar-contrasenia", { email });
};

export const resetContrasenia = async (token, nuevaContrasenia) => {
  return api.post("/api/auth/reset-contrasenia", { token, nuevaContrasenia });
};

// 🔽 Nuevo: helpers para leer el usuario logueado desde localStorage
// (idUsuario es el id real: Inquilino y Propietario lo heredan de Usuario,
// y Proveedor expone además getIdProveedor()/setIdProveedor() como alias)

export const getUsuarioActual = () => {
  const raw = localStorage.getItem("usuario");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("No se pudo parsear el usuario de localStorage", error);
    return null;
  }
};

export const getTipoUsuarioActual = () => {
  return localStorage.getItem("tipo_usuario");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tipo_usuario");
  localStorage.removeItem("usuario");
};