import { Link } from "react-router-dom";

const HeaderLogout = () => {
  return (
         <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#e8e2dc]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#b07a5e] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
              <rect x="2" y="6" width="12" height="9" rx="1"/>
              <path d="M1 7L8 2l7 5"/>
              <path d="M6 15V10h4v5"/>
            </svg>
          </div>
          <span className="text-[15px] font-medium text-[#3b3735]">Adrentar</span>
        </div>
        <div className="flex gap-2">
          <a href="/login" className="px-5 py-2 text-xs border border-[#b07a5e] text-[#b07a5e] rounded-full hover:bg-[#b07a5e]/10 transition">
            Iniciar sesión
          </a>
          <a href="/registro" className="px-5 py-2 text-xs bg-[#b07a5e] text-white rounded-full hover:bg-[#9c6a50] transition">
            Crear cuenta
          </a>
        </div>
      </nav>

  );
};

export default HeaderLogout;
