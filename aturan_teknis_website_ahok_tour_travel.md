# Spesifikasi Teknis & Aturan Pengembangan Website AHOK Tour & Travel

Dokumen ini merupakan panduan teknis dan aturan pengembangan untuk membangun website *Landing Page Single-Page Application (SPA)* **AHOK Tour & Travel**.

---

## 1. Ringkasan Teknis (Technical Overview)

| Parameter | Spesifikasi |
| :--- | :--- |
| **Tipe Aplikasi** | Single Page Application (SPA) / Landing Page |
| **Framework/Library** | React.js (Vite) |
| **Bahasa Pemrograman** | JavaScript (ES6+) atau TypeScript |
| **Styling Framework** | Tailwind CSS (Direkomendasikan untuk pengembangan cepat & responsif) |
| **Database** | *None* (Menggunakan Data Lokal / Constant File JSON) |
| **Integrasi Kontak** | WhatsApp Direct Link (URL Scheme `https://wa.me/`) |
| **Deployment** | Vercel / Netlify / GitHub Pages |

---

## 2. Struktur Proyek (Project Structure)

```text
ahok-tour-travel/
├── public/
│   ├── logo.png             # Logo AHOK Tour & Travel
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Section Logo & Tagline Utama
│   │   ├── TravelSearch.jsx # Form Pencarian & Display Jadwal Travel
│   │   ├── PackageInfo.jsx  # Section Informasi Pengiriman Paket
│   │   └── Footer.jsx       # Footer & Informasi Kontak
│   ├── data/
│   │   ├── travelData.js    # Data Hardcoded Rute, Jadwal, & Harga Travel
│   │   └── packageData.js   # Data Hardcoded Syarat & Ketentuan Paket
│   ├── utils/
│   │   └── whatsapp.js      # Generator Link WhatsApp Automatis
│   ├── App.jsx              # Komponen Utama Page
│   ├── main.jsx             # Entry Point Vite
│   └── index.css            # Styling Global / Tailwind Directives
├── package.json
└── vite.config.js
```

---

## 3. Tata Letak & Hirarki Antarmuka (UI/UX Layout)

Halaman ini hanya terdiri dari **1 Halaman (Single-Page)** yang disusun secara vertikal:

```
+-------------------------------------------------------+
|                    [ LOGO UTAMA ]                     |  <- Tengah
|                         AHOK                          |  <- Ukuran Besar / Bold
|                     Tour & Travel                     |  <- Ukuran Sedang
|         Travel Antar Kota & Pengiriman Paket          |  <- Ukuran Kecil (Muted)
+-------------------------------------------------------+
|                                                       |
|   [ SECTION 1: CARI JADWAL & HARGA TRAVEL ]           |
|   -------------------------------------------------   |
|   - Dropdown Kota Asal (Keberangkatan)                |
|   - Tombol Switch (Pulang Pergi / Tukar Rute)         |
|   - Dropdown Kota Tujuan                              |
|   - Button [ Cari Jadwal & Harga ]                    |
|                                                       |
|   * [Hasil Pencarian] (Muncul setelah tombol diklik): |
|     - Jam Keberangkatan (cth: 08:00, 14:00, 19:00)    |
|     - Harga Tiket (cth: Rp 150.000 / orang)           |
|     - CTA Button: [ Pesan Tiket via WhatsApp ]        |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|   [ SECTION 2: PENGIRIMAN PAKET & DOKUMEN ]           |
|   -------------------------------------------------   |
|   - Penjelasan Layanan Kirim Paket Antar Kota        |
|   - Fitur Layanan (Sameday / Express Door to Door)    |
|   - Ketentuan Ukuran/Berat & Estimasi Harga           |
|   - CTA Button: [ Kirim Paket via WhatsApp ]          |
|                                                       |
+-------------------------------------------------------+
|                        FOOTER                         |
+-------------------------------------------------------+
```

---

