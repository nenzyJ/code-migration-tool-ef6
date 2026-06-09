import { useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Каталог", href: "/catalog" },
  { label: "Про нас", href: "/about" },
  { label: "Контакти", href: "/contacts" },
];

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M8.25 17.0247C7.7 17.0247 7.14583 16.9622 6.5875 16.8372C6.02917 16.7122 5.45833 16.5331 4.875 16.2997C5.075 14.2831 5.65833 12.3997 6.625 10.6497C7.59167 8.89972 8.83333 7.35805 10.35 6.02472C8.51667 6.95805 6.92917 8.19139 5.5875 9.72472C4.24583 11.2581 3.30833 13.0081 2.775 14.9747C2.70833 14.9247 2.64583 14.8706 2.5875 14.8122C2.52917 14.7539 2.46667 14.6914 2.4 14.6247C1.61667 13.8414 1.02083 12.9664 0.6125 11.9997C0.204167 11.0331 0 10.0247 0 8.97472C0 7.84139 0.225 6.75805 0.675 5.72472C1.125 4.69139 1.75 3.77472 2.55 2.97472C3.9 1.62472 5.65 0.745552 7.8 0.337219C9.95 -0.0711142 12.9667 -0.108614 16.85 0.224719C17.15 4.20805 17.1 7.24555 16.7 9.33722C16.3 11.4289 15.4333 13.1414 14.1 14.4747C13.2833 15.2914 12.3708 15.9206 11.3625 16.3622C10.3542 16.8039 9.31667 17.0247 8.25 17.0247Z" fill="#012D1D"/>
      </svg>
    ),
    title: "Екологічність",
    desc: "Ми пропонуємо сертифіковані органічні рішення, які зберігають родючість ґрунту та забезпечують сталий розвиток.",
  },
  {
    icon: (
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
        <path d="M5 16C4.16667 16 3.45833 15.7083 2.875 15.125C2.29167 14.5417 2 13.8333 2 13H0V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16V4H19L22 8V13H20C20 13.8333 19.7083 14.5417 19.125 15.125C18.5417 15.7083 17.8333 16 17 16C16.1667 16 15.4583 15.7083 14.875 15.125C14.2917 14.5417 14 13.8333 14 13H8C8 13.8333 7.70833 14.5417 7.125 15.125C6.54167 15.7083 5.83333 16 5 16ZM5 14C5.28333 14 5.52083 13.9042 5.7125 13.7125C5.90417 13.5208 6 13.2833 6 13C6 12.7167 5.90417 12.4792 5.7125 12.2875C5.52083 12.0958 5.28333 12 5 12C4.71667 12 4.47917 12.0958 4.2875 12.2875C4.09583 12.4792 4 12.7167 4 13C4 13.2833 4.09583 13.5208 4.2875 13.7125C4.47917 13.9042 4.71667 14 5 14ZM17 14C17.2833 14 17.5208 13.9042 17.7125 13.7125C17.9042 13.5208 18 13.2833 18 13C18 12.7167 17.9042 12.4792 17.7125 12.2875C17.5208 12.0958 17.2833 12 17 12C16.7167 12 16.4792 12.0958 16.2875 12.2875C16.0958 12.4792 16 12.7167 16 13C16 13.2833 16.0958 13.5208 16.2875 13.7125C16.4792 13.9042 16.7167 14 17 14ZM16 9H20.25L18 6H16V9Z" fill="#012D1D"/>
      </svg>
    ),
    title: "Швидка доставка",
    desc: "Оптимізована логістика дозволяє доставляти насіння та добрива безпосередньо до вашого господарства точно в строк.",
  },
  {
    icon: (
      <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
        <path d="M9 18V16H17V8.9C17 6.95 16.3208 5.29583 14.9625 3.9375C13.6042 2.57917 11.95 1.9 10 1.9C8.05 1.9 6.39583 2.57917 5.0375 3.9375C3.67917 5.29583 3 6.95 3 8.9V15H2C1.45 15 0.979167 14.8042 0.5875 14.4125C0.195833 14.0208 0 13.55 0 13V11C0 10.65 0.0875 10.3208 0.2625 10.0125C0.4375 9.70417 0.683333 9.45833 1 9.275L1.075 7.95C1.20833 6.81667 1.5375 5.76667 2.0625 4.8C2.5875 3.83333 3.24583 2.99167 4.0375 2.275C4.82917 1.55833 5.7375 1 6.7625 0.6C7.7875 0.2 8.86667 0 10 0C11.1333 0 12.2083 0.2 13.225 0.6C14.2417 1 15.15 1.55417 15.95 2.2625C16.75 2.97083 17.4083 3.80833 17.925 4.775C18.4417 5.74167 18.775 6.79167 18.925 7.925L19 9.225C19.3167 9.375 19.5625 9.6 19.7375 9.9C19.9125 10.2 20 10.5167 20 10.85V13.15C20 13.4833 19.9125 13.8 19.7375 14.1C19.5625 14.4 19.3167 14.625 19 14.775V16C19 16.55 18.8042 17.0208 18.4125 17.4125C18.0208 17.8042 17.55 18 17 18H9ZM7 11C6.71667 11 6.47917 10.9042 6.2875 10.7125C6.09583 10.5208 6 10.2833 6 10C6 9.71667 6.09583 9.47917 6.2875 9.2875C6.47917 9.09583 6.71667 9 7 9C7.28333 9 7.52083 9.09583 7.7125 9.2875C7.90417 9.47917 8 9.71667 8 10C8 10.2833 7.90417 10.5208 7.7125 10.7125C7.52083 10.9042 7.28333 11 7 11ZM13 11C12.7167 11 12.4792 10.9042 12.2875 10.7125C12.0958 10.5208 12 10.2833 12 10C12 9.71667 12.0958 9.47917 12.2875 9.2875C12.4792 9.09583 12.7167 9 13 9C13.2833 9 13.5208 9.09583 13.7125 9.2875C13.9042 9.47917 14 9.71667 14 10C14 10.2833 13.9042 10.5208 13.7125 10.7125C13.5208 10.9042 13.2833 11 13 11ZM4.025 9.45C3.90833 7.68333 4.44167 6.16667 5.625 4.9C6.80833 3.63333 8.28333 3 10.05 3C11.5333 3 12.8375 3.47083 13.9625 4.4125C15.0875 5.35417 15.7667 6.55833 16 8.025C14.4833 8.00833 13.0875 7.6 11.8125 6.8C10.5375 6 9.55833 4.91667 8.875 3.55C8.60833 4.88333 8.04583 6.07083 7.1875 7.1125C6.32917 8.15417 5.275 8.93333 4.025 9.45Z" fill="#012D1D"/>
      </svg>
    ),
    title: "Професійна підтримка",
    desc: "Наші агрономи завжди готові надати кваліфіковані консультації щодо вибору та застосування продукції.",
  },
];

