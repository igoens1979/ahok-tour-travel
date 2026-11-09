import { PACKAGE_INFO } from "../data/packageData";
import { generatePackageWALink } from "../utils/whatsapp";

export default function PackageInfo() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8 transition-colors">
        <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">
          {PACKAGE_INFO.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{PACKAGE_INFO.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {PACKAGE_INFO.features.map((f) => (
            <div
              key={f.title}
              className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700"
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
                  className={i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}
                >
                  <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                    {p.category}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">{p.weight}</td>
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

        <a
          href={generatePackageWALink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full min-h-[48px] px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm md:text-base font-semibold hover:bg-emerald-600 transition shadow text-center"
        >
          Tanya / Kirim Paket via WhatsApp
        </a>
      </div>
    </section>
  );
}
