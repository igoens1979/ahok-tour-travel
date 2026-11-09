import { useEffect, useState } from "react";

const SLIDES = ["/images/slide1.jpg", "/images/slide2.jpg", "/images/slide3.jpg", "/images/slide4.jpg"];

export default function Header() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="relative overflow-hidden min-h-[420px] md:min-h-[500px] flex items-center justify-center">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/40 to-black/60" />
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

        {/* Slide indicators */}
        <div className="flex gap-2 mt-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-amber-400" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
