import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const login = async (email, contrasenia) => {
  const response = await axios.post(`${API_URL}/login`, { email, contrasenia });

  const { usuario, token, tipo_usuario } = response.data;

  const tokenFinal = `Bearer ${token}`;

  localStorage.setItem("token", tokenFinal);

  // Guardar tipo_usuario en su propia clave
  localStorage.setItem("tipo_usuario", tipo_usuario?.toUpperCase());

  // Guardar usuario completo
  localStorage.setItem(
    "usuario",
    JSON.stringify({
      ...usuario,
      tipo_usuario: tipo_usuario?.toUpperCase(),
    })
  );

  return { usuario, token: tokenFinal, tipo_usuario };
};

const logout = async () => {
  const token = localStorage.getItem("token");

  await axios.post(`${API_URL}/logout`, {}, {
    headers: { Authorization: token },
  });

  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

export default { login, logout };
