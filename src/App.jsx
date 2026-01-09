import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import HeaderComponent from './components/HeaderComponent';
import HeaderLogout from './components/HeaderLogout';

import Home from './page/Home';
import Login from './page/Login';

import ListInquilino from './components/inquilinos/ListInquilino';
import CrearInquilino from './components/inquilinos/CrearInquilino';
import ListPropietario from './components/ListPropietario';
import CrearPropietario from './components/CrearPropietario';
import CrearPropiedad from './components/propiedad/CrearPropiedad';
import ListPropiedades from './components/propiedad/ListPropiedades';
import ListAlquileres from './components/alquiler/ListAlquileres';
import CrearAlquiler from './components/alquiler/CrearAlquiler';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <BrowserRouter>
        
        {/* Header público cuando NO está logueado */}
        {!isLoggedIn && <HeaderLogout />}

        {/* Si está logueado → sidebar + rutas privadas */}
        {isLoggedIn ? (
          <div className="flex flex-1">
            <div className="w-64 bg-gray-800 text-white">
              <HeaderComponent />
            </div>

            <div className="flex-1 p-6">
              <Routes>

                {/* PROPIETARIOS */}
                <Route
                  path="/listPropietarios"
                  element={<ListPropietario />}
                />
                <Route
                  path="/crearPropietario"
                  element={<CrearPropietario />}
                />
                <Route
                  path="/editPropietario/:id"
                  element={<CrearPropietario />}
                />

                {/* PROPIEDADES */}
                <Route
                  path="/listPropiedades"
                  element={<ListPropiedades />}
                />
                <Route
                  path="/crearPropiedad"
                  element={<CrearPropiedad />}
                />
                <Route
                  path="/editPropiedad/:id"
                  element={<CrearPropiedad />}
                />

                {/* INQUILINOS */}
                <Route
                  path="/listInquilino"
                  element={<ListInquilino />}
                />
                <Route
                  path="/crearInquilino"
                  element={<CrearInquilino />}
                />
                <Route
                  path="/editInquilino/:id"
                  element={<CrearInquilino />}
                />

                {/* ALQUILERES */}
                <Route
                  path="/crearAlquiler"
                  element={<CrearAlquiler />}
                />
                <Route
                  path="/listAlquileres"
                  element={<ListAlquileres />}
                />

                {/* Ruta por defecto cuando logueado */}
                <Route path="*" element={<Navigate to="/listPropiedades" />} />
                
              </Routes>
            </div>
          </div>
        ) : (
          /* Rutas públicas cuando NO está logueado */
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* Si intenta ir a rutas privadas sin login → redirigir */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
