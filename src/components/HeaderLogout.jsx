import { Link } from "react-router-dom";

const HeaderLogout = () => {
  return (
         <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#e8e2dc]">
      <Link
  to="/"
  className="flex items-center gap-2 no-underline"
>
  <div className="flex items-center gap-2">
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="12" fill="#b07a5e" />
    <path d="M20 10L10 18V30H15V22H25V30H30V18L20 10Z" fill="white" />
    <path d="M20 15L23 20H17L20 15Z" fill="#b07a5e" />
  </svg>

  <span className="text-[20px] font-semibold tracking-[-0.02em] text-[#3b3735]">
    Adrentar<span className="text-[#b07a5e]">.</span>
  </span>
</div>
</Link>
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
