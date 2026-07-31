import { useEffect, useState } from "react";
import { logout, getUsuarioActual } from "../service/AuthService";
import suscripcionService from "../service/SuscripcionService";
import { useNavigate } from "react-router-dom";

export default function SuscripcionModal() {

    const navigate = useNavigate();

    const [mostrar, setMostrar] = useState(false);

    const usuario = getUsuarioActual();

    useEffect(() => {

        if (!usuario) return;

        verificar();

    }, []);

    const verificar = async () => {

        try {

            const response = await suscripcionService.obtenerEstado(usuario.idUsuario);

            const estado = response.data.estado;

            if (estado === "VENCIDA" || estado === "CANCELADA") {

                setMostrar(true);

            }

        } catch (e) {

            console.error(e);

        }

    };

    const suscribirse = async () => {

        try {

            const response = await suscripcionService.crearSuscripcion(usuario.idUsuario);

            window.location.href = response.data.initPoint;

        } catch (e) {

            alert("No se pudo iniciar la suscripción");

        }

    };

    const cerrarSesion = () => {

        logout();

        navigate("/login");

        window.location.reload();

    };

    if (!mostrar) return null;

    return (

        <div style={overlay}>

            <div style={modal}>

                <h2>Tu período de prueba finalizó</h2>

                <p>

                    Para seguir utilizando Adrentar necesitás una suscripción activa.

                </p>

                <button
                    style={boton}
                    onClick={suscribirse}
                >
                    Suscribirme
                </button>

                <button
                    style={botonCancelar}
                    onClick={cerrarSesion}
                >
                    Cerrar sesión
                </button>

            </div>

        </div>

    );

}

const overlay = {

    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    background: "rgba(0,0,0,.65)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    zIndex: 999999

};

const modal = {

    width: 420,

    background: "#fff",

    borderRadius: 18,

    padding: 30,

    textAlign: "center"

};

const boton = {

    width: "100%",

    padding: 14,

    marginTop: 20,

    border: "none",

    borderRadius: 12,

    background: "#b07a5e",

    color: "#fff",

    cursor: "pointer",

    fontWeight: 600

};

const botonCancelar = {

    width: "100%",

    padding: 14,

    marginTop: 12,

    borderRadius: 12,

    border: "1px solid #ccc",

    cursor: "pointer",

    background: "#fff"

};