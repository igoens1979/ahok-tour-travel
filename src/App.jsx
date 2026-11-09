import Header from "./components/Header";
import TravelSearch from "./components/TravelSearch";
import PackageInfo from "./components/PackageInfo";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      <Header />
      <div className="overflow-hidden bg-red-600 text-yellow-300 py-2 shadow">
        <div className="animate-marquee text-base md:text-lg font-extrabold tracking-wide">
          PROMO!! Pembayaran Tiket via Transfer DISCOUNT 10% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; PROMO!! Pembayaran Tiket via Transfer DISCOUNT 10% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>
      <main>
        <TravelSearch />
        <PackageInfo />
      </main>
      <Footer />
    </div>
  );
}
