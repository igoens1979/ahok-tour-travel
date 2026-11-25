import { useState, useEffect, useRef } from "react";

function getAdminMode() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ahok_admin") === "1";
}

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

async function generateTravelTicketPDF(booking) {
  const code = booking.code || booking.bookingCode;
  const isPaidFlag = booking.isPaid || localStorage.getItem("paid_" + code) === "1";
  const [{ jsPDF }, JsBarcode] = await Promise.all([
    import("jspdf"),
    import("jsbarcode").then((m) => m.default || m),
  ]);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const name = (booking.name || "Penumpang").trim() || "Penumpang";
  const count = Math.max(1, Number(booking.count) || 1);
  const schedule = booking.schedule || "";
  const price = booking.price;
  const extra = Number(booking.extraBaggage) || 0;
  const priceText = price ? `Rp ${price.toLocaleString("id-ID")} / orang` : "Chat Admin 24 Jam";
  const totalNum = (price ? price * count : 0) + extra;
  const totalText = price ? `Rp ${totalNum.toLocaleString("id-ID")}` : "Chat Admin 24 Jam";
  const facilities = Array.isArray(booking.facilities) ? booking.facilities : [];

  const logoData = await svgToPng("/logo.svg", 200, 200);
  const barcodeCanvas = document.createElement("canvas");
  JsBarcode(barcodeCanvas, code, { format: "CODE128", width: 2, height: 50, displayValue: true, fontSize: 12, margin: 4 });
  const barcodeData = barcodeCanvas.toDataURL("image/png");

  const pageW = 210;
  const margin = 15;
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageW, 32, "F");
  if (logoData) doc.addImage(logoData, "PNG", margin, 4, 24, 24);
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
  doc.text(code, margin, y + 9);
  doc.addImage(barcodeData, "PNG", pageW - margin - 70, y - 4, 70, 24);

  y += 22;
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  const rows = [
    ["Kode Booking", code],
    ["Nama Penumpang", name],
    ["No Tlp / WA", booking.phone || "-"],
    ["Jumlah", `${count} orang`],
    ["Rute", `${booking.origin} - ${booking.destination}`],
    ["Jadwal", schedule],
    ["Alamat Jemput", booking.pickup || "-"],
    ["Alamat Tujuan", booking.destinationAddr || "-"],
    ["Metode Bayar", booking.paymentMethod || "-"],
    ["Harga Tiket", priceText],
    ["Biaya Tambahan LB/Over Bagasi", extra ? `Rp ${extra.toLocaleString("id-ID")}` : "-"],
    ["Total", totalText],
    ["Fasilitas", facilities.join(", ") || "-"],
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
    "Persiapan 1 jam sebelum Jadwal keberangkatan.",
    "Harga dapat berubah jika membawa kelebihan Bagasi, dan Tujuan di Luar Batas pengantaran. Konsultasikan ke Admin.",
    "E-tiket ini merupakan bukti pemesanan. Konfirmasi ketersediaan kursi via WhatsApp Admin.",
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

  const _blob = doc.output("blob");
  const _url = URL.createObjectURL(_blob);
  return { doc, url: _url, filename: `E-Tiket-${code}.pdf` };
}

async function generatePackageTicketPDF(booking) {
  const code = booking.code || booking.bookingCode;
  const isPaidFlag = booking.isPaid || localStorage.getItem("paid_" + code) === "1";
  const [{ jsPDF }, JsBarcode] = await Promise.all([
    import("jspdf"),
    import("jsbarcode").then((m) => m.default || m),
  ]);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const logoData = await svgToPng("/logo.svg", 200, 200);
  const barcodeCanvas = document.createElement("canvas");
  JsBarcode(barcodeCanvas, code, { format: "CODE128", width: 2, height: 50, displayValue: true, fontSize: 12, margin: 4 });
  const barcodeData = barcodeCanvas.toDataURL("image/png");

  const pageW = 210;
  const margin = 15;

  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageW, 32, "F");
  if (logoData) doc.addImage(logoData, "PNG", margin, 4, 24, 24);
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
    ["Tanggal", booking.date || "-"],
    ["Jam", booking.time || "-"],
    ["Rute", booking.route || "-"],
    ["Nama Pengirim", booking.name || "-"],
    ["No Tlp / WA Pengirim", booking.phone || "-"],
    ["Nama Penerima", booking.recipientName || "-"],
    ["No Tlp / WA Penerima", booking.recipientPhone || "-"],
    ["Jenis Barang/Berat", booking.goods || "-"],
    ["Alamat Jemput", booking.pickup || "-"],
    ["Alamat Tujuan", booking.destinationAddr || "-"],
    ["Biaya", booking.cost ? `Rp ${Number(booking.cost).toLocaleString("id-ID")}` : "-"],
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

  const _blob2 = doc.output("blob");
  const _url2 = URL.createObjectURL(_blob2);
  return { doc, url: _url2, filename: `E-Tiket-Paket-${code}.pdf` };
}