## 4. Rincian Komponen & Aturan Logika (Component Logic)

### 4.1 Header (Branding Section)
- **Posisi Alignment:** Center (Tengah secara vertikal & horizontal).
- **Elemen Display:**
  1. Image Logo (Ukuran responsif, max width ~120px-150px).
  2. `<h1>` Text: **AHOK** (Font bold, tegas, ukuran text 3xl/4xl).
  3. `<h2>` Text: **Tour & Travel** (Font semibold, ukuran 2xl).
  4. `<p>` Text: **Travel Antar Kota & Pengiriman Paket** (Font normal/muted, ukuran sm/base).

---

### 4.2 Form Cari Jadwal & Harga Travel (Travel Search Component)
- **Input State:**
  - `origin`: Kota Keberangkatan (Dropdown `<select>`).
  - `destination`: Kota Tujuan (Dropdown `<select>`).
  - `isSubmitted`: Boolean state untuk menayangkan hasil setelah pencarian.
- **Aturan Validasi:**
  - Jika Kota Keberangkatan dan Kota Tujuan **sama**, tampilkan pesan peringatan: *"Kota asal dan tujuan tidak boleh sama."*
  - Tombol **Switch / Reverse Route**: Pengguna dapat mengklik tombol panah bolak-balik untuk menukar `origin` dan `destination` dengan mudah.
- **Logika Hasil Pencarian:**
  - Saat tombol **"Cari Jadwal & Harga"** diklik:
    1. Sistem memfilter array data dari `travelData.js` sesuai pasangan `origin` & `destination`.
    2. Menampilkan kartu/tabel hasil berupa:
       - **Rute yang Dipilih** (cth: Jakarta -> Bandung)
       - **Pilihan Jam Keberangkatan** (list waktu)
       - **Harga per Kursi**
       - **Fasilitas Singkat** (Door-to-door, AC, Reclining Seat)
       - **CTA Button WhatsApp Direct Link**

---

### 4.3 Section Layanan Pengiriman Paket (Package Service Component)
- **Posisi:** Berada persis di bawah Section Travel.
- **Konten Display:**
  - **Judul Section:** Layanan Pengiriman Paket & Dokumen Cepat.
  - **Keunggulan Layanan:**
    - *Door-to-Door* (Penjemputan & Pengantaran sampai alamat).
    - *Pengiriman Sameday* (Tiba di hari yang sama mengikuti jadwal travel).
  - **Tabel/Daftar Estimasi Tarif Paket:**
    - Paket Kecil / Dokumen (1 - 5 kg)
    - Paket Sedang (6 - 10 kg)
    - Paket Besar / Khusus (Konsultasi via WA)
  - **CTA Button:** **[ Tanya / Kirim Paket via WhatsApp ]**

---

## 5. Struktur Data Lokal (Mock Data Standard)

Semua data tersimpan secara lokal pada file `src/data/travelData.js`.

### Contoh Skema `travelData.js`:
```javascript
export const ROUTES_DATA = [
  {
    id: "jkt-bdg",
    origin: "Jakarta",
    destination: "Bandung",
    price: 150000,
    schedules: ["08:00 WIB", "11:00 WIB", "15:00 WIB", "19:00 WIB"],
    facilities: ["Door to Door", "AC", "Captain Seat", "Via Tol"]
  },
  {
    id: "bdg-jkt",
    origin: "Bandung",
    destination: "Jakarta",
    price: 150000,
    schedules: ["08:00 WIB", "11:00 WIB", "15:00 WIB", "19:00 WIB"],
    facilities: ["Door to Door", "AC", "Captain Seat", "Via Tol"]
  },
  {
    id: "jkt-smg",
    origin: "Jakarta",
    destination: "Semarang",
    price: 350000,
    schedules: ["09:00 WIB", "20:00 WIB"],
    facilities: ["Door to Door", "AC", "Reclining Seat", "Full Tol Trans Jawa", "Makan 1x"]
  }
];

export const CITIES = ["Jakarta", "Bandung", "Semarang", "Surabaya", "Yogyakarta"];
```

