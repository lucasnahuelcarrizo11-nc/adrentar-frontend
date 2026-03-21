import React, { useEffect, useRef } from "react";

const Home = () => {

  const mockupRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    if (mockupRef.current) {
      observer.observe(mockupRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#f6f2ee] text-[#3b3735]">

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">

        <div className="max-w-4xl">
          <div className="mb-6">
            <span className="text-sm tracking-widest text-[#b07a5e] uppercase">
              Adrentar · Gestión directa de alquileres
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-light leading-tight mb-8">
            Alquilá y gestioná <br />
            <span className="font-semibold text-[#b07a5e]">
              sin inmobiliaria
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#6c625c] mb-12 max-w-2xl mx-auto">
            Plataforma digital para propietarios e inquilinos.
            Pagos mensuales, contratos online y gestión de mantenimiento
            en un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/registro"
              className="bg-[#b07a5e] hover:bg-[#9c6a50] text-white px-8 py-4 rounded-full transition text-lg"
            >
              Crear cuenta
            </a>

            <a
              href="/login"
              className="border border-[#b07a5e] text-[#b07a5e] px-8 py-4 rounded-full hover:bg-[#b07a5e]/10 transition text-lg"
            >
              Ingresar
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 w-24 h-[2px] bg-[#d8cfc8]" />
      </section>

      {/* BLOQUE SISTEMA */}
      <section className="py-28 px-6 bg-[#ffffff]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">

          <div>
            <h2 className="text-4xl font-light mb-8">
              Todo lo que necesitás <br />
              <span className="font-semibold text-[#b07a5e]">
                para administrar tu alquiler
              </span>
            </h2>

            <p className="text-[#6c625c] leading-relaxed mb-8">
              Eliminamos la complejidad del proceso tradicional.
              Propietarios e inquilinos pueden gestionar su contrato,
              pagos y mantenimiento sin intermediarios.
            </p>

            <div className="space-y-4 text-[#544e4a]">
              <div>• Contratos digitales centralizados</div>
              <div>• Seguimiento mensual de pagos</div>
              <div>• Historial completo del alquiler</div>
              <div>• Comunicación directa entre partes</div>
            </div>
          </div>

          <div className="bg-[#f3ece6] rounded-[40px] p-12 shadow-sm">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Pagos Online
                </h3>
                <p className="text-sm text-[#6c625c]">
                  El inquilino puede pagar cada mes desde su panel
                  y el propietario recibe confirmación inmediata.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Carga de Contratos
                </h3>
                <p className="text-sm text-[#6c625c]">
                  Subí contratos y documentación importante
                  y mantené todo organizado digitalmente.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Proveedores ante daños
                </h3>
                <p className="text-sm text-[#6c625c]">
                  Accedé rápidamente a electricistas, plomeros
                  y técnicos disponibles cuando surja un problema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN MOCKUP */}
   <div className="relative flex justify-center">
  <div className="max-w-6xl w-full grid md:grid-cols-3 gap-8">

    {/* Imagen 1 */}
    <div className="group bg-white rounded-[32px] shadow-xl p-4 border border-[#e5ddd6] hover:shadow-2xl transition duration-500">
      <div className="rounded-[24px] overflow-hidden">
        <img
          src="/imagenes/Principal.png"   // ← CAMBIÁ ESTA RUTA
          alt="Dashboard Adrentar"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-semibold text-[#3b3735]">
          Panel principal
        </h3>
        <p className="text-sm text-[#6c625c]">
          Vista general del alquiler
        </p>
      </div>
    </div>

    {/* Imagen 2 */}
    <div className="group bg-white rounded-[32px] shadow-xl p-4 border border-[#e5ddd6] hover:shadow-2xl transition duration-500">
      <div className="rounded-[24px] overflow-hidden">
        <img
          src="/imagenes/Pagos.png"   // ← CAMBIÁ ESTA RUTA
          alt="Pagos Adrentar"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-semibold text-[#3b3735]">
          Gestión de pagos
        </h3>
        <p className="text-sm text-[#6c625c]">
          Seguimiento mensual
        </p>
      </div>
    </div>

    {/* Imagen 3 */}
    <div className="group bg-white rounded-[32px] shadow-xl p-4 border border-[#e5ddd6] hover:shadow-2xl transition duration-500">
      <div className="rounded-[24px] overflow-hidden">
        <img
          src="/imagenes/docs.png"   // ← CAMBIÁ ESTA RUTA
          alt="Documentos Adrentar"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-semibold text-[#3b3735]">
          Documentación
        </h3>
        <p className="text-sm text-[#6c625c]">
          Contratos y archivos digitales
        </p>
      </div>
    </div>

  </div>
</div>
   

      {/* CTA FINAL */}
      <section className="py-28 px-6 text-center bg-[#ffffff]">

        <h2 className="text-4xl font-light mb-8">
          Empezá hoy mismo con Adrentar
        </h2>

        <p className="text-[#6c625c] mb-10 max-w-xl mx-auto">
          Modernizá la gestión de tus alquileres y olvidate
          de la burocracia tradicional.
        </p>

        <a
          href="/registro"
          className="bg-[#b07a5e] hover:bg-[#9c6a50] text-white px-10 py-4 rounded-full transition text-lg"
        >
          Crear cuenta gratis
        </a>

      </section>

    </div>
  );
};

export default Home;