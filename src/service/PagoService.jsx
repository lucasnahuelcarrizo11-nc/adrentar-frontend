import axios from "axios";

const api = axios.create({
  baseURL: "https://adrentar-backend.onrender.com",
});

export default api;