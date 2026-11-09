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
      <main>
        <TravelSearch />
        <PackageInfo />
      </main>
      <Footer />
    </div>
  );
}
