import { getEventStatus, getStatusLabel, getStatusBadgeClasses } from "../utils/eventStatus";
import { formatEventRange, formatEventDateTime } from "../utils/date";
import { calculateDistanceKm, formatDistance } from "../utils/distance";

export default function EventDetailsModal({
  event,
  onClose,
  userCoords,
  onFocusMap,
}) {
  if (!event) return null;

  const status = getEventStatus(event);
  const statusLabel = getStatusLabel(event);
  const badgeClasses = getStatusBadgeClasses(status);

  const distanceKm =
    userCoords?.lat && userCoords?.lng && event.location?.lat && event.location?.lng
      ? calculateDistanceKm(
          userCoords.lat,
          userCoords.lng,
          event.location.lat,
          event.location.lng
        )
      : null;
  const distanceText = formatDistance(distanceKm);

  // Google Maps external navigation URL
  const directionsUrl =
    event.location?.lat && event.location?.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${event.location.lat},${event.location.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          event.venue_name || event.title
        )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-details-title"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-[#dce3ea] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eef2f6] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#2f6f96] uppercase tracking-wider">
              {event.category || "Event"}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${badgeClasses}`}
            >
              {status === "live" && (
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {statusLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-[#657384] hover:bg-[#f3f8fb] text-lg font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2
            id="event-details-title"
            className="text-xl sm:text-2xl font-bold text-[#17324d] leading-snug"
          >
            {event.title}
          </h2>

          {/* Time & Venue Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                When
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#17324d]">
                {formatEventRange(event.start_at, event.end_at)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Where {distanceText && `· ${distanceText}`}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#17324d] truncate">
                📍 {event.venue_name || "Location"}
              </p>
              {event.address_text && (
                <p className="text-[11px] text-[#657384] truncate">{event.address_text}</p>
              )}
            </div>
          </div>

          {/* Description & Host details */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-slate-400">About this event</span>
            <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4 text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-wrap">
              {event.description || "No additional description provided by host."}
            </div>
          </div>

          {/* Host info card */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#2f6f96] text-white flex items-center justify-center font-bold text-sm">
                {(event.host_name || "H").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#17324d]">{event.host_name || "Event Host"}</p>
                <p className="text-[10px] text-slate-400">Host</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500">
              Published {formatEventDateTime(event.published_at || event.created_at)}
            </span>
          </div>

          {/* Disclaimer regarding host-managed payments/details */}
          <p className="text-[10px] text-slate-400 italic">
            * Note: AttendMyEvent connects communities and displays event information supplied by hosts. AttendMyEvent does not collect or process ticket payments.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onFocusMap?.(event);
                onClose();
              }}
              className="rounded-xl border border-[#2f6f96] px-4 py-2 text-xs font-semibold text-[#2f6f96] hover:bg-sky-50 transition-colors"
            >
              🗺 Focus on Map
            </button>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl bg-[#2f6f96] px-5 py-2 text-xs font-semibold text-white hover:bg-[#245b7c] transition-colors"
            >
              <span>Get Directions</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

