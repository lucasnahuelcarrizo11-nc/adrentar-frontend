import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icono marker
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DetallePropiedadModal = ({ propiedad, onClose }) => {
  if (!propiedad) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 relative">

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          Detalle de la Propiedad
        </h2>

        {/* Datos */}
        <div className="space-y-2 mb-4">
          <p><strong>Dirección:</strong> {propiedad.direccion}</p>
          <p><strong>Ambientes:</strong> {propiedad.ambientes}</p>
          <p><strong>Estado:</strong> {propiedad.estado}</p>
        </div>

        {/* Mapa */}
        {propiedad.latitud && propiedad.longitud && (
          <MapContainer
            center={[propiedad.latitud, propiedad.longitud]}
            zoom={14}
            className="h-64 w-full rounded-lg"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[propiedad.latitud, propiedad.longitud]}
              icon={markerIcon}
            >
              <Popup>{propiedad.direccion}</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default DetallePropiedadModal;
