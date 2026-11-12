import { WHATSAPP_NUMBER } from "../utils/whatsapp";

const CURRENT_YEAR = new Date().getFullYear();

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
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
          <div className="flex flex-col items-center gap-1">
            <img src="/images/bca-logo.svg" alt="BCA" className="h-8 w-auto" />
            <span className="text-xs text-gray-600 dark:text-gray-400">1250864121</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <img src="/images/dana-logo.png" alt="DANA" className="h-8 w-auto" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{WHATSAPP_NUMBER}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <img src="/images/gopay-logo.png" alt="GoPay" className="h-8 w-auto" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">GoPay</span>
            </div>
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
