import api from '../api/axiosConfig';

const obtenerEstado = (idUsuario) => api.get(`/api/suscripciones/estado/${idUsuario}`);

const crearSuscripcion = (idUsuario) => api.post(`/api/suscripciones/crear?idUsuario=${idUsuario}`);

const cancelarSuscripcion = (idUsuario) => api.post(`/api/suscripciones/cancelar?idUsuario=${idUsuario}`);

export default { obtenerEstado, crearSuscripcion, cancelarSuscripcion };