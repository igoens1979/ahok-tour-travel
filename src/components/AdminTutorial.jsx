import { useState, useEffect } from "react";

export default function AdminTutorial() {
  const [adminMode, setAdminMode] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        setAdminMode(localStorage.getItem("ahok_admin") === "1");
      } catch {
        setAdminMode(false);
      }
    };
    sync();
    window.addEventListener("ahok-admin-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ahok-admin-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!adminMode) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 h-10 px-3 rounded-full bg-amber-500 text-white text-xs font-semibold shadow hover:bg-amber-600 transition"
      >
        Tutorial Admin
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300">
                Tutorial Admin — AHOK Tour &amp; Travel
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <section>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-1">1. Cara Membuat E-Tiket (Tanpa Database)</h3>
                <p>Sistem tidak menggunakan database. Semua data pemesanan disimpan di localStorage browser per perangkat. Alur:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Penumpang mengisi <b>Form Pemesanan</b> di website (travel atau paket) dan mengirim ke admin via WhatsApp.</li>
                  <li>Admin menerima data, mengecek pembayaran.</li>
                  <li>Admin masuk <b>Mode Admin</b> (triple-tap logo / <code>?admin=1</code> / Ctrl+Shift+M, password: <code>ahokadmin</code>).</li>
                  <li>Di section <b>Download E-Tiket</b>, masukkan <b>Kode Booking</b> → klik <b>Tandai Lunas</b>. Status tersimpan di localStorage perangkat admin.</li>
                  <li>Klik <b>Salin Link Download (Admin)</b> untuk menyalin link download.</li>
                  <li>Kirim link tersebut ke penumpang via WhatsApp. Penumpang klik link → E-Tiket (PDF) otomatis terunduh dengan watermark LUNAS.</li>
                </ol>
              </section>

              <section>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-1">2. Jika Penumpang Ganti Perangkat</h3>
                <p>Karena data tersimpan di localStorage perangkat, penumpang yang ganti perangkat tidak bisa langsung download. Solusi:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Admin mengirimkan <b>file E-Tiket (PDF)</b> langsung via WhatsApp (admin download di perangkat admin lalu kirim file).</li>
                  <li>Atau admin mengirimkan <b>Link Download</b> (Salin Link Download) yang berisi data + status lunas, sehingga penumpang bisa download di perangkat baru.</li>
                  <li>Atau admin membuat ulang pemesanan di perangkat admin dengan Kode Booking yang sama, tandai lunas, lalu download &amp; kirim.</li>
                </ul>
                <p className="mt-1 text-xs italic">Untuk keandalan jangka panjang (multi-device), disarankan menambah backend (Supabase).</p>
              </section>

              <section>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-1">3. Kode Booking</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Penumpang (Travel): prefix <code>AHOK-XXXXXX</code></li>
                  <li>Pengiriman Paket: prefix <code>PKG-XXXXXX</code></li>
                  <li>Kode dibuat otomatis saat form disubmit. Kode ini menjadi kunci untuk download &amp; verifikasi pembayaran.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-1">4. Status Pembayaran</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Kode yang sudah ditandai LUNAS tidak dapat ditandai ulang (muncul notif “Status sudah LUNAS”).</li>
                  <li>E-Tiket PDF menampilkan watermark LUNAS (hijau transparan) jika status lunas.</li>
                  <li>Penumpang hanya bisa download jika status lunas.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-1">5. Rute &amp; Harga</h3>
                <p>Rute dengan harga tetap (Malang-Kediri, Malang-Madiun, dll.) tampil harga &amp; jadwal. Rute lainnya menampilkan “Chat Admin 24 Jam” — penumpang chat admin dulu untuk info, lalu isi form dengan jadwal/harga konfirmasi.</p>
              </section>

              <section>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-1">6. Mode Gelap / Terang</h3>
                <p>Tombol bulat pojok kanan atas untuk toggle tema. Preferensi disimpan di localStorage.</p>
              </section>

              <section>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-1">7. Akses Admin</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Desktop: <code>Ctrl + Shift + M</code> atau URL <code>?admin=1</code></li>
                  <li>Smartphone: triple-tap logo AHOK atau URL <code>?admin=1</code></li>
                  <li>Keluar: triple-tap logo lagi / URL <code>?admin=0</code> / Ctrl+Shift+M</li>
                  <li>Password: <code>ahokadmin</code></li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-1">8. Kontak &amp; Pembayaran</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>WhatsApp: +6281334987505</li>
                  <li>Email: ahoksugiarto.325@gmail.com</li>
                  <li>BCA: 1250864121</li>
                  <li>DANA &amp; GoPay: 6281334987505</li>
                </ul>
              </section>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}