const CATEGORIES = [
  {
    name: "Насіння",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/5fe6ebc6220d2543f64bfb111881f5e001361158?width=536",
  },
  {
    name: "Добрива",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/c7cb2e8ff8e6d72f705fad72b397a9308c7e1e4a?width=536",
  },
  {
    name: "Засоби захисту",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/d0f70a6d5ea5b3c85535f7981914578c48500926?width=536",
  },
  {
    name: "Агротехніка",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/ce5bf756d0266eb769e983abf6c94827a95e027a?width=536",
  },
];

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
    <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#012D1D"/>
  </svg>
);

export default function Index() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Запит надіслано!");
    setName("");
    setPhone("");
  };

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-agro-green">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-between h-[69px]">
          <Link to="/" className="font-['Montserrat',sans-serif] font-bold text-xl text-white tracking-wide">
            AgroTrade
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-agro-green border-t border-white/10 px-4 pb-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block py-3 text-white/80 hover:text-white text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        className="relative flex items-center min-h-[819px] pt-[69px]"
        style={{
          background: `url('https://api.builder.io/api/v1/image/assets/TEMP/552ac0fed311626cee71ed46572f1f4af77bc309?width=2560') lightgray center / cover no-repeat`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(1,45,29,0.80)] to-[rgba(1,45,29,0.00)]" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 w-full py-20">
          <div className="max-w-[700px] flex flex-col gap-6">
            <h1 className="font-['Montserrat',sans-serif] font-bold text-4xl sm:text-5xl lg:text-[56px] leading-tight text-white">
              Якість, що вирощена з любов'ю
            </h1>
            <p className="text-white/90 text-base sm:text-lg leading-7 max-w-[480px]">
              Найкращі добрива, насіння та техніка для вашого господарства. Надійний партнер для комерційних фермерів та агро-інвесторів.
            </p>
            <div>
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center px-8 py-4 bg-agro-green text-white text-sm font-semibold tracking-[0.7px] rounded border-2 border-transparent hover:bg-[#023d27] transition-colors"
              >
                Переглянути каталог
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-agro-bg py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex flex-col p-6 rounded border border-agro-border bg-agro-bg"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-agro-green-bg mb-4 flex-shrink-0">
                  {f.icon}
                </div>
                <h3 className="font-['Montserrat',sans-serif] font-semibold text-2xl text-agro-dark leading-8 mb-2">
                  {f.title}
                </h3>
                <p className="text-agro-body text-base leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="bg-agro-gray py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="mb-8">
            <h2 className="font-['Montserrat',sans-serif] font-semibold text-[32px] leading-10 text-agro-dark mb-2">
              Каталог продукції
            </h2>
            <p className="text-agro-body text-base leading-6">
              Оберіть категорію для вашого господарства
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to="/product"
                className="flex flex-col rounded border border-agro-border bg-agro-bg overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-48 overflow-hidden bg-[#E7E8E9]">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-4">
                  <span className="font-['Montserrat',sans-serif] font-semibold text-2xl text-agro-dark leading-8">
                    {cat.name}
                  </span>
                  <ArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-agro-bg py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-4">
              <h2 className="font-['Montserrat',sans-serif] font-semibold text-[32px] leading-10 text-agro-dark">
                Про нас
              </h2>
              <p className="text-agro-body text-base leading-6">
                AgroTrade — це більше, ніж просто магазин. Ми — ваш надійний партнер у світі сучасного агробізнесу. Наша місія полягає в тому, щоб забезпечити українських фермерів інноваційними та високоякісними рішеннями, які сприяють підвищенню врожайності та рентабельності.
              </p>
              <p className="text-agro-body text-base leading-6">
                Ми об'єднуємо передові технології з глибоким розумінням потреб землі, створюючи платформу, де ефективність зустрічається з екологічністю.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[rgba(0,45,27,0.20)] bg-[rgba(0,45,27,0.10)] self-start">
                <svg width="22" height="21" viewBox="0 0 22 21" fill="none">
                  <path d="M7.6 21L5.7 17.8L2.1 17L2.45 13.3L0 10.5L2.45 7.7L2.1 4L5.7 3.2L7.6 0L11 1.45L14.4 0L16.3 3.2L19.9 4L19.55 7.7L22 10.5L19.55 13.3L19.9 17L16.3 17.8L14.4 21L11 19.55L7.6 21ZM9.95 14.05L15.6 8.4L14.2 6.95L9.95 11.2L7.8 9.1L6.4 10.5L9.95 14.05Z" fill="#7B5731"/>
                </svg>
                <span className="text-agro-brown text-sm font-semibold tracking-[0.7px]">
                  Сертифікована якість
                </span>
              </div>
            </div>
            <div className="rounded border border-agro-border overflow-hidden h-[400px]">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/0799474a335e08da04c77817bc9ebb47408b8c3b?width=1116"
                alt="Агрономи за роботою"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-white py-24">
        <div className="max-w-[600px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-6">
            <h2 className="font-['Montserrat',sans-serif] font-semibold text-[32px] leading-10 text-agro-dark mb-2">
              Залишилися питання?
            </h2>
            <p className="text-agro-body text-base leading-6">
              Зв'яжіться з нашими експертами для отримання індивідуальної консультації.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col gap-1">
              <label className="text-agro-dark text-sm font-semibold tracking-[0.7px]">
                Ім'я
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введіть ваше ім'я"
                className="px-4 py-[14px] rounded border border-[#717973] bg-agro-bg text-agro-dark placeholder-[#6B7280] text-base outline-none focus:border-agro-green transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-agro-dark text-sm font-semibold tracking-[0.7px]">
                Телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+38 (000) 000-00-00"
                className="px-4 py-[14px] rounded border border-[#717973] bg-agro-bg text-agro-dark placeholder-[#6B7280] text-base outline-none focus:border-agro-green transition-colors"
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-8 bg-agro-green text-white text-sm font-semibold tracking-[0.7px] rounded hover:bg-[#023d27] transition-colors"
              >
                Відправити запит
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-agro-green py-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-['Montserrat',sans-serif] font-bold text-lg text-white">
            AgroTrade
          </span>
          <p className="text-white/60 text-sm text-center">
            © {new Date().getFullYear()} AgroTrade. Всі права захищені.
          </p>
        </div>
      </footer>
    </div>
  );
}
