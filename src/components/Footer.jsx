import { WHATSAPP_NUMBER } from "../utils/whatsapp";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-8">
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h4 className="text-lg font-bold mb-2">AHOK Tour &amp; Travel</h4>
        <p className="text-sm text-blue-100 mb-4">
          Travel Antar Kota &amp; Pengiriman Paket — Aman, Cepat, Terpercaya.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 font-medium"
          >
            WhatsApp: +{WHATSAPP_NUMBER}
          </a>
          <span className="hidden sm:inline text-blue-300">|</span>
          <span className="text-blue-100">Email: info@ahoktourtravel.com</span>
        </div>
        <p className="text-xs text-blue-200 mt-6">
          © {CURRENT_YEAR} AHOK Tour &amp; Travel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
