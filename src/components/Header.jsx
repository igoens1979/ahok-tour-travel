export default function Header() {
  return (
    <header className="relative overflow-hidden min-h-[320px] md:min-h-[400px] flex items-center justify-center">
      {/* Background tour/travel scenery */}
      <div className="absolute inset-0">
        <img
          src="/images/header-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/30 to-black/50" />
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
