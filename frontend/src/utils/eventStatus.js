const STARTING_SOON_THRESHOLD_MS = 45 * 60 * 1000; // 45 minutes

export function getEventStatus(event) {
  if (!event) return "unknown";
  if (event.status === "cancelled") return "cancelled";
  if (event.status === "draft") return "draft";

  const now = Date.now();
  const start = new Date(event.start_at).getTime();
  const end = new Date(event.end_at).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return "upcoming";

  if (now >= end) return "ended";
  if (now >= start && now < end) return "live";
  if (start > now && start - now <= STARTING_SOON_THRESHOLD_MS) return "starting_soon";
  return "upcoming";
}

export function getStatusLabel(event) {
  const status = getEventStatus(event);
  const now = Date.now();
  const start = new Date(event.start_at).getTime();

  switch (status) {
    case "live":
      return "LIVE";
    case "starting_soon": {
      const diffMins = Math.max(1, Math.round((start - now) / (60 * 1000)));
      return `Starting soon · ${diffMins}m`;
    }
    case "upcoming": {
      const diffHours = Math.round((start - now) / (60 * 60 * 1000));
      if (diffHours < 24) {
        return `In ${diffHours}h`;
      }
      const diffDays = Math.round(diffHours / 24);
      return `In ${diffDays}d`;
    }
    case "ended":
      return "Ended";
    case "cancelled":
      return "Cancelled";
    case "draft":
      return "Draft";
    default:
      return "Upcoming";
  }
}

export function getStatusBadgeClasses(status) {
  switch (status) {
    case "live":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "starting_soon":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "upcoming":
      return "bg-sky-50 text-[#2f6f96] border-sky-200";
    case "ended":
      return "bg-slate-100 text-slate-500 border-slate-200";
    case "cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "draft":
      return "bg-zinc-100 text-zinc-600 border-zinc-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export function getStatusMarkerColor(status) {
  switch (status) {
    case "live":
      return "#10b981"; // emerald-500
    case "starting_soon":
      return "#f59e0b"; // amber-500
    case "upcoming":
      return "#2f6f96"; // brand blue
    case "ended":
      return "#94a3b8"; // slate-400
    case "cancelled":
      return "#ef4444"; // rose-500
    case "draft":
      return "#64748b";
    default:
      return "#2f6f96";
  }
}

