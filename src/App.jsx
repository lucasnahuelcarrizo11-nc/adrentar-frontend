import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MisResenas from './components/proveedor/MisResenas';
import HeaderComponent from './components/HeaderComponent';
import HeaderLogout from './components/HeaderLogout';
import AuditoriaAlquiler from "./components/alquiler/AuditoriaAlquiler";
import SuscripcionModal from './components/SuscripcionModal';

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
import ListProveedor from './components/proveedor/ListProveedor';
import CrearProveedor from './components/proveedor/CrearProveedor';
import Registro from './components/registro/Registro';
import RecuperarContrasenia from "./page/RecuperarContrasenia";
import ResetContrasenia from './page/ResetContrasenia';
import FirmaCompletada from "./page/FirmaCompletada";
import Perfil from "./components/Perfil"
import CrearReparacion from './components/proveedor/CrearReparacion';
import ListReparaciones from './components/proveedor/ListReparaciones';
import GastosReparaciones from './components/GastosReparaciones';
import EstadisticasAvanzadas from './components/EstadisticasAvanzadas';


function App() {
  const { isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      {isLoggedIn ? (
        // ── Layout autenticado ──────────────────────────────
        <div style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          background: "#f6f2ee",
          fontFamily: "Inter, sans-serif",
        }}>
          {/* Sidebar fijo */}
          <HeaderComponent />
<SuscripcionModal />

          {/* Contenido principal scrolleable */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            <Routes>
              {/* PROPIETARIOS */}
              <Route path="/listPropietarios"    element={<ListPropietario />} />
              <Route path="/crearPropietario"    element={<CrearPropietario />} />
              <Route path="/editPropietario/:id" element={<CrearPropietario />} />
              <Route path="/gastosReparaciones" element={<GastosReparaciones/>}/>
              <Route path='/estadisticasAvanzadas' element={<EstadisticasAvanzadas/>}/>

              {/* PROPIEDADES */}
              <Route path="/listPropiedades"    element={<ListPropiedades />} />
              <Route path="/CrearPropiedad"     element={<CrearPropiedad />} />
              <Route path="/editPropiedad/:id"  element={<CrearPropiedad />} />

              {/* INQUILINOS */}
              <Route path="/listInquilino"    element={<ListInquilino />} />
              <Route path="/crearInquilino"   element={<CrearInquilino />} />
              <Route path="/editInquilino/:id" element={<CrearInquilino />} />

              {/* ALQUILERES */}
              <Route path="/CrearAlquiler"  element={<CrearAlquiler />} />
              <Route path="/listAlquileres" element={<ListAlquileres />} />
              <Route path="/firma-completada" element={<FirmaCompletada />} />
              <Route path="/auditoria/:idAlquiler" element={<AuditoriaAlquiler />} />


              {/* PROVEEDORES */}
              <Route path="/listProveedor"         element={<ListProveedor />} />
              <Route path="/crearProveedor"        element={<CrearProveedor />} />
              <Route path="/editarProveedor/:id"   element={<CrearProveedor />} />
              <Route path="/misResenas" element={<MisResenas />}/>

                 <Route path="/reparaciones" element={<ListReparaciones />}/>
               <Route path="/crearReparacion" element={<CrearReparacion />}/>

              <Route path="/Perfil"   element={<Perfil />} />

              {/* Default */}
              <Route path="*" element={<Navigate to="/listProveedor" />} />
            </Routes>
          </div>
        </div>
      ) : (
        // ── Rutas públicas ──────────────────────────────────
        <div style={{ minHeight: "100vh", background: "#f6f2ee" }}>
          {!isLoggedIn && <HeaderLogout />}
          <Routes>
            <Route path="/"                  element={<Home />} />
            <Route path="/login"             element={<Login />} />
            <Route path="/registro"          element={<Registro />} />
            <Route path="/recuperar"         element={<RecuperarContrasenia />} />
            <Route path="/reset-contrasenia" element={<ResetContrasenia />} />
            <Route path="*"                  element={<Navigate to="/login" />} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;