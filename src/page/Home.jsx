import React from "react";

const Home = () => {
  return (
    <div className="bg-[#f6f2ee] text-[#3b3735]">

      {/* NAV */}
 
      {/* HERO */}
      <section className="py-20 px-8 text-center bg-[#f6f2ee]">
        <p className="text-[11px] tracking-widest text-[#b07a5e] uppercase mb-5">
          Gestión directa de alquileres
        </p>
        <h1 className="text-5xl font-light leading-tight text-[#3b3735] mb-4">
          Alquilá y gestioná<br />
          <span className="font-medium text-[#b07a5e]">sin intermediarios</span>
        </h1>
        <p className="text-[15px] text-[#6c625c] max-w-md mx-auto mb-8 leading-relaxed">
          Conectamos propietarios e inquilinos. Pagos, contratos y mantenimiento
          en un solo lugar, sin comisiones.
        </p>
        <div className="flex justify-center gap-3">
          <a href="/registro" className="px-7 py-3 bg-[#b07a5e] text-white rounded-full text-sm hover:bg-[#9c6a50] transition">
            Crear cuenta gratis
          </a>
          <a href="#como-funciona" className="px-7 py-3 border border-[#b07a5e] text-[#b07a5e] rounded-full text-sm hover:bg-[#b07a5e]/10 transition">
            Ver cómo funciona
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14 px-8 bg-white">
        <p className="text-[11px] tracking-widest text-[#b07a5e] uppercase text-center mb-7">
          Funciones principales
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {[
            {
              title: "Contratos digitales",
              desc: "Cargá y gestioná contratos firmados, accesibles en cualquier momento.",
              icon: (
                <svg width="16" height="16" fill="none" stroke="#b07a5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                  <rect x="2" y="2" width="12" height="12" rx="1"/>
                  <path d="M5 5h6M5 8h6M5 11h4"/>
                </svg>
              ),
            },
            {
              title: "Pagos online",
              desc: "El inquilino registra pagos y el propietario recibe confirmación inmediata.",
              icon: (
                <svg width="16" height="16" fill="none" stroke="#b07a5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                  <rect x="1" y="4" width="14" height="10" rx="1"/>
                  <path d="M4 4V3a1 1 0 011-1h6a1 1 0 011 1v1"/>
                  <circle cx="8" cy="9" r="1.5"/>
                </svg>
              ),
            },
            {
              title: "Historial completo",
              desc: "Registro de todos los pagos, contratos y comunicaciones del alquiler.",
              icon: (
                <svg width="16" height="16" fill="none" stroke="#b07a5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6"/>
                  <path d="M8 5v3l2 2"/>
                </svg>
              ),
            },
            {
              title: "Proveedores",
              desc: "Accedé a electricistas y plomeros disponibles ante cualquier urgencia.",
              icon: (
                <svg width="16" height="16" fill="none" stroke="#b07a5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                  <path d="M13 3l-4 4m0 0L5 13M9 7l-2-2M3 13l2-2"/>
                </svg>
              ),
            },
          ].map((f) => (
            <div key={f.title} className="bg-[#f6f2ee] rounded-2xl p-5">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <p className="text-[13px] font-medium text-[#3b3735] mb-1">{f.title}</p>
              <p className="text-[12px] text-[#6c625c] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section className="py-14 px-8 bg-[#f6f2ee]">
        <p className="text-[11px] tracking-widest text-[#b07a5e] uppercase text-center mb-2">Roles</p>
        <h2 className="text-2xl font-light text-[#3b3735] text-center mb-8">
          Para <span className="font-medium">propietarios</span> e inquilinos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">

          <div className="bg-white rounded-2xl p-6">
            <span className="inline-block text-[10px] tracking-wide uppercase px-3 py-1 rounded-full bg-[#f3ece6] text-[#9c6a50] mb-3">
              Propietario
            </span>
            <h3 className="text-[15px] font-medium text-[#3b3735] mb-2">Controlá tu alquiler</h3>
            <p className="text-[12px] text-[#6c625c] leading-relaxed mb-4">
              Toda la gestión desde tu panel, sin depender de nadie.
            </p>
            <ul className="flex flex-col gap-2">
              {["Panel con estado del alquiler", "Historial de cobros", "Gestión de contratos", "Solicitudes de mantenimiento"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px] text-[#6c625c]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b07a5e] mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <span className="inline-block text-[10px] tracking-wide uppercase px-3 py-1 rounded-full bg-[#eaf3f0] text-[#1a6b5a] mb-3">
              Inquilino
            </span>
            <h3 className="text-[15px] font-medium text-[#3b3735] mb-2">Gestioná tu vivienda</h3>
            <p className="text-[12px] text-[#6c625c] leading-relaxed mb-4">
              Todo lo que necesitás para tu alquiler en un solo lugar.
            </p>
            <ul className="flex flex-col gap-2">
              {["Registro de pagos mensuales", "Acceso a tus contratos", "Canal directo con el propietario", "Solicitud de reparaciones"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px] text-[#6c625c]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b07a5e] mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8 text-center bg-white">
        <h2 className="text-3xl font-light text-[#3b3735] mb-3">
          Empezá hoy con Adrentar
        </h2>
        <p className="text-[14px] text-[#6c625c] mb-7">
          Modernizá la gestión de tus alquileres y olvidate de la burocracia.
        </p>
        <a href="/registro" className="px-8 py-3 bg-[#b07a5e] text-white rounded-full text-sm hover:bg-[#9c6a50] transition">
          Crear cuenta gratis
        </a>
      </section>

      {/* FOOTER */}
      <footer className="flex justify-between items-center px-8 py-4 border-t border-[#e8e2dc] bg-[#f6f2ee]">
        <span className="text-[13px] font-medium text-[#6c625c]">Adrentar</span>
        <div className="flex gap-5">
          {["Términos", "Privacidad", "Contacto"].map((l) => (
            <a key={l} href="#" className="text-[12px] text-[#9c8f8a] hover:text-[#6c625c] transition">
              {l}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
};

export default Home;