import { WHATSAPP_NUMBER } from "../utils/whatsapp";

const CURRENT_YEAR = new Date().getFullYear();

const BcaLogo = () => (
  <svg viewBox="0 0 80 32" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg" aria-label="BCA">
    <rect width="80" height="32" rx="6" fill="#005BAA" />
    <text x="40" y="22" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#ffffff">
      BCA
    </text>
  </svg>
);

const DanaLogo = () => (
  <svg viewBox="0 0 80 32" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg" aria-label="DANA">
    <rect width="80" height="32" rx="6" fill="#118EEA" />
    <text x="40" y="22" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#ffffff">
      DANA
    </text>
  </svg>
);

const GopayLogo = () => (
  <svg viewBox="0 0 80 32" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg" aria-label="GOPAY">
    <rect width="80" height="32" rx="6" fill="#00AA5B" />
    <text x="40" y="22" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#ffffff">
      GOPAY
    </text>
  </svg>
);

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">AHOK Tour &amp; Travel</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Travel Antar Kota &amp; Pengiriman Paket — Aman, Cepat, Terpercaya.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm mb-4">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            WhatsApp: +{WHATSAPP_NUMBER}
          </a>
          <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
          <span className="text-gray-600 dark:text-gray-400">Email: ahoksugiarto.325@gmail.com</span>
        </div>

        {/* Payment methods */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-1">
            <BcaLogo />
            <span className="text-xs text-gray-600 dark:text-gray-400">1250864121</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <DanaLogo />
            <span className="text-xs text-gray-600 dark:text-gray-400">{WHATSAPP_NUMBER}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <GopayLogo />
            <span className="text-xs text-gray-600 dark:text-gray-400">{WHATSAPP_NUMBER}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-500 mt-6">
          © {CURRENT_YEAR} AHOK Tour &amp; Travel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
