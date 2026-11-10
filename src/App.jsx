import Header from "./components/Header";
import TravelSearch from "./components/TravelSearch";
import PackageInfo from "./components/PackageInfo";
import TicketDownload from "./components/TicketDownload";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <ThemeToggle />
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-2">
        <div className="overflow-hidden text-red-600 dark:text-yellow-300 dark:drop-shadow-[0_0_6px_#facc15] font-extrabold text-sm md:text-base">
          <div className="animate-marquee tracking-wide">
            PROMO!! Pembayaran Tiket via Transfer DISCOUNT 10% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; PROMO!! Pembayaran Tiket via Transfer DISCOUNT 10% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
      </div>
      <main>
        <TravelSearch />
        <PackageInfo />
        <TicketDownload />
      </main>
      <Footer />
    </div>
  );
}
