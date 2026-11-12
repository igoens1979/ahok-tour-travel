import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "../utils/whatsapp";

const CURRENT_YEAR = new Date().getFullYear();

// Removes near-white background from a JPG and returns a transparent PNG data URL.
function TransparentLogo({ src, alt, className }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // treat near-white pixels as transparent
        if (r > 235 && g > 235 && b > 235) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL("image/png"));
    };
    img.src = src;
  }, [src]);

  if (!dataUrl) {
    return <img src={src} alt={alt} className={className} />;
  }
  return <img src={dataUrl} alt={alt} className={className} />;
}

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
            <TransparentLogo src="/images/dana-logo.jpg" alt="DANA" className="h-8 w-auto" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{WHATSAPP_NUMBER}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <TransparentLogo src="/images/gopay-logo.jpg" alt="GoPay" className="h-8 w-auto" />
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
