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

// Componente interno: escucha clics en el mapa y actualiza coordenadas
const LocationMarker = ({ setCoords, setDireccion }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });

      try {
        // Reverse geocoding: obtener dirección desde coordenadas
        const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            lat,
            lon: lng,
            format: 'json',
          },
        });
        if (res.data && res.data.display_name) {
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
  const [errores, setErrores] = useState({});
  const [coords, setCoords] = useState({ lat: -34.6037, lng: -58.3816 }); // Default: Buenos Aires

  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ Validación mejorada
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!String(direccion).trim()) {
      nuevosErrores.direccion = 'La dirección es obligatoria';
    }

    if (!String(estado).trim()) {
      nuevosErrores.estado = 'El estado es obligatorio';
    }

    if (!String(ambientes).trim()) {
      nuevosErrores.ambientes = 'La cantidad de ambientes es obligatoria';
    } else if (!/^[1-9]\d*$/.test(ambientes)) {
      nuevosErrores.ambientes = 'Debe ingresar un número entero mayor a 0';
    }

    return nuevosErrores;
  };

  // Geocodificación: dirección → coordenadas
  const buscarCoordenadas = async (dir) => {
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: dir,
          format: 'json',
          addressdetails: 1,
          limit: 1,
        },
      });

      if (res.data && res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    } catch (error) {
      console.error('Error buscando coordenadas:', error);
    }
  };

  // 🔍 Actualizar coordenadas cuando cambia la dirección
  useEffect(() => {
    if (String(direccion).trim().length > 3) {
      const delayDebounceFn = setTimeout(() => {
        buscarCoordenadas(direccion);
      }, 800);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [direccion]);

  // ✅ Guardar o actualizar propiedad
  const saveOrUpdatePropiedad = async (e) => {
    e.preventDefault();
    setErrores({});

    const erroresFront = validarFormulario();
    if (Object.keys(erroresFront).length > 0) {
      setErrores(erroresFront);
      return;
    }

    const propiedad = {
      direccion: String(direccion).trim(),
      ambientes: Number(ambientes),
      estado: String(estado).trim(),
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
      console.error('Error al guardar propiedad:', error);
    }
  };

  // 🔁 Cargar datos si se edita una propiedad
  useEffect(() => {
    if (id) {
      PropiedadService.getPropiedadById(id)
        .then((response) => {
          setDireccion(response.data.direccion ?? '');
          setAmbientes(String(response.data.ambientes ?? ''));
          setEstado(response.data.estado ?? '');
          if (response.data.latitud && response.data.longitud) {
            setCoords({
              lat: response.data.latitud,
              lng: response.data.longitud,
            });
          }
        })
        .catch((error) => console.log(error));
    }
  }, [id]);

  // 🏷️ Título dinámico
  const title = () =>
    id ? (
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Editar Propiedad
      </h2>
    ) : (
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Agregar Propiedad
      </h2>
    );

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      {title()}

      <form className="space-y-5" onSubmit={saveOrUpdatePropiedad}>
        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errores.direccion ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Ingrese la dirección o haga clic en el mapa"
          />
          {errores.direccion && (
            <p className="text-red-600 text-sm mt-1">{errores.direccion}</p>
          )}
        </div>

        {/* Mapa */}
        <div className="mt-4">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={14}
            key={`${coords.lat}-${coords.lng}`}
            className="h-64 w-full rounded-lg shadow"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coords.lat, coords.lng]} icon={markerIcon}>
              <Popup>{direccion || 'Ubicación estimada'}</Popup>
            </Marker>
            <LocationMarker setCoords={setCoords} setDireccion={setDireccion} />
          </MapContainer>
          <p className="text-gray-500 text-sm mt-2">
            🔍 Puede escribir una dirección o hacer clic en el mapa para ajustar la ubicación.
          </p>
        </div>

        {/* Ambientes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ambientes
          </label>
          <input
            type="number"
            value={ambientes}
            onChange={(e) => setAmbientes(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errores.ambientes ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Ingrese cantidad de ambientes"
          />
          {errores.ambientes && (
            <p className="text-red-600 text-sm mt-1">{errores.ambientes}</p>
          )}
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errores.estado ? 'border-red-500' : 'border-gray-300'
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
        <div className="flex justify-center gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Guardar
          </button>
          <Link
            to="/listPropiedades"
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
          >
            Volver
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CrearPropiedad;