---

## 6. Aturan Integrasi WhatsApp CTA (WhatsApp Message Generator)

Ketika tombol CTA pada **Travel** atau **Paket** diklik, aplikasi akan meredireksi pengguna langsung ke aplikasi/web WhatsApp dengan pesan otomatis yang sudah terformat.

**Nomor WhatsApp Admin:** `628xxxxxxxxxx` (Ganti dengan nomor aktif).

### 6.1 Format Pesan WhatsApp Tiket Travel
```javascript
const generateTravelWAMessage = (origin, destination, price, schedule) => {
  const text = `Halo Admin AHOK Tour & Travel, saya ingin pesan tiket travel:
  
- *Rute:* ${origin} -> ${destination}
- *Jadwal:* ${schedule}
- *Harga:* Rp ${price.toLocaleString('id-ID')} / orang

Mohon info ketersediaan kursi untuk rute ini. Terima kasih.`;

  return `https://wa.me/628xxxxxxxxxx?text=${encodeURIComponent(text)}`;
};
```

### 6.2 Format Pesan WhatsApp Pengiriman Paket
```javascript
const generatePackageWAMessage = () => {
  const text = `Halo Admin AHOK Tour & Travel, saya ingin menanyakan informasi pengiriman paket/dokumen:

- *Kota Asal:* [Isi Kota Asal]
- *Kota Tujuan:* [Isi Kota Tujuan]
- *Jenis Barang / Berat:* [Isi Keterangan Barang]

Mohon informasi tarif dan jadwal penjemputan paket. Terima kasih.`;

  return `https://wa.me/628xxxxxxxxxx?text=${encodeURIComponent(text)}`;
};
```

---

## 7. Ketentuan Styling & Design System

1. **Skema Warna (Color Palette):**
   - **Primary:** Navy Blue (`#1E3A8A` / Tailwind `blue-900`) -> Kesan terpercaya dan profesional.
   - **Secondary/Accent:** Amber/Yellow (`#F59E0B` / Tailwind `amber-500`) -> Menarik perhatian untuk tombol CTA.
   - **WhatsApp Brand Color:** Emerald Green (`#25D366` / Tailwind `emerald-500`) -> Khusus tombol aksi WhatsApp.
   - **Background:** Light Gray (`#F9FAFB` / Tailwind `gray-50`) -> Bersih dan nyaman dibaca.

2. **Responsivitas (Mobile-First Design):**
   - Tampilan wajib teroptimasi sempurna pada layar Smartphone (layar width 360px - 430px) karena mayoritas pengguna memesan travel melalui perangkat mobile.
   - Dropdown dan Button menggunakan ukuran touch-target yang cukup lebar (minimum height 44px).

---

## 8. Alur Pengujian & Validasi (Checklist)

- [ ] **Header:** Logo, Nama "AHOK", "Tour & Travel", dan Tagline "Travel Antar Kota & Pengiriman Paket" berada persis di tengah.
- [ ] **Form Dropdown:** Menampilkan list kota asal dan tujuan dengan benar.
- [ ] **Fitur Tukar Rute (Pulang Pergi):** Mengklik tombol tukar berhasil me-reverse nilai kota keberangkatan dan tujuan.
- [ ] **Pencarian:** Mengklik "Cari Jadwal & Harga" berhasil menampilkan jam keberangkatan, harga, dan tombol WhatsApp.
- [ ] **Validasi Rute:** Menampilkan warning jika kota asal = kota tujuan.
- [ ] **Section Paket:** Tampil di bawah pencarian travel dengan informasi layanan kirim paket yang jelas.
- [ ] **Redireksi WA:** Klik tombol WA membuka tab/app WhatsApp dengan template teks sesuai rute yang dipilih.
