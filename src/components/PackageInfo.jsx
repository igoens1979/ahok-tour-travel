import { useState } from "react";
import { PACKAGE_INFO } from "../data/packageData";

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

  const generateCode = () => "PKG-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const openForm = () => {
    if (!bookingCode) {
      setBookingCode(generateCode());
    }
    setShowForm((v) => !v);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 md:p-8 border border-transparent dark:border-gray-800 transition-colors">
        <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">
          {PACKAGE_INFO.title}
        </h3>
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
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-3">
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
                href={`https://wa.me/6281334987505?text=${encodeURIComponent(
                  `Halo Admin AHOK Tour & Travel, saya ingin kirim paket:\n\n- Kode Booking: ${bookingCode}\n- Nama: ${formData.name}\n- No Tlp/WA: ${formData.phone}\n- Jenis Barang/Berat: ${formData.goods}\n- Alamat Jemput: ${formData.pickup}\n- Alamat Tujuan: ${formData.destinationAddr}\n- Metode Pembayaran: ${formData.paymentMethod}\n\nMohon info tarif dan jadwal penjemputan. Terima kasih.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
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
                }}
                className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition shadow text-center"
              >
                Kirim Form Pemesanan ke Admin (WhatsApp)
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
