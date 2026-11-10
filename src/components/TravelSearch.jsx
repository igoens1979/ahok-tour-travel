import { useState, useEffect } from "react";
import { ROUTES_DATA, CITIES } from "../data/travelData";
import { generateBookingWALink } from "../utils/whatsapp";

const ADMIN_PASSWORD = "ahokadmin";

export default function TravelSearch() {
  const [origin, setOrigin] = useState("Malang");
  const [destination, setDestination] = useState("Kediri");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState("");

  const [bookingCode, setBookingCode] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    count: 1,
    pickup: "",
    destinationAddr: "",
    paymentMethod: "Transfer",
  });

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

  // eslint-disable-next-line react-hooks/exhaustive-deps, react(set-state-in-effect)
  useEffect(() => {
    // Hidden admin access via URL param ?admin=1
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "0") {
        localStorage.removeItem("ahok_admin");
        setAdminMode(false);
        return;
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
    // Hidden admin access via keyboard shortcut Ctrl+Shift+M
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "M" || e.key === "m")) {
        e.preventDefault();
        toggleAdminMode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminMode]);

  const handleSwitch = () => {
    setOrigin(destination);
    setDestination(origin);
    setIsSubmitted(false);
    setResult(null);
    setError("");
    setBookingCode("");

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
    setSelectedSchedule("");
    setBookingCode(route ? code : "");

    setIsSubmitted(true);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 md:p-8 transition-colors border border-transparent dark:border-gray-800">
        <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mb-1">
          Cari Jadwal &amp; Harga Travel
        </h3>
        {adminMode && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            Mode Admin aktif — Anda dapat menandai pembayaran lunas. (Ctrl+Shift+M untuk keluar)
          </div>
        )}
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
                Pilih Jam Keberangkatan: <span className="text-red-500">*</span>
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
              {!selectedSchedule && (
                <p className="mt-2 text-xs text-red-500">
                  Jam keberangkatan harus dipilih sebelum melanjutkan.
                </p>
              )}
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

            <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4 space-y-3">
              {/* Form Pemesanan */}
              <button
                type="button"
                onClick={() => setShowForm((v) => !v)}
                className="flex items-center justify-center w-full min-h-[44px] px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm md:text-base font-semibold hover:bg-indigo-700 transition shadow text-center"
              >
                {showForm ? "Tutup Form Pemesanan" : "Form Pemesanan"}
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
                      Nama
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
                      Jumlah Penumpang
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.count}
                      onChange={(e) => setFormData({ ...formData, count: e.target.value })}
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
                    href={generateBookingWALink({
                      bookingCode,
                      name: formData.name,
                      phone: formData.phone,
                      count: formData.count,
                      pickup: formData.pickup,
                      destinationAddr: formData.destinationAddr,
                      paymentMethod: formData.paymentMethod,
                      origin,
                      destination,
                      schedule: selectedSchedule || (result ? result.schedules[0] : ""),
                      price: result ? result.price : null,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!selectedSchedule) {
                        e.preventDefault();
                        alert("Jam keberangkatan harus dipilih.");
                        return;
                      }
                      if (!formData.name || !formData.phone || !formData.pickup || !formData.destinationAddr) {
                        e.preventDefault();
                        alert("Lengkapi form pemesanan (Nama, No Tlp/WA, Alamat Jemput, Alamat Tujuan).");
                        return;
                      }
                      try {
                        localStorage.setItem(
                          "booking_" + bookingCode,
                          JSON.stringify({
                            code: bookingCode,
                            name: formData.name,
                            phone: formData.phone,
                            count: formData.count,
                            pickup: formData.pickup,
                            destinationAddr: formData.destinationAddr,
                            paymentMethod: formData.paymentMethod,
                            origin,
                            destination,
                            schedule: selectedSchedule,
                            price: result ? result.price : null,
                          })
                        );
                      } catch {
                        // ignore
                      }
                    }}
                    className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition shadow text-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Kirim Form Pemesanan ke Admin (WhatsApp)
                  </a>
                </div>
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

