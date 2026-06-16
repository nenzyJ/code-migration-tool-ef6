import { Link, useLocation } from "react-router-dom";

const PAGE_NAMES: Record<string, string> = {
  "/catalog": "Каталог",
  "/about": "Про нас",
  "/contacts": "Контакти",
};

export default function Placeholder() {
  const { pathname } = useLocation();
  const name = PAGE_NAMES[pathname] ?? "Сторінка";

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <header className="bg-white border-b border-[#012D1D]/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex items-center h-[69px]">
          <Link to="/" className="font-['Montserrat',sans-serif] font-bold text-xl text-[#012D1D] tracking-wide">
            AgroTrade
          </Link>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="font-['Montserrat',sans-serif] font-semibold text-4xl text-[#191C1D] mb-4">
          {name}
        </h1>
        <p className="text-[#414844] text-lg mb-8 max-w-md">
          Ця сторінка ще в розробці. Продовжуйте спілкування, щоб наповнити її вмістом.
        </p>
        <Link
          to="/"
          className="px-8 py-4 bg-[#012D1D] text-white text-sm font-semibold tracking-[0.7px] rounded hover:bg-[#023d27] transition-colors"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}
