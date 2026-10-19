import WelcomeBanner from "./WelcomeBanner";
import AuthSection from "./AuthSection";

export default function LandingPage({ onAuthSuccess }) {
  return (
    <div className="space-y-12 pb-12">
      {/* 1. Welcome Banner */}
      <WelcomeBanner />

      {/* 2. Login / Sign Up Section */}
      <AuthSection onAuthSuccess={onAuthSuccess} />

      {/* 3. App Details & Capabilities */}
      <section id="features" className="py-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-[10px] font-bold tracking-[1.5px] text-[#2f6f96] uppercase">
            WHY ATTENDMYEVENT
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#17324d] mt-1 tracking-tight">
            Discover what’s happening. Host what’s next.
          </h2>
          <p className="text-xs sm:text-sm text-[#657384] mt-2 leading-relaxed">
            From informal terrace music sessions and weekend sports to cultural festivals
            and community celebrations—find your tribe right around the corner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#dce3ea] bg-white p-6 shadow-xs hover:border-[#a9c6d7] transition-colors">
            <span className="grid size-12 place-items-center rounded-xl bg-sky-50 text-2xl text-[#2f6f96] mb-4">
              🗺️
            </span>
            <h3 className="text-base font-semibold text-[#17324d] mb-1.5">
              Interactive Map Discovery
            </h3>
            <p className="text-xs text-[#657384] leading-relaxed">
              Explore your city visually. Our live map reveals all public gatherings, tournaments,
              exhibitions, and community visits within your radius.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce3ea] bg-white p-6 shadow-xs hover:border-[#a9c6d7] transition-colors">
            <span className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-2xl text-emerald-600 mb-4">
              ⏱️
            </span>
            <h3 className="text-base font-semibold text-[#17324d] mb-1.5">
              Live Temporal Status
            </h3>
            <p className="text-xs text-[#657384] leading-relaxed">
              Never miss out or arrive late. Clear indicators tell you if an event is starting soon,
              happening right now, or upcoming this weekend.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce3ea] bg-white p-6 shadow-xs hover:border-[#a9c6d7] transition-colors">
            <span className="grid size-12 place-items-center rounded-xl bg-amber-50 text-2xl text-[#f4a340] mb-4">
              🎉
            </span>
            <h3 className="text-base font-semibold text-[#17324d] mb-1.5">
              Flexible Event Hosting
            </h3>
            <p className="text-xs text-[#657384] leading-relaxed">
              Host your own event in minutes with simple map location tagging, rich text formatting,
              attendee notes, contact info, and custom instructions.
            </p>
          </div>
        </div>
      </section>

      {/* Community Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-[#17324d] to-[#24577a] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold mb-1 tracking-tight">
            Ready to bring people together?
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 max-w-lg leading-relaxed">
            Create your account today to discover gatherings near you, RSVP, and share your own community plans.
          </p>
        </div>
        <a
          href="#auth-section"
          className="rounded-xl bg-[#f4a340] px-6 py-3 text-xs sm:text-sm font-bold text-[#17324d] shadow-md hover:bg-[#ffb356] transition-colors shrink-0"
        >
          Get Started Free ↗
        </a>
      </section>
    </div>
  );
}

