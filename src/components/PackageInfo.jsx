import { useState, useEffect } from "react";
import { PACKAGE_INFO } from "../data/packageData";


const ADMIN_PASSWORD = "ahokadmin";

function getAdminMode() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ahok_admin") === "1";
}

export default function PackageInfo() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    goods: "",
    pickup: "",
    destinationAddr: "",
    paymentMethod: "Transfer",
  });
  const [bookingCode, setBookingCode] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [adminMode, setAdminMode] = useState(getAdminMode);
  const [downloadCode, setDownloadCode] = useState("");
  const [standaloneCode, setStandaloneCode] = useState("");
  const [adminCodeInput, setAdminCodeInput] = useState("");

  const toggleAdminMode = () => {
    if (adminMode) {
      setAdminMode(false);
      localStorage.removeItem("ahok_admin");
      return;
    }
    const pwd = window.prompt("Masukkan password admin:");
    if (pwd === ADMIN_PASSWORD) {
      setAdminMode(true);
      localStorage.setItem("ahok_admin", "1");
    } else if (pwd !== null) {
      alert("Password salah.");
    }
  };

  /* eslint-disable react(set-state-in-effect) */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "0") {
        localStorage.removeItem("ahok_admin");
        setAdminMode(false);
      }
      if (params.get("admin") === "1" && !adminMode) {
        const pwd = window.prompt("Masukkan password admin:");
        if (pwd === ADMIN_PASSWORD) {
          setAdminMode(true);
          localStorage.setItem("ahok_admin", "1");
        } else if (pwd !== null) {
          alert("Password salah.");
        }
      }
    } catch {
      // ignore
    }
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "M" || e.key === "m")) {
        e.preventDefault();
        if (adminMode) {
          setAdminMode(false);
          localStorage.removeItem("ahok_admin");
        } else {
          const pwd = window.prompt("Masukkan password admin:");
          if (pwd === ADMIN_PASSWORD) {
            setAdminMode(true);
            localStorage.setItem("ahok_admin", "1");
          } else if (pwd !== null) {
            alert("Password salah.");
          }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [adminMode]);
  /* eslint-enable react(set-state-in-effect) */

  const generateCode = () => "PKG-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const openForm = () => {
    if (!bookingCode) {
      setBookingCode(generateCode());
    }
    setShowForm((v) => !v);
  };

  const markPaid = () => {
    if (!bookingCode) return;
    if (localStorage.getItem("paid_" + bookingCode) === "1") {
      alert("Status sudah LUNAS. Kode " + bookingCode + " tidak dapat ditandai ulang.");
      return;
    }
    localStorage.setItem("paid_" + bookingCode, "1");
    try {
      const raw = localStorage.getItem("booking_" + bookingCode);
      if (raw) {
        const b = JSON.parse(raw);
        b.isPaid = true;
        localStorage.setItem("booking_" + bookingCode, JSON.stringify(b));
      }
    } catch {
      // ignore
    }
    setIsPaid(true);
    alert("Kode " + bookingCode + " ditandai LUNAS.");
  };

  const svgToPng = (src, w, h) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });

  const generateTicketPDF = async (booking) => {
    const code = booking.code;
    const isPaidFlag = booking.isPaid || localStorage.getItem("paid_" + code) === "1";
    const [{ jsPDF }, JsBarcode] = await Promise.all([
      import("jspdf"),
      import("jsbarcode").then((m) => m.default || m),
    ]);
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const logoData = await svgToPng("/logo.svg", 200, 200);

    const barcodeCanvas = document.createElement("canvas");
    JsBarcode(barcodeCanvas, code, {
      format: "CODE128",
      width: 2,
      height: 50,
      displayValue: true,
      fontSize: 12,
      margin: 4,
    });
    const barcodeData = barcodeCanvas.toDataURL("image/png");

    const pageW = 210;
    const margin = 15;

    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageW, 32, "F");
    if (logoData) {
      doc.addImage(logoData, "PNG", margin, 4, 24, 24);
    }
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("AHOK Tour & Travel", margin + 28, 14);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("E-TIKET PENGIRIMAN PAKET", margin + 28, 22);

    let y = 42;
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("KODE BOOKING", margin, y);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text(code, margin, y + 9);

    doc.addImage(barcodeData, "PNG", pageW - margin - 70, y - 4, 70, 24);

    y += 22;
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    const rows = [
      ["Kode Booking", code],
      ["Nama Pengirim", booking.name || "-"],
      ["No Tlp / WA", booking.phone || "-"],
      ["Jenis Barang/Berat", booking.goods || "-"],
      ["Alamat Jemput", booking.pickup || "-"],
      ["Alamat Tujuan", booking.destinationAddr || "-"],
      ["Metode Bayar", booking.paymentMethod || "-"],
    ];
    doc.setFontSize(11);
    rows.forEach(([label, value]) => {
      doc.setFont(undefined, "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(label, margin, y);
      doc.setFont(undefined, "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(String(value), margin + 40, y, { maxWidth: pageW - margin - (margin + 40) });
      y += 8;
    });

    if (isPaidFlag) {
      doc.saveGraphicsState();
      doc.setTextColor(34, 197, 94);
      doc.setFontSize(60);
      doc.setFont(undefined, "bold");
      doc.setGState(new doc.GState({ opacity: 0.18 }));
      doc.text("LUNAS", pageW / 2, 170, { align: "center", angle: 30 });
      doc.restoreGraphicsState();
    }

    y += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    const notes = [
      "E-tiket ini merupakan bukti pemesanan pengiriman paket. Konfirmasi via WhatsApp Admin.",
      "Paket akan dijemput & diantar sesuai jadwal travel yang tersedia.",
      "Harga dapat berubah jika membawa kelebihan Bagasi, dan Tujuan di Luar Batas pengantaran. Konsultasikan ke Admin.",
    ];
    notes.forEach((n) => {
      doc.text(n, margin, y, { maxWidth: pageW - 2 * margin });
      y += 6;
    });

    y += 4;
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, "bold");
    doc.text("Terima kasih telah memilih AHOK Tour & Travel.", margin, y);

    doc.setFillColor(30, 58, 138);
    doc.rect(0, 287, pageW, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.text("AHOK Tour & Travel  •  Pengiriman Paket & Dokumen  •  WA: +6281334987505", pageW / 2, 293, { align: "center" });

    doc.save(`E-Tiket-Paket-${code}.pdf`);
  };

  const downloadTicket = async () => {
    if (!bookingCode) return;
    if (localStorage.getItem("paid_" + bookingCode) !== "1") {
      alert("Pembayaran belum dikonfirmasi admin.");
      return;
    }
    let booking = null;
    try {
      const raw = localStorage.getItem("booking_" + bookingCode);
      if (raw) booking = JSON.parse(raw);
    } catch {
      booking = null;
    }
    if (!booking) {
      alert("Data booking tidak ditemukan di perangkat ini.");
      return;
    }
    await generateTicketPDF({ ...booking, isPaid: true });
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 md:p-8 border border-transparent dark:border-gray-800 transition-colors">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300">
            {PACKAGE_INFO.title}
          </h3>
          <button
            type="button"
            onClick={toggleAdminMode}
            className="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {adminMode ? "Keluar Admin" : "Mode Admin"}
          </button>
        </div>
        {adminMode && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            Mode Admin aktif.
          </div>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {PACKAGE_INFO.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {PACKAGE_INFO.features.map((f) => (
            <div
              key={f.title}
              className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-800"
            >
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">{f.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.description}</p>
            </div>
          ))}
        </div>

        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Estimasi Tarif Paket</h4>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="text-left px-4 py-2 rounded-tl-lg">Kategori</th>
                <th className="text-left px-4 py-2">Berat</th>
                <th className="text-left px-4 py-2 rounded-tr-lg">Estimasi Harga</th>
              </tr>
            </thead>
            <tbody>
              {PACKAGE_INFO.pricing.map((p, i) => (
                <tr
                  key={p.category}
                  className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
                >
                  <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                    {p.category}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                    {p.weight}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 font-medium text-amber-600">
                    {p.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Ketentuan</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {PACKAGE_INFO.terms.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        {/* Form Pemesanan Paket */}
        <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4 space-y-3">
          <button
            type="button"
            onClick={openForm}
            className="flex items-center justify-center w-full min-h-[44px] px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm md:text-base font-semibold hover:bg-indigo-700 transition shadow text-center"
          >
            {showForm ? "Tutup Form Pemesanan" : "Form Pemesanan Paket"}
          </button>

          {showForm && (
            <div className="space-y-2 bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kode Booking
                </label>
                <input
                  type="text"
                  readOnly
                  value={bookingCode}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Pengirim
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  No Tlp / WA
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jenis Barang / Berat
                </label>
                <input
                  type="text"
                  required
                  value={formData.goods}
                  onChange={(e) => setFormData({ ...formData, goods: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alamat Jemput
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.pickup}
                  onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alamat Tujuan
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.destinationAddr}
                  onChange={(e) => setFormData({ ...formData, destinationAddr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  required
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Transfer">Transfer</option>
                  <option value="Bayar ke Driver (Bayar Atas)">Bayar ke Driver (Bayar Atas)</option>
                </select>
              </div>
              <a
                href={generatePackageWALink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (!formData.name || !formData.phone || !formData.goods || !formData.pickup || !formData.destinationAddr) {
                    // still open? require fields
                  }
                  try {
                    localStorage.setItem(
                      "booking_" + bookingCode,
                      JSON.stringify({
                        code: bookingCode,
                        type: "package",
                        name: formData.name,
                        phone: formData.phone,
                        goods: formData.goods,
                        pickup: formData.pickup,
                        destinationAddr: formData.destinationAddr,
                        paymentMethod: formData.paymentMethod,
                      })
                    );
                  } catch {
                    // ignore
                  }
                  setIsPaid(localStorage.getItem("paid_" + bookingCode) === "1");
                }}
                className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition shadow text-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Kirim Form Pemesanan ke Admin (WhatsApp)
              </a>

              {/* Download E-Tiket Paket */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Masukkan Kode Booking untuk Download E-Tiket
                </label>
                <input
                  type="text"
                  placeholder="Kode Booking"
                  value={downloadCode}
                  onChange={(e) => setDownloadCode(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                {isPaid ? (
                  <button
                    type="button"
                    onClick={downloadTicket}
                    className="flex items-center justify-center w-full min-h-[44px] px-4 py-2 rounded-lg bg-blue-900 text-white text-sm md:text-base font-semibold hover:bg-blue-800 transition shadow text-center"
                  >
                    Download E-Tiket Paket (PDF)
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center w-full min-h-[44px] px-4 py-2 rounded-lg bg-gray-400 text-white text-sm md:text-base font-semibold cursor-not-allowed shadow text-center"
                  >
                    Download E-Tiket (Menunggu Pembayaran)
                  </button>
                )}
                {adminMode && !isPaid && (
                  <button
                    type="button"
                    onClick={markPaid}
                    className="flex items-center justify-center w-full min-h-[40px] px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition shadow text-center"
                  >
                    Tandai Lunas (Admin)
                  </button>
                )}
                {isPaid && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center">
                    Pembayaran lunas — E-Tiket siap diunduh. Kode: {bookingCode}
                  </p>
                )}
              </div>
            </div>
          )}
      </div>

          {/* Download E-Tiket mandiri (paket) */}
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 md:p-8 border border-transparent dark:border-gray-800">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
              Download E-Tiket Pengiriman Paket
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Masukkan Kode Booking untuk mengunduh E-Tiket paket (setelah pembayaran
              dikonfirmasi admin).
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Kode Booking"
                value={standaloneCode}
                onChange={(e) => setStandaloneCode(e.target.value)}
                className="flex-1 h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <button
                type="button"
                onClick={async () => {
                  const code = standaloneCode.trim().toUpperCase();
                  if (!code) {
                    alert("Masukkan kode booking.");
                    return;
                  }
                  let booking = null;
                  try {
                    const raw = localStorage.getItem("booking_" + code);
                    if (raw) booking = JSON.parse(raw);
                  } catch {
                    booking = null;
                  }
                  if (!booking) {
                    alert("Kode booking tidak ditemukan di perangkat ini.");
                    return;
                  }
                  if (localStorage.getItem("paid_" + code) !== "1") {
                    alert("Pembayaran belum dikonfirmasi admin.");
                    return;
                  }
                  await generateTicketPDF({ ...booking, isPaid: true });
                }}
                className="flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition shadow"
              >
                Download E-Tiket (PDF)
              </button>
            </div>
          </div>

          {/* Admin: tandai lunas by kode (paket) */}
          {adminMode && (
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl shadow-md p-6 md:p-8 border border-amber-200 dark:border-amber-800">
              <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-2">
                Admin — Tandai Lunas by Kode Booking (Paket)
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Kode Booking"
                  value={adminCodeInput}
                  onChange={(e) => setAdminCodeInput(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                <button
                  type="button"
                  onClick={() => {
                    const code = adminCodeInput.trim().toUpperCase();
                    if (!code) {
                      alert("Masukkan kode booking.");
                      return;
                    }
                    if (localStorage.getItem("paid_" + code) === "1") {
                      alert("Status sudah LUNAS. Kode " + code + " tidak dapat ditandai ulang.");
                      return;
                    }
                    localStorage.setItem("paid_" + code, "1");
                    try {
                      const raw = localStorage.getItem("booking_" + code);
                      if (raw) {
                        const b = JSON.parse(raw);
                        b.isPaid = true;
                        localStorage.setItem("booking_" + code, JSON.stringify(b));
                      }
                    } catch {
                      // ignore
                    }
                    alert("Kode " + code + " ditandai LUNAS.");
                    setAdminCodeInput("");
                  }}
                  className="flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition shadow"
                >
                  Tandai Lunas
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const code = adminCodeInput.trim().toUpperCase();
                    if (!code) {
                      alert("Masukkan kode booking.");
                      return;
                    }
                    if (localStorage.getItem("paid_" + code) !== "1") {
                      alert("Pembayaran belum dikonfirmasi (belum lunas).");
                      return;
                    }
                    let booking = null;
                    try {
                      const raw = localStorage.getItem("booking_" + code);
                      if (raw) booking = JSON.parse(raw);
                    } catch {
                      booking = null;
                    }
                    if (!booking) {
                      alert("Data booking tidak ada di perangkat ini.");
                      return;
                    }
                    await generateTicketPDF({ ...booking, isPaid: true });
                  }}
                  className="flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition shadow"
                >
                  Download E-Tiket (Admin)
                </button>
              </div>
            </div>
          )}
      </div>
    </section>
  );
}