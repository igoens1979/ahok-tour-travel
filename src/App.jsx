import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import TravelSearch from "./components/TravelSearch";
import PackageInfo from "./components/PackageInfo";
import TicketDownload from "./components/TicketDownload";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";
import AdminTutorial from "./components/AdminTutorial";
import { isAdminMode, setAdminMode, promptAdminPassword, toggleAdminMode } from "./utils/adminMode";

export default function App() {
  useEffect(() => {
    // URL params
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "0") {
        setAdminMode(false);
      }
      if (params.get("admin") === "1" && !isAdminMode()) {
        promptAdminPassword();
      }
    } catch {
      // ignore
    }
    // Keyboard shortcut
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "M" || e.key === "m")) {
        e.preventDefault();
        toggleAdminMode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <ThemeToggle />
      <AdminTutorial />
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
    </ErrorBoundary>
  );
}