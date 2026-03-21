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
      : "/api/inquilinos";

  return api.post(url, data);
};