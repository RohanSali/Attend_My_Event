import { getEventStatus, getStatusLabel, getStatusBadgeClasses } from "../utils/eventStatus";
import { formatEventRange } from "../utils/date";
import { calculateDistanceKm, formatDistance } from "../utils/distance";

export default function EventCard({
  event,
  isSelected,
  userCoords,
  onSelect,
  onFocusMap,
}) {
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

  return (
    <article
      onClick={() => onSelect?.(event)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(event);
        }
      }}
      className={`group relative rounded-xl border bg-white p-4 transition-all duration-150 cursor-pointer text-left ${
        isSelected
          ? "border-[#2f6f96] ring-2 ring-[#2f6f96]/20 shadow-md bg-sky-50/20"
          : "border-[#dce3ea] hover:border-[#b9d0df] hover:shadow-sm"
      }`}
    >
      {/* Category, Distance & Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2f6f96]">
            {event.category || "Community"}
          </span>
          {distanceText && (
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              📍 {distanceText}
            </span>
          )}
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border tracking-wide uppercase ${badgeClasses}`}
        >
          {status === "live" && (
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
          {statusLabel}
        </span>
      </div>

      {/* Event Title */}
      <h3 className="text-sm sm:text-base font-semibold text-[#17324d] leading-snug tracking-tight mb-1.5 group-hover:text-[#2f6f96] transition-colors line-clamp-2">
        {event.title}
      </h3>

      {/* Location / Venue */}
      <p className="flex items-center gap-1.5 text-xs text-[#576c7f] mb-1.5">
        <span className="text-[#c58229] shrink-0" aria-hidden="true">
          ⌖
        </span>
        <span className="truncate">{event.venue_name || "Location not specified"}</span>
      </p>

      {/* Date & Time */}
      <p className="text-[11px] font-medium text-[#788898] mb-2.5">
        🗓 {formatEventRange(event.start_at, event.end_at)}
      </p>

      {/* Excerpt / description preview */}
      {event.description && (
        <p className="text-xs text-[#667687] leading-relaxed line-clamp-2 mb-3 bg-[#f8fafc] p-2 rounded-lg border border-slate-100">
          {event.description.replace(/<[^>]*>/g, "")}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[10px] font-medium text-[#8996a3]">
          By {event.host_name || "Host"}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFocusMap?.(event);
            }}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold text-[#556575] hover:bg-[#eef2f6] hover:text-[#17324d] transition-colors border border-[#dce3ea]"
            title="Focus on map"
          >
            <span>🗺 View on Map</span>
          </button>
        </div>
      </div>
    </article>
  );
}
