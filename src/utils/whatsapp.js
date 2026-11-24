// Ganti dengan nomor WhatsApp admin yang aktif (format 628xxxxxxxxxx)
export const WHATSAPP_NUMBER = "6281334987505";

export const generateTravelWALink = (origin, destination, price, schedule, bookingCode, extraBaggage) => {
  const priceText = price
    ? `Rp ${price.toLocaleString("id-ID")} / orang`
    : "Chat Admin 24 Jam";
  const extraText = extraBaggage ? `Rp ${Number(extraBaggage).toLocaleString("id-ID")}` : "-";
  const codeLine = bookingCode ? `- *Kode Booking:* ${bookingCode}\n` : "";
  const text = `Halo Admin AHOK Tour & Travel, saya ingin pesan tiket travel:

- *Rute:* ${origin} -> ${destination}
- *Jadwal:* ${schedule}
- *Harga:* ${priceText}
- *Biaya Tambahan LB/Over Bagasi:* ${extraText}
${codeLine}
Mohon info ketersediaan kursi untuk rute ini. Terima kasih.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const generateBookingWALink = (data) => {
  const priceText = data.price
    ? `Rp ${data.price.toLocaleString("id-ID")} / orang`
    : "Chat Admin 24 Jam";
  const extraText = data.extraBaggage ? `Rp ${Number(data.extraBaggage).toLocaleString("id-ID")}` : "-";
  const codeLine = data.bookingCode ? `- *Kode Booking:* ${data.bookingCode}\n` : "";
  const text = `Halo Admin AHOK Tour & Travel, saya ingin melakukan pemesanan travel:

- *Rute:* ${data.origin} -> ${data.destination}
- *Jadwal:* ${data.schedule}
- *Nama:* ${data.name}
- *No Tlp/WA:* ${data.phone}
- *Jumlah Penumpang:* ${data.count} orang
- *Alamat Jemput:* ${data.pickup}
- *Alamat Tujuan:* ${data.destinationAddr}
- *Harga:* ${priceText}
- *Biaya Tambahan LB/Over Bagasi:* ${extraText}
- *Metode Pembayaran:* ${data.paymentMethod}
${codeLine}
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