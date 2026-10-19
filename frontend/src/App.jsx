import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useGeolocation } from "./hooks/useGeolocation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import DashboardPage from "./components/DashboardPage";
import HostEventModal from "./components/HostEventModal";

function App() {
  const { user, loading } = useAuth();
  const { coords: userCoords, isExact: isExactLocation } = useGeolocation();
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f8fb]">
        <div className="grid size-12 place-items-center rounded-[14px_14px_14px_4px] bg-[#2f6f96] text-3xl font-bold tracking-[-3px] text-white animate-pulse mb-3">
          a
        </div>
        <p className="text-xs font-semibold text-[#17324d] tracking-wider uppercase">
          Loading AttendMyEvent...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-[320px] bg-[#f6f8fb] text-[#17212b] font-sans antialiased flex flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-top duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main Page Container */}
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[1240px] flex-1 flex flex-col sm:w-[calc(100%-2.5rem)]">
        {/* Navigation Bar */}
        <Navbar
          onOpenHostModal={() => setIsHostModalOpen(true)}
          onNavigateSection={(section) => {
            const el = document.getElementById(section);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Main Content: Landing Page when NOT logged in, Dashboard Page when logged in */}
        <main className="flex-1">
          {user ? (
            <DashboardPage
              userCoords={userCoords}
              isExactLocation={isExactLocation}
              onOpenHostModal={() => setIsHostModalOpen(true)}
            />
          ) : (
            <LandingPage onAuthSuccess={() => showToast("Welcome to AttendMyEvent!")} />
          )}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Host Event Modal */}
      <HostEventModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        userCoords={userCoords}
        onEventCreated={() => {
          showToast("🎉 Event published successfully! It's now live on the map.");
          // Trigger reload if on dashboard
          window.dispatchEvent(new Event("event-created"));
        }}
      />
    </div>
  );
}

export default App;