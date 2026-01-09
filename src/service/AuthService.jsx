import api from "../api/axiosConfig";

const CLIENTE_BASE_REST_API_URL = "/api/auth";

const login = async (email, contrasenia) => {
  const response = await api.post(
    `${CLIENTE_BASE_REST_API_URL}/login`,
    { email, contrasenia }
  );

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

export default { login };
