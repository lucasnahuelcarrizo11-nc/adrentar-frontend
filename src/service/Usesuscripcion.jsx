import { useState, useEffect, useCallback } from "react";

// Ajustá esto si ya tenés una constante de base URL en otro archivo de servicios
const API_URL = import.meta.env.VITE_API_URL ;

export function useSuscripcion() {
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ajustá "usuario" e "idUsuario" si en tu app usás otra key/estructura en localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const idUsuario = usuario?.idUsuario;

  const fetchEstado = useCallback(async () => {
    if (!idUsuario) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/suscripciones/estado/${idUsuario}`);
      if (!res.ok) throw new Error("No se pudo obtener el estado de la suscripción");
      const data = await res.json();
      setEstado(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [idUsuario]);

  useEffect(() => {
    fetchEstado();
  }, [fetchEstado]);

  const suscribirse = useCallback(async () => {
    if (!idUsuario) return;
    const res = await fetch(`${API_URL}/api/suscripciones/crear?idUsuario=${idUsuario}`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.initPoint) {
      window.location.href = data.initPoint;
    } else {
      throw new Error(data.error || "No se pudo iniciar la suscripción");
    }
  }, [idUsuario]);

  const cancelar = useCallback(async () => {
    if (!idUsuario) return;
    const res = await fetch(`${API_URL}/api/suscripciones/cancelar?idUsuario=${idUsuario}`, {
      method: "POST",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "No se pudo cancelar la suscripción");
    }
    await fetchEstado();
  }, [idUsuario, fetchEstado]);

  return { estado, loading, error, refetch: fetchEstado, suscribirse, cancelar };
}