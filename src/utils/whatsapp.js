// Ganti dengan nomor WhatsApp admin yang aktif (format 628xxxxxxxxxx)
export const WHATSAPP_NUMBER = "6281334987505";

export const generateTravelWALink = (origin, destination, price, schedule) => {
  const priceText = price
    ? `Rp ${price.toLocaleString("id-ID")} / orang`
    : "Tlp/Chat Admin";
  const text = `Halo Admin AHOK Tour & Travel, saya ingin pesan tiket travel:

- *Rute:* ${origin} -> ${destination}
- *Jadwal:* ${schedule}
- *Harga:* ${priceText}

Mohon info ketersediaan kursi untuk rute ini. Terima kasih.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const generatePackageWALink = () => {
  const text = `Halo Admin AHOK Tour & Travel, saya ingin menanyakan informasi pengiriman paket/dokumen:

- *Kota Asal:* [Isi Kota Asal]
- *Kota Tujuan:* [Isi Kota Tujuan]
- *Jenis Barang / Berat:* [Isi Keterangan Barang]

Mohon informasi tarif dan jadwal penjemputan paket. Terima kasih.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};
