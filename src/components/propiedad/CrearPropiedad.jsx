import React, { useEffect, useState } from 'react';
import PropiedadService from '../../service/PropiedadService';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Ícono del marcador
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Componente interno: click en el mapa
const LocationMarker = ({ setCoords, setDireccion }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });

      try {
        const res = await axios.get(
          'https://nominatim.openstreetmap.org/reverse',
          {
            params: {
              lat,
              lon: lng,
              format: 'json',
            },
          }
        );

        if (res.data?.display_name) {
          setDireccion(res.data.display_name);
        }
      } catch (error) {
        console.error('Error obteniendo dirección:', error);
      }
    },
  });

  return null;
};

const CrearPropiedad = () => {
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState('');
  const [ambientes, setAmbientes] = useState('');
  const [coords, setCoords] = useState({ lat: -34.6037, lng: -58.3816 });
  const [errores, setErrores] = useState({});
  const [errorBackend, setErrorBackend] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  // ---------------- VALIDACIÓN FRONT ----------------
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es obligatoria';
    }

    if (!estado.trim()) {
      nuevosErrores.estado = 'El estado es obligatorio';
    }

    if (!ambientes.trim()) {
      nuevosErrores.ambientes = 'La cantidad de ambientes es obligatoria';
    } else if (!/^[1-9]\d*$/.test(ambientes)) {
      nuevosErrores.ambientes = 'Debe ser un número mayor a 0';
    }

    return nuevosErrores;
  };

  // ---------------- GEOCODIFICACIÓN ----------------
  const buscarCoordenadas = async (dir) => {
    try {
      const res = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: dir,
            format: 'json',
            limit: 1,
          },
        }
      );

      if (res.data?.length > 0) {
        setCoords({
          lat: parseFloat(res.data[0].lat),
          lng: parseFloat(res.data[0].lon),
        });
      }
    } catch (error) {
      console.error('Error buscando coordenadas:', error);
    }
  };

  useEffect(() => {
    if (direccion.trim().length > 3) {
      const timeout = setTimeout(() => {
        buscarCoordenadas(direccion);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [direccion]);

  // ---------------- GUARDAR / ACTUALIZAR ----------------
  const saveOrUpdatePropiedad = async (e) => {
    e.preventDefault();
    setErrores({});
    setErrorBackend('');

    const erroresFront = validarFormulario();
    if (Object.keys(erroresFront).length > 0) {
      setErrores(erroresFront);
      return;
    }

    const propiedad = {
      direccion: direccion.trim(),
      ambientes: Number(ambientes),
      estado: estado.trim(),
      latitud: coords.lat,
      longitud: coords.lng,
    };

    try {
      if (id) {
        await PropiedadService.actualizarPropiedad(id, propiedad);
      } else {
        await PropiedadService.crearPropiedad(propiedad);
      }
      navigate('/listPropiedades');
    } catch (error) {
  if (error.response) {
    const data = error.response.data;

    if (typeof data === 'string') {
      setErrorBackend(data);
    } else if (data.message) {
      setErrorBackend(data.message);
    } else {
      setErrorBackend('Esta direccion ya existe');
    }
  } else {
    setErrorBackend('No se pudo conectar con el servidor');
  }
}
  }

  // ---------------- CARGAR SI ES EDICIÓN ----------------
  useEffect(() => {
    if (id) {
      PropiedadService.getPropiedadById(id)
        .then((res) => {
          setDireccion(res.data.direccion ?? '');
          setAmbientes(String(res.data.ambientes ?? ''));
          setEstado(res.data.estado ?? '');

          if (res.data.latitud && res.data.longitud) {
            setCoords({
              lat: res.data.latitud,
              lng: res.data.longitud,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  // ---------------- UI ----------------
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {id ? 'Editar Propiedad' : 'Agregar Propiedad'}
      </h2>

      <form onSubmit={saveOrUpdatePropiedad} className="space-y-5">
        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className={`w-full border px-4 py-2 rounded-lg ${
              errores.direccion || errorBackend
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />

          {errores.direccion && (
            <p className="text-red-600 text-sm mt-1">{errores.direccion}</p>
          )}

          {errorBackend && (
            <p className="text-red-600 text-sm mt-1">{errorBackend}</p>
          )}
        </div>

        {/* Mapa */}
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={14}
          key={`${coords.lat}-${coords.lng}`}
          className="h-64 w-full rounded-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[coords.lat, coords.lng]} icon={markerIcon}>
            <Popup>{direccion || 'Ubicación'}</Popup>
          </Marker>
          <LocationMarker
            setCoords={setCoords}
            setDireccion={setDireccion}
          />
        </MapContainer>

        {/* Ambientes */}
        <div>
          <label className="block text-sm font-medium mb-1">Ambientes</label>
          <input
            type="number"
            value={ambientes}
            onChange={(e) => setAmbientes(e.target.value)}
            className={`w-full border px-4 py-2 rounded-lg ${
              errores.ambientes ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errores.ambientes && (
            <p className="text-red-600 text-sm mt-1">
              {errores.ambientes}
            </p>
          )}
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className={`w-full border px-4 py-2 rounded-lg ${
              errores.estado ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione un estado</option>
            <option value="Disponible">Disponible</option>
            <option value="No disponible">No disponible</option>
          </select>
          {errores.estado && (
            <p className="text-red-600 text-sm mt-1">{errores.estado}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Guardar
          </button>
          <Link
            to="/listPropiedades"
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Volver
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CrearPropiedad;