export default function TicketDownload() {
  const [adminMode, setAdminMode] = useState(getAdminMode);
  const [ticketType, setTicketType] = useState("travel");
  const [code, setCode] = useState("");
  const [autoMsg, setAutoMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const adminCodeRef = useRef(null);
  const standaloneCodeRef = useRef(null);

  /* eslint-disable react(set-state-in-effect) */
  useEffect(() => {
    const sync = () => setAdminMode(localStorage.getItem("ahok_admin") === "1");
    window.addEventListener("ahok-admin-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ahok-admin-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  /* eslint-enable react(set-state-in-effect) */

  const handleDownload = async () => {
    const refVal = standaloneCodeRef.current ? standaloneCodeRef.current.value : "";
    const c = (refVal || code).trim().toUpperCase();
    if (!c) {
      alert("Masukkan kode booking.");
      return;
    }
    let booking = null;
    try {
      const raw = localStorage.getItem("booking_" + c);
      if (raw) booking = JSON.parse(raw);
    } catch {
      booking = null;
    }
    if (!booking) {
      alert("Kode booking tidak ditemukan di perangkat ini.");
      return;
    }
    if (localStorage.getItem("paid_" + c) !== "1") {
      alert("Pembayaran belum dikonfirmasi admin.");
      return;
    }
    let res;
    if (ticketType === "package" || (booking.type === "package")) {
      res = await generatePackageTicketPDF({ ...booking, isPaid: true });
    } else {
      res = await generateTravelTicketPDF({ ...booking, isPaid: true });
    }
    if (res && res.url) {
      setPreviewUrl(res.url);
      setPreviewDoc(res.doc);
      setPreviewName(res.filename);
      // attempt auto-download
      setTimeout(() => {
        try { res.doc.save(res.filename); } catch { /* ignore */ }
      }, 800);
    }
  };

  const handleMarkPaid = () => {
    const c = getAdminCode();
    if (!c) {
      alert("Masukkan kode booking.");
      return;
    }
    if (localStorage.getItem("paid_" + c) === "1") {
      alert("Status sudah LUNAS. Kode " + c + " tidak dapat ditandai ulang.");
      return;
    }
    localStorage.setItem("paid_" + c, "1");
    try {
      const raw = localStorage.getItem("booking_" + c);
      if (raw) {
        const b = JSON.parse(raw);
        b.isPaid = true;
        localStorage.setItem("booking_" + c, JSON.stringify(b));
      }
    } catch {
      // ignore
    }
  };

  const getAdminCode = () => {
    const refVal = adminCodeRef.current ? adminCodeRef.current.value : "";
    return (refVal || "").trim().toUpperCase();
  };

  // Apply paid link from URL (?dl=CODE&payload=BASE64) so passenger on another device can download
  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const dl = params.get("dl");
        if (!dl) return;
        const codeVal = dl.trim().toUpperCase();
        setCode(codeVal);
        const payload = params.get("p");
        if (payload) {
          try {
            const decoded = JSON.parse(atob(payload));
            if (decoded && decoded.b) {
              const b = decoded.b;
              const booking = {
                code: b.code || codeVal,
                type: b.type,
                name: b.n,
                phone: b.ph,
                recipientName: b.rn,
                recipientPhone: b.rp,
                goods: b.g,
                pickup: b.pk,
                destinationAddr: b.da,
                paymentMethod: b.pm,
                origin: b.o,
                destination: b.d,
                schedule: b.s,
                price: b.r,
                facilities: b.f,
                extraBaggage: b.eb,
                date: b.dt,
                time: b.tm,
                route: b.rt,
              };
              localStorage.setItem("booking_" + codeVal, JSON.stringify(booking));
            }
            if (decoded && decoded.p) {
              localStorage.setItem("paid_" + codeVal, "1");
            }
            if (decoded.b && decoded.b.type === "package") {
              setTicketType("package");
            } else if (decoded.b && decoded.b.type !== "package") {
              setTicketType("travel");
            }
          } catch {
            // ignore
          }
        }
        if (params.get("paid") === "1") {
          localStorage.setItem("paid_" + codeVal, "1");
        }
        // Auto-download after a short delay to allow state/localStorage to settle
        setAutoMsg("E-Tiket siap diunduh. Klik tombol Download di bawah (atau tunggu download otomatis).");
        // Attempt auto-download (may be blocked by browser; button remains as fallback)
        setTimeout(async () => {
          try {
            let booking = null;
            const raw = localStorage.getItem("booking_" + codeVal);
            if (raw) booking = JSON.parse(raw);
            if (!booking || localStorage.getItem("paid_" + codeVal) !== "1") return;
            let res;
            if (booking.type === "package") {
              res = await generatePackageTicketPDF({ ...booking, isPaid: true });
            } else {
              res = await generateTravelTicketPDF({ ...booking, isPaid: true });
            }
            if (res && res.url) {
              setPreviewUrl(res.url);
              setPreviewDoc(res.doc);
              setPreviewName(res.filename);
              // Open PDF directly in browser viewer (works on mobile & desktop)
              try { window.open(res.url, "_blank"); } catch { /* ignore */ }
              // attempt auto-download (may be blocked on mobile)
              setTimeout(() => {
                try { res.doc.save(res.filename); } catch { /* ignore */ }
              }, 600);
            }
          } catch {
            // ignore; user can click button
          }
        }, 600);
      } catch {
        // ignore
      }
    })();
  }, []);

  const generateDownloadLink = () => {
    const refVal = (adminCodeRef.current && adminCodeRef.current.value) || (standaloneCodeRef.current && standaloneCodeRef.current.value) || "";
    const c = (refVal || code).trim().toUpperCase();
    if (!c) {
      alert("Masukkan kode booking.");
      return;
    }
    if (localStorage.getItem("paid_" + c) !== "1") {
      alert("Tandai lunas terlebih dahulu sebelum membuat link download.");
      return;
    }
    let booking = null;
    try {
      const raw = localStorage.getItem("booking_" + c);
      if (raw) booking = JSON.parse(raw);
    } catch {
      booking = null;
    }
    const compact = {
      c,
      p: true,
      b: booking
        ? {
            code: booking.code,
            type: booking.type,
            n: booking.name,
            ph: booking.phone,
            rn: booking.recipientName,
            rp: booking.recipientPhone,
            g: booking.goods,
            pk: booking.pickup,
            da: booking.destinationAddr,
            pm: booking.paymentMethod,
            o: booking.origin,
            d: booking.destination,
            s: booking.schedule,
            r: booking.price,
            f: booking.facilities,
            eb: booking.extraBaggage,
            dt: booking.date,
            tm: booking.time,
            rt: booking.route,
          }
        : null,
    };
    let encoded = "";
    try {
      encoded = btoa(JSON.stringify(compact));
    } catch {
      encoded = "";
    }
    const url = `${window.location.origin}${window.location.pathname}?dl=${encodeURIComponent(c)}&p=${encodeURIComponent(encoded)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => alert("Link download disalin ke clipboard.\nBagikan ke penumpang via WhatsApp.")).catch(() => alert(url));
    } else {
      alert(url);
    }
  };

  const handleAdminDownload = async () => {
    const c = getAdminCode();
    if (!c) {
      alert("Masukkan kode booking.");
      return;
    }
    if (localStorage.getItem("paid_" + c) !== "1") {
      alert("Pembayaran belum dikonfirmasi (belum lunas).");
      return;
    }
    let booking = null;
    try {
      const raw = localStorage.getItem("booking_" + c);
      if (raw) booking = JSON.parse(raw);
    } catch {
      booking = null;
    }
    if (!booking) {
      alert("Data booking tidak ada di perangkat ini. Admin dapat membuat ulang dengan kode booking " + c + ".");
      return;
    }
    let res;
    if (ticketType === "package" || booking.type === "package") {
      res = await generatePackageTicketPDF({ ...booking, isPaid: true });
    } else {
      res = await generateTravelTicketPDF({ ...booking, isPaid: true });
    }
    if (res && res.url) {
      setPreviewUrl(res.url);
      setPreviewDoc(res.doc);
      setPreviewName(res.filename);
      setTimeout(() => {
        try { res.doc.save(res.filename); } catch { /* ignore */ }
      }, 800);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      {autoMsg && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold text-center">
          {autoMsg}
        </div>
      )}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 md:p-8 border border-transparent dark:border-gray-800 transition-colors">
        <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mb-1">
          Download E-Tiket
        </h3>
        {adminMode && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            Mode Admin aktif.
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Pilih jenis E-Tiket, masukkan Kode Booking, lalu unduh (setelah pembayaran
          dikonfirmasi admin).
        </p>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Jenis E-Tiket
          </label>
          <select
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option value="travel">Penumpang (Travel)</option>
            <option value="package">Pengiriman Paket</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Kode Booking"
            ref={standaloneCodeRef}
            defaultValue={code}
            className="flex-1 h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition shadow"
          >
            Download E-Tiket (PDF)
          </button>
        </div>

        {adminMode && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
              Admin — Tandai Lunas / Download by Kode Booking
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Kode Booking"
                ref={adminCodeRef}
                defaultValue=""
                className="flex-1 h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <button
                type="button"
                onClick={handleMarkPaid}
                className="flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition shadow"
              >
                Tandai Lunas
              </button>
              <button
                type="button"
                onClick={handleAdminDownload}
                className="flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition shadow"
              >
                Download (Admin)
              </button>
              <button
                type="button"
                onClick={generateDownloadLink}
                className="flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition shadow"
              >
                Salin Link Download (Admin)
              </button>
            </div>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Preview E-Tiket</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (previewDoc && previewName) {
                      try { previewDoc.save(previewName); } catch { /* ignore */ }
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => { setPreviewUrl(null); setPreviewDoc(null); setPreviewName(""); }}
                  className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
            <iframe src={previewUrl} className="w-full flex-1 min-h-[60vh]" title="E-Tiket PDF" />
          </div>
        </div>
      )}
    </section>
  );
}
