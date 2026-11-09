export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center text-center py-10 px-4">
      <img
        src="/logo.svg"
        alt="Logo AHOK Tour & Travel"
        className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4"
      />
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight">
        AHOK
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mt-1">
        Tour &amp; Travel
      </h2>
      <p className="text-sm md:text-base text-gray-500 mt-2">
        Travel Antar Kota &amp; Pengiriman Paket
      </p>
    </header>
  );
}
