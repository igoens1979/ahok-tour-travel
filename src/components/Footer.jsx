import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "../utils/whatsapp";

const CURRENT_YEAR = new Date().getFullYear();

function TransparentLogo({ src, alt, className }) {
  const [dataUrl, setDataUrl] = useState(null);
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + (w - 1)) * 4];
      let br = 0, bg = 0, bb = 0, cnt = 0;
      corners.forEach((idx) => { br += data[idx]; bg += data[idx + 1]; bb += data[idx + 2]; cnt++; });
      br = Math.round(br / cnt); bg = Math.round(bg / cnt); bb = Math.round(bb / cnt);
      const visited = new Uint8Array(w * h);
      const stack = [];
      const isBg = (i) => {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        return Math.abs(r - br) < 100 && Math.abs(g - bg) < 100 && Math.abs(b - bb) < 100;
      };
      for (let x = 0; x < w; x++) { stack.push(x); stack.push((h - 1) * w + x); }
      for (let y = 0; y < h; y++) { stack.push(y * w); stack.push(y * w + (w - 1)); }
      while (stack.length) {
        const idx = stack.pop();
        if (idx < 0 || idx >= w * h) continue;
        if (visited[idx]) continue;
        const i = idx * 4;
        if (!isBg(i)) continue;
        visited[idx] = 1;
        data[i + 3] = 0;
        const x = idx % w;
        const y = Math.floor(idx / w);
        if (x > 0) stack.push(idx - 1);
        if (x < w - 1) stack.push(idx + 1);
        if (y > 0) stack.push(idx - w);
        if (y < h - 1) stack.push(idx + w);
      }
      ctx.putImageData(imageData, 0, 0);
      let minX = w, minY = h, maxX = 0, maxY = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          if (data[i + 3] > 0) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX > minX && maxY > minY) {
        const cw = maxX - minX + 1;
        const ch = maxY - minY + 1;
        const cropped = document.createElement("canvas");
        cropped.width = cw;
        cropped.height = ch;
        const cctx = cropped.getContext("2d");
        cctx.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
        setDataUrl(cropped.toDataURL("image/png"));
      } else {
        setDataUrl(canvas.toDataURL("image/png"));
      }
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
            <img src="/images/dana-logo.png" alt="DANA" className="h-8 w-auto" />
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
