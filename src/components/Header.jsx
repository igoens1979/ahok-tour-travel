import { useRef } from "react";

const ADMIN_PASSWORD = "ahokadmin";

export default function Header() {
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const handleLogoTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 1000);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      const isAdmin = localStorage.getItem("ahok_admin") === "1";
      if (isAdmin) {
        const ok = window.confirm("Keluar dari Mode Admin?");
        if (ok) {
          localStorage.removeItem("ahok_admin");
          window.location.reload();
        }
      } else {
        const pwd = window.prompt("Masukkan password admin:");
        if (pwd === ADMIN_PASSWORD) {
          localStorage.setItem("ahok_admin", "1");
          window.location.reload();
        } else if (pwd !== null) {
          alert("Password salah.");
        }
      }
    }
  };

  return (
    <header className="flex flex-col items-center justify-center text-center py-10 px-4">
      <img
        src="/logo.svg"
        alt="Logo AHOK Tour & Travel"
        className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4 cursor-pointer select-none"
        onClick={handleLogoTap}
      />
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-white tracking-tight">
        AHOK
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 dark:text-blue-200 mt-1">
        Tour &amp; Travel
      </h2>
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2">
        Travel Antar Kota &amp; Pengiriman Paket
      </p>
    </header>
  );
}
