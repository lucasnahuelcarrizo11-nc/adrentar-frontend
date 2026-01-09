import React from 'react'

const Home = () => {
  return (
    <div className="mt-20">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[70vh]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1572120360610-d971b9b78825?auto=format&fit=crop&w=1400&q=80')" }}>
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Encontrá tu hogar ideal</h1>
          <p className="text-lg md:text-xl mb-6">Te ayudamos a comprar, vender o alquilar de forma segura y rápida.</p>
          <a href="/propiedades" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-medium">
            Ver Propiedades
          </a>
        </div>
      </section>

      {/* Propiedades destacadas */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Propiedades destacadas</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80", titulo: "Casa moderna en Palermo", precio: "$250,000" },
              { img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80", titulo: "Departamento en Recoleta", precio: "$180,000" },
              { img: "https://images.unsplash.com/photo-1600607687920-4e3b3e8f9d1d?auto=format&fit=crop&w=800&q=80", titulo: "Dúplex en Belgrano", precio: "$320,000" },
            ].map((prop, i) => (
              <div key={i} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <img src={prop.img} alt={prop.titulo} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{prop.titulo}</h3>
                  <p className="text-blue-600 font-bold">{prop.precio}</p>
                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-3xl font-bold mb-8">¿Por qué elegirnos?</h2>
        <div className="grid md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">🏡 Variedad de propiedades</h3>
            <p className="text-gray-600">Disponemos de una amplia selección de casas, departamentos y terrenos.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">💬 Atención personalizada</h3>
            <p className="text-gray-600">Te acompañamos en cada paso del proceso con asesoramiento profesional.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">🔒 Operaciones seguras</h3>
            <p className="text-gray-600">Garantizamos transacciones seguras con total transparencia.</p>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 bg-blue-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">¿Tenés dudas o querés vender tu propiedad?</h2>
        <p className="mb-6">Contactanos y te asesoramos sin compromiso.</p>
        <a href="/contacto" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded hover:bg-gray-100">
          Contactar ahora
        </a>
      </section>
    </div>
  );
};

export default Home;