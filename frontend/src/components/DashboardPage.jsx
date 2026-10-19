import { useState, useMemo, useEffect } from "react";
import { CATEGORIES } from "../constants/events";
import { eventsService } from "../services/eventsService";
import { sortEventsByProximity } from "../utils/distance";
import MapView from "./map/MapView";
import EventCard from "./EventCard";
import EventDetailsModal from "./EventDetailsModal";

export default function DashboardPage({
  userCoords,
  isExactLocation,
  onOpenHostModal,
}) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsModalEvent, setDetailsModalEvent] = useState(null);

  // Fetch events
  async function loadEvents() {
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await eventsService.getEvents();
      setEvents(data || []);
    } catch (err) {
      setLoadError(err.message || "Failed to load events.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();

    function handleEventCreated() {
      loadEvents();
    }
    window.addEventListener("event-created", handleEventCreated);
    return () => {
      window.removeEventListener("event-created", handleEventCreated);
    };
  }, []);

  // Filter & sort by proximity from user location
  const sortedAndFilteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = events.filter((ev) => {
      const matchCat =
        category === "All categories" || ev.category === category;
      const matchSearch =
        !q ||
        `${ev.title} ${ev.category} ${ev.venue_name} ${ev.description} ${ev.address_text}`
          .toLowerCase()
          .includes(q);
      return matchCat && matchSearch;
    });

    return sortEventsByProximity(filtered, userCoords);
  }, [events, search, category, userCoords]);

  return (
    <div className="py-6 space-y-5">
      {/* Search, Filter & Host Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Search input & Category */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl">
          <label className="flex h-11 flex-1 items-center gap-2.5 rounded-xl border border-[#dce3ea] bg-white px-3.5 text-[#718094] shadow-2xs focus-within:ring-2 focus-within:ring-[#2f6f96]/20">
            <span className="text-lg leading-none" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              placeholder="Search events by title, venue, vibes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs sm:text-sm text-[#17324d] outline-none placeholder:text-slate-400"
            />
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 rounded-xl border border-[#dce3ea] bg-white px-3 text-xs sm:text-sm font-medium text-[#17324d] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#2f6f96]/20"
          >
            <option>All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={loadEvents}
            disabled={isLoading}
            className="h-11 px-3 rounded-xl border border-[#dce3ea] bg-white text-xs font-semibold text-[#556575] hover:bg-[#f3f8fb] transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
            title="Refresh events"
          >
            <span className={isLoading ? "animate-spin" : ""}>↻</span>
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>

        {/* Right: Host Event Button */}
        <button
          type="button"
          onClick={onOpenHostModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2f6f96] px-5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#245b7c] transition-colors shrink-0"
        >
          <span className="text-base font-bold leading-none">+</span>
          <span>Host an Event</span>
        </button>
      </div>

      {/* Location notice if using default coordinates */}
      {!isExactLocation && (
        <div className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-2 text-xs text-[#2f6f96] flex items-center justify-between">
          <span>
            📍 Showing events around {userCoords?.label || "your region"}. Enable device
            location for exact proximity sorting.
          </span>
        </div>
      )}

      {/* Main Layout: 2 Divs Side by Side */}
      {/* Left (Bigger): Map Layout | Right: Events List in card format */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT DIV: MAP LAYOUT (7 cols on lg screens ~ 58%) */}
        <section
          className="lg:col-span-7 flex flex-col rounded-2xl bg-white border border-[#dce3ea] p-4 shadow-sm"
          aria-label="Map discovery"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold tracking-[1.25px] text-[#778595] uppercase">
                EXPLORE NEARBY
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-[#17324d] tracking-tight">
                Events on Map
              </h2>
            </div>

            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {sortedAndFilteredEvents.length} pins visible
            </span>
          </div>

          {/* Leaflet Map with custom event markers */}
          <div className="h-[460px] sm:h-[540px] w-full">
            <MapView
              events={sortedAndFilteredEvents}
              userCoords={userCoords}
              selectedEvent={selectedEvent}
              onSelectEvent={(ev) => {
                setSelectedEvent(ev);
                setDetailsModalEvent(ev);
              }}
            />
          </div>
        </section>

        {/* RIGHT DIV: LIST OF EVENTS IN CARD FORMAT (5 cols on lg screens ~ 42%) */}
        <section
          className="lg:col-span-5 flex flex-col rounded-2xl bg-white border border-[#dce3ea] p-4 shadow-sm"
          aria-label="Nearby events list"
        >
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <div>
              <p className="text-[10px] font-bold tracking-[1.25px] text-[#778595] uppercase">
                SORTED BY PROXIMITY
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-[#17324d] tracking-tight">
                Nearby Events
              </h2>
            </div>
            <span className="text-xs font-bold text-[#2f6f96] bg-[#e8f2f8] px-2.5 py-1 rounded-full">
              {sortedAndFilteredEvents.length} found
            </span>
          </div>

          {/* Scrollable event cards container */}
          <div className="events-scroll space-y-3 max-h-[500px] sm:max-h-[530px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-16 text-center text-slate-400">
                <div className="inline-block size-8 animate-spin rounded-full border-3 border-slate-300 border-t-[#2f6f96] mb-3" />
                <p className="text-xs font-medium">Finding events around you...</p>
              </div>
            ) : loadError ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 text-center">
                <p className="font-semibold mb-1">Could not load events</p>
                <p>{loadError}</p>
                <button
                  type="button"
                  onClick={loadEvents}
                  className="mt-3 text-xs font-bold text-[#2f6f96] underline"
                >
                  Try again
                </button>
              </div>
            ) : sortedAndFilteredEvents.length > 0 ? (
              sortedAndFilteredEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isSelected={selectedEvent?.id === ev.id}
                  userCoords={userCoords}
                  onSelect={(selected) => {
                    setSelectedEvent(selected);
                    setDetailsModalEvent(selected);
                  }}
                  onFocusMap={(selected) => {
                    setSelectedEvent(selected);
                  }}
                />
              ))
            ) : (
              <div className="py-14 text-center px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <span className="text-3xl block mb-2">🎈</span>
                <h4 className="text-sm font-semibold text-[#17324d] mb-1">
                  No events found in this view
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                  {search || category !== "All categories"
                    ? "Try adjusting your search keywords or category filters."
                    : "Be the first person to create an event for your community!"}
                </p>
                <button
                  type="button"
                  onClick={onOpenHostModal}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2f6f96] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#245b7c]"
                >
                  <span>+ Host an event</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick host button banner at the bottom of the right panel */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Got something happening?
            </span>
            <button
              type="button"
              onClick={onOpenHostModal}
              className="text-xs font-bold text-[#2f6f96] hover:underline"
            >
              + Host Event
            </button>
          </div>
        </section>
      </div>

      {/* Event Details Modal Popup */}
      {detailsModalEvent && (
        <EventDetailsModal
          event={detailsModalEvent}
          userCoords={userCoords}
          onClose={() => setDetailsModalEvent(null)}
          onFocusMap={(ev) => {
            setSelectedEvent(ev);
          }}
        />
      )}
    </div>
  );
}
