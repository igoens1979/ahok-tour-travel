export default function Header() {
  return (
    <header className="relative overflow-hidden min-h-[320px] md:min-h-[400px] flex items-center justify-center">
      {/* Animated sky */}
      <div className="absolute inset-0 animate-sky" />

      {/* Mountains */}
      <div className="absolute inset-x-0 bottom-[70px] h-[120px] opacity-40">
        <svg viewBox="0 0 1280 120" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,120 L120,40 L260,90 L420,20 L560,80 L720,10 L880,70 L1040,25 L1280,80 L1280,120 Z" fill="#1e3a8a" />
        </svg>
      </div>

      {/* Road */}
      <div className="absolute inset-x-0 bottom-0 h-[70px] bg-slate-800" />
      <div className="absolute inset-x-0 bottom-[22px] h-[6px] overflow-hidden">
        <div className="animate-road flex w-[200%]">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="w-10 h-1.5 bg-white/80 mx-6 shrink-0" />
          ))}
        </div>
      </div>

      {/* Moving travel bus */}
      <div className="animate-car absolute bottom-[30px] left-0 w-[160px]">
        <svg viewBox="0 0 160 60" className="w-full h-auto drop-shadow-lg">
          <rect x="0" y="10" width="160" height="40" rx="8" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
          <rect x="12" y="-8" width="136" height="22" rx="6" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
          <rect x="20" y="-4" width="30" height="14" rx="2" fill="#93c5fd" />
          <rect x="60" y="-4" width="30" height="14" rx="2" fill="#93c5fd" />
          <rect x="100" y="-4" width="30" height="14" rx="2" fill="#93c5fd" />
          <circle cx="35" cy="50" r="9" fill="#1e293b" />
          <circle cx="35" cy="50" r="4" fill="#94a3b8" />
          <circle cx="125" cy="50" r="9" fill="#1e293b" />
          <circle cx="125" cy="50" r="4" fill="#94a3b8" />
        </svg>
      </div>

      {/* Branding */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-10">
        <img
          src="/logo.svg"
          alt="Logo AHOK Tour & Travel"
          className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4 drop-shadow-lg"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
          AHOK
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-amber-300 mt-1 drop-shadow-md">
          Tour &amp; Travel
        </h2>
        <p className="text-sm md:text-base text-blue-100 mt-2 drop-shadow">
          Travel Antar Kota &amp; Pengiriman Paket
        </p>
      </div>
    </header>
  );
}
