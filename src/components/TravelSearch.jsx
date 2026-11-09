import { useState } from "react";
import { ROUTES_DATA, CITIES } from "../data/travelData";
import { generateTravelWALink } from "../utils/whatsapp";

const ADMIN_PASSWORD = "ahokadmin";

export default function TravelSearch() {
  const [origin, setOrigin] = useState("Malang");
  const [destination, setDestination] = useState("Kediri");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [bookingCode, setBookingCode] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [adminMode, setAdminMode] = useState(
    () => (typeof window !== "undefined" ? localStorage.getItem("ahok_admin") === "1" : false)
  );

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

  const handleSwitch = () => {
    setOrigin(destination);
    setDestination(origin);
    setIsSubmitted(false);
    setResult(null);
    setError("");
    setBookingCode("");
    setIsPaid(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (origin === destination) {
      setError("Kota asal dan tujuan tidak boleh sama.");
      setIsSubmitted(true);
      return;
    }
    const route = ROUTES_DATA.find(
      (r) => r.origin === origin && r.destination === destination
    );
    const code = "AHOK-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setResult(route || null);
    setSelectedSchedule(route ? route.schedules[0] : "");
    setBookingCode(route ? code : "");
    setIsPaid(route ? localStorage.getItem("paid_" + code) === "1" : false);
    setIsSubmitted(true);
  };

  const markPaid = () => {
    if (!bookingCode) return;
    localStorage.setItem("paid_" + bookingCode, "1");
    setIsPaid(true);
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

  const downloadTicket = async () => {
    if (!result || !isPaid) return;
    const [{ jsPDF }, JsBarcode] = await Promise.all([
      import("jspdf"),
      import("jsbarcode").then((m) => m.default || m),
    ]);
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const name = passengerName.trim() || "Penumpang";
    const count = Math.max(1, Number(passengerCount) || 1);
    const schedule = selectedSchedule || result.schedules[0];
    const priceText = result.price
      ? `Rp ${result.price.toLocaleString("id-ID")} / orang`
      : "Tlp/Chat Admin";
    const totalText = result.price
      ? `Rp ${(result.price * count).toLocaleString("id-ID")}`
      : "Tlp/Chat Admin";

    const logoData = await svgToPng("/logo.svg", 200, 200);

    const barcodeCanvas = document.createElement("canvas");
    JsBarcode(barcodeCanvas, bookingCode, {
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
    doc.text("E-TIKET / BOARDING PASS", margin + 28, 22);

    let y = 42;
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("KODE BOOKING", margin, y);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text(bookingCode, margin, y + 9);

    doc.addImage(barcodeData, "PNG", pageW - margin - 70, y - 4, 70, 24);

    y += 22;
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    const rows = [
      ["Nama Penumpang", name],
      ["Jumlah", `${count} orang`],
      ["Rute", `${result.origin} - ${result.destination}`],
      ["Jadwal", schedule],
      ["Harga Tiket", priceText],
      ["Total", totalText],
      ["Fasilitas", result.facilities.join(", ")],
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

    y += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    const notes = [
      "Persiapan 1 jam sebelum Jadwal keberangkatan.",
      "Harga dapat berubah jika membawa kelebihan Bagasi, dan Tujuan di Luar Batas pengantaran. Konsultasikan ke Admin.",
      "E-tiket ini merupakan bukti pemesanan. Konfirmasi ketersediaan kursi via WhatsApp Admin.",
      "Harap tiba di titik penjemputan 15 menit sebelum jadwal keberangkatan.",
      "Tunjukkan e-tiket (cetak/HP) dan kode booking saat proses boarding.",
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
    doc.text("AHOK Tour & Travel  •  Travel Antar Kota & Pengiriman Paket  •  WA: +6281334987505", pageW / 2, 293, { align: "center" });

    doc.save(`E-Tiket-${bookingCode}.pdf`);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8 transition-colors">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300">
            Cari Jadwal &amp; Harga Travel
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
            Mode Admin aktif — Anda dapat menandai pembayaran lunas.
          </div>
        )}
        <div className="overflow-hidden rounded-lg bg-red-600 text-yellow-300 py-2 mb-4 shadow">
          <div className="animate-marquee text-base md:text-lg font-extrabold tracking-wide">
            PROMO!! Pembayaran Tiket via Transfer DISCOUNT 10% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; PROMO!! Pembayaran Tiket via Transfer DISCOUNT 10% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Pilih kota asal dan tujuan untuk melihat jadwal keberangkatan &amp; harga tiket.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kota Asal (Keberangkatan)
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full h-12 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSwitch}
              aria-label="Tukar rute"
              className="h-12 w-12 mx-auto md:mx-0 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kota Tujuan
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-12 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition shadow"
          >
            Cari Jadwal &amp; Harga
          </button>
        </form>

        {isSubmitted && error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {isSubmitted && !error && result && (
          <div className="mt-6 border border-gray-200 dark:border-gray-600 rounded-xl p-5 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <h4 className="text-lg font-bold text-blue-900 dark:text-blue-300">
                {result.origin} → {result.destination}
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-lg font-bold text-amber-600 whitespace-nowrap">
                  {result.price
                    ? `Rp ${result.price.toLocaleString("id-ID")} / orang`
                    : "Tlp/Chat Admin"}
                </span>
                {result.promo && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 w-fit">
                    Promo: {result.promo}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih Jam Keberangkatan:
              </p>
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
                {result.schedules.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSchedule(s)}
                    className={`px-2 py-2 rounded-lg text-xs md:text-sm font-medium border transition ${
                      selectedSchedule === s
                        ? "bg-blue-900 text-white border-blue-900"
                        : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:border-blue-900"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fasilitas:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.facilities.map((f) => (
                  <span
                    key={f}
                    className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={generateTravelWALink(
                result.origin,
                result.destination,
                result.price,
                selectedSchedule,
                bookingCode
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full min-h-[48px] px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm md:text-base font-semibold hover:bg-emerald-600 transition shadow text-center"
            >
              Tanya / Pesan Tiket via WhatsApp
            </a>

            <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Penumpang (untuk E-Tiket PDF)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Nama Penumpang"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Jumlah"
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              {isPaid ? (
                <button
                  type="button"
                  onClick={downloadTicket}
                  className="flex items-center justify-center w-full min-h-[48px] px-4 py-2 rounded-lg bg-blue-900 text-white text-sm md:text-base font-semibold hover:bg-blue-800 transition shadow text-center"
                >
                  Download E-Tiket (PDF)
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex items-center justify-center w-full min-h-[48px] px-4 py-2 rounded-lg bg-gray-400 text-white text-sm md:text-base font-semibold cursor-not-allowed shadow text-center"
                >
                  Download E-Tiket (Menunggu Pembayaran)
                </button>
              )}

              {adminMode && !isPaid && (
                <button
                  type="button"
                  onClick={markPaid}
                  className="mt-2 flex items-center justify-center w-full min-h-[40px] px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition shadow text-center"
                >
                  Tandai Lunas (Admin)
                </button>
              )}
              {isPaid && (
                <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 text-center">
                  Pembayaran lunas — E-Tiket siap diunduh. Kode: {bookingCode}
                </p>
              )}
            </div>
          </div>
        )}

        {isSubmitted && !error && !result && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm border border-yellow-200 dark:border-yellow-800">
            Maaf, rute {origin} → {destination} belum tersedia. Silakan hubungi admin
            via WhatsApp untuk info lebih lanjut.
          </div>
        )}
      </div>
    </section>
  );
}

