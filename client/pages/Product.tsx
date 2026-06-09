import { Link } from "react-router-dom";
import { useState } from "react";

export default function Product() {
  const [activeTab, setActiveTab] = useState('Опис');

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Header from the mockup */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-between h-[69px]">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-['Montserrat',sans-serif] font-bold text-xl text-[#012D1D] tracking-wide">
              AgroTrade
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-[#012D1D] text-sm font-medium border-b-2 border-[#012D1D] py-1 cursor-pointer">Marketplace</span>
              <span className="text-[#414844] hover:text-[#012D1D] text-sm font-medium py-1 cursor-pointer">Analytics</span>
              <span className="text-[#414844] hover:text-[#012D1D] text-sm font-medium py-1 cursor-pointer">Logistics</span>
              <span className="text-[#414844] hover:text-[#012D1D] text-sm font-medium py-1 cursor-pointer">Investments</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-[#012D1D] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#023d27] transition-colors">Post Offer</button>
            <button className="bg-white text-[#012D1D] border border-[#012D1D] px-4 py-2 rounded text-sm font-semibold hover:bg-gray-50 transition-colors">Sign In</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-8 font-medium">
          <Link to="/catalog" className="hover:text-gray-800 transition-colors">Catalog</Link> &gt; Seeds &gt; <span className="text-[#012D1D]">Winter Wheat</span>
        </div>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Images */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[4/3]">
              <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10">
                <span className="px-3 py-1.5 bg-white/95 text-xs font-semibold tracking-wide rounded-full text-gray-800 border border-gray-200 uppercase">
                  🌾 озима пшениця
                </span>
                <span className="px-3 py-1.5 bg-white/95 text-xs font-semibold tracking-wide rounded-full text-green-700 border border-green-200 flex items-center gap-1.5 uppercase">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Elite Class Certified
                </span>
              </div>
              <img src="https://api.builder.io/api/v1/image/assets/TEMP/5fe6ebc6220d2543f64bfb111881f5e001361158?width=800" alt="Пшениця" className="w-full h-full object-cover" />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg overflow-hidden border-2 border-[#012D1D] cursor-pointer h-24">
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/5fe6ebc6220d2543f64bfb111881f5e001361158?width=200" className="w-full h-full object-cover" alt="thumb 1" />
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 cursor-pointer h-24 hover:border-gray-400 transition-colors">
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/c7cb2e8ff8e6d72f705fad72b397a9308c7e1e4a?width=200" className="w-full h-full object-cover" alt="thumb 2" />
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 cursor-pointer h-24 hover:border-gray-400 transition-colors">
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/d0f70a6d5ea5b3c85535f7981914578c48500926?width=200" className="w-full h-full object-cover" alt="thumb 3" />
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 cursor-pointer h-24 hover:border-gray-400 transition-colors">
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/ce5bf756d0266eb769e983abf6c94827a95e027a?width=200" className="w-full h-full object-cover" alt="thumb 4" />
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              <span className="text-[#10b981] text-xs font-bold tracking-[1px] uppercase">В наявності</span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-[#191C1D] mb-6 font-['Montserrat',sans-serif] leading-tight">
              Насіння Озимої Пшениці<br/>"Еліта"
            </h1>

            <div className="text-[32px] font-bold text-[#191C1D] mb-8">
              12 500 грн <span className="text-lg font-medium text-gray-500">/ т</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="flex-1 bg-[#012D1D] text-white py-4 px-6 rounded flex items-center justify-center gap-2 font-semibold hover:bg-[#023d27] transition-colors shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Додати в кошик
              </button>
              <button className="flex-1 bg-white text-[#012D1D] border-2 border-[#012D1D] py-4 px-6 rounded font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                Купити зараз
              </button>
            </div>

            {/* Features widgets */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-[#F8F9FA] p-4 rounded-xl flex items-start gap-3 border border-gray-100">
                <div className="bg-white p-2.5 rounded shadow-sm text-blue-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5l-5 5-5-5M19 12H5M17 19l-5-5-5 5"/></svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">Зимостійкість</span>
                  <span className="font-bold text-[#191C1D] text-sm">Висока <span className="text-gray-400 font-medium">(8.5/10)</span></span>
                </div>
              </div>
              <div className="bg-[#F8F9FA] p-4 rounded-xl flex items-start gap-3 border border-gray-100">
                <div className="bg-white p-2.5 rounded shadow-sm text-orange-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">Посухостійкість</span>
                  <span className="font-bold text-[#191C1D] text-sm">Максимальна <span className="text-gray-400 font-medium">(9.0/10)</span></span>
                </div>
              </div>
            </div>

            {/* Bottom icons */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-auto px-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#f4f2ef] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B5731" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <span className="text-xs font-semibold text-gray-600 tracking-wide">Сертифіковано</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#f4f2ef] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B5731" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
                <span className="text-xs font-semibold text-gray-600 tracking-wide">1-3 дні</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#f4f2ef] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B5731" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                </div>
                <span className="text-xs font-semibold text-gray-600 tracking-wide">Підтримка</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-b border-gray-200 mb-8 mt-4">
          <div className="flex gap-8">
            {['Опис', 'Характеристики', 'Відгуки (24)'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-bold text-sm tracking-wide transition-colors relative ${activeTab === tab ? 'text-[#012D1D]' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#012D1D] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-[800px] mb-12">
          {activeTab === 'Опис' && (
            <div className="flex flex-col gap-6 text-[#414844] leading-relaxed">
              <h2 className="text-2xl font-bold text-[#191C1D] mb-1 font-['Montserrat',sans-serif]">Високоврожайний сорт "Еліта"</h2>
              <p>
                Насіння озимої пшениці сорту "Еліта" — це результат багаторічної селекції, спрямованої на
                створення максимально стійкої культури для помірних та степових кліматичних зон. Даний сорт
                характеризується високою пластичністю та стабільними показниками врожайності навіть при
                несприятливих погодних умовах.
              </p>
              <p>
                Зерно відповідає стандартам 1-го класу, має високий вміст білка та клейковини, що робить його
                ідеальним для хлібопекарської промисловості. Сорт "Еліта" демонструє чудову стійкість до
                вилягання та основних грибкових захворювань, що дозволяє оптимізувати витрати на засоби
                захисту рослин.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <span className="text-[#414844] text-sm"><span className="font-medium text-[#191C1D]">Потенціал врожайності:</span> 90-110 ц/га</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <span className="text-[#414844] text-sm"><span className="font-medium text-[#191C1D]">Вміст білка:</span> 14.5% - 15.2%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <span className="text-[#414844] text-sm"><span className="font-medium text-[#191C1D]">Сорт інтенсивного типу</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <span className="text-[#414844] text-sm"><span className="font-medium text-[#191C1D]">Висота рослини:</span> 85-95 см</span>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Характеристики' && (
            <div className="text-[#414844]">Тут будуть детальні характеристики товару.</div>
          )}
          {activeTab === 'Відгуки (24)' && (
            <div className="text-[#414844]">Тут будуть відгуки клієнтів.</div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-white mt-auto">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <span className="font-['Montserrat',sans-serif] font-bold text-xl text-[#012D1D]">
              AgroTrade
            </span>
            <p className="text-gray-500 text-xs">
              © 2024 AgroTrade. Professional Agricultural Marketplace. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-gray-500">
            <span className="hover:text-[#012D1D] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#012D1D] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#012D1D] cursor-pointer transition-colors">Help Center</span>
            <span className="hover:text-[#012D1D] cursor-pointer transition-colors">Contact Sales</span>
            <span className="hover:text-[#012D1D] cursor-pointer transition-colors">Partner Program</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
