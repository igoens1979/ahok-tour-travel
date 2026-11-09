import { useState } from "react";
import { ROUTES_DATA, CITIES } from "../data/travelData";
import { generateTravelWALink } from "../utils/whatsapp";

export default function TravelSearch() {
  const [origin, setOrigin] = useState(CITIES[0]);
  const [destination, setDestination] = useState(CITIES[1]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);

  const handleSwitch = () => {
    setOrigin(destination);
    setDestination(origin);
    setIsSubmitted(false);
    setResult(null);
    setError("");
  };

  const downloadTicket = async () => {
    if (!result) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const bookingCode = "AHOK-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const name = passengerName.trim() || "Penumpang";
    const count = Math.max(1, Number(passengerCount) || 1);
    const priceText = result.price
      ? `Rp ${result.price.toLocaleString("id-ID")} / orang`
      : "Tlp/Chat Admin";
    const totalText = result.price
      ? `Rp ${(result.price * count).toLocaleString("id-ID")}`
      : "Tlp/Chat Admin";

    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("AHOK Tour & Travel", 105, 14, { align: "center" });
    doc.setFontSize(11);
    doc.text("E-Tiket Travel", 105, 23, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let y = 45;
    const line = (label, value) => {
      doc.setFont(undefined, "bold");
      doc.text(label, 20, y);
      doc.setFont(undefined, "normal");
      doc.text(String(value), 70, y);
      y += 8;
    };

    line("Kode Booking:", bookingCode);
    line("Nama:", name);
    line("Jumlah:", `${count} orang`);
    line("Rute:", `${result.origin} -> ${result.destination}`);
    line("Jadwal:", selectedSchedule || result.schedules[0]);
    line("Harga:", priceText);
    line("Total:", totalText);
    line("Fasilitas:", result.facilities.join(", "));

    y += 4;
    doc.setDrawColor(30, 58, 138);
    doc.line(20, y, 190, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      "E-tiket ini merupakan bukti pemesanan. Konfirmasi ketersediaan kursi via WhatsApp Admin.",
      20,
      y,
      { maxWidth: 170 }
    );
    y += 12;
    doc.text("Terima kasih telah memilih AHOK Tour & Travel.", 20, y);

    doc.save(`E-Tiket-${bookingCode}.pdf`);
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
    setResult(route || null);
    setSelectedSchedule(route ? route.schedules[0] : "");
    setIsSubmitted(true);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8 transition-colors">
        <div className="overflow-hidden rounded-lg bg-red-600 text-yellow-300 py-2 mb-4 shadow">
          <div className="animate-marquee text-base md:text-lg font-extrabold tracking-wide">
            PROMO!! Pembayaran Tiket via Transfer DISCOUNT 10% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; PROMO!! Pembayaran Tiket via Transfer DISCOUNT 10% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mb-1">
          Cari Jadwal &amp; Harga Travel
        </h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <p className="text-sm font-medium text-gray-700 mb-2">
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
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fasilitas:</p>
              <div className="flex flex-wrap gap-2">
                {result.facilities.map((f) => (
                  <span
                    key={f}
                    className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-900"
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
                selectedSchedule
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
              <button
                type="button"
                onClick={downloadTicket}
                className="flex items-center justify-center w-full min-h-[48px] px-4 py-2 rounded-lg bg-blue-900 text-white text-sm md:text-base font-semibold hover:bg-blue-800 transition shadow text-center"
              >
                Download E-Tiket (PDF)
              </button>
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
