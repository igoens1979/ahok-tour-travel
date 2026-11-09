// Ganti dengan nomor WhatsApp admin yang aktif (format 628xxxxxxxxxx)
export const WHATSAPP_NUMBER = "6281334987505";

export const generateTravelWALink = (origin, destination, price, schedule, bookingCode) => {
  const priceText = price
    ? `Rp ${price.toLocaleString("id-ID")} / orang`
    : "Tlp/Chat Admin";
  const codeLine = bookingCode ? `- *Kode Booking:* ${bookingCode}\n` : "";
  const text = `Halo Admin AHOK Tour & Travel, saya ingin pesan tiket travel:

- *Rute:* ${origin} -> ${destination}
- *Jadwal:* ${schedule}
- *Harga:* ${priceText}
${codeLine}
Mohon info ketersediaan kursi untuk rute ini. Terima kasih.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const generateBookingWALink = (data) => {
  const priceText = data.price
    ? `Rp ${data.price.toLocaleString("id-ID")} / orang`
    : "Tlp/Chat Admin";
  const text = `Halo Admin AHOK Tour & Travel, saya ingin melakukan pemesanan travel:

- *Kode Booking:* ${data.bookingCode}
- *Nama:* ${data.name}
- *No Tlp/WA:* ${data.phone}
- *Jumlah Penumpang:* ${data.count} orang
- *Rute:* ${data.origin} -> ${data.destination}
- *Jadwal:* ${data.schedule}
- *Alamat Jemput:* ${data.pickup}
- *Alamat Tujuan:* ${data.destinationAddr}
- *Metode Pembayaran:* ${data.paymentMethod}
- *Harga:* ${priceText}

Mohon konfirmasi ketersediaan kursi dan pembayaran. Terima kasih.`;

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
