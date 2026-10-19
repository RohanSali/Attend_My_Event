export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined ||
    lat1 === null ||
    lon1 === null ||
    lat2 === null ||
    lon2 === null
  ) {
    return null;
  }

  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function formatDistance(km) {
  if (km === null || km === undefined || Number.isNaN(km)) {
    return null;
  }
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m away`;
  }
  return `${km.toFixed(1)} km away`;
}

export function sortEventsByProximity(events, userCoords) {
  if (!userCoords || !userCoords.lat || !userCoords.lng) {
    // If no user location, sort by start_at
    return [...events].sort(
      (a, b) => new Date(a.start_at || 0) - new Date(b.start_at || 0)
    );
  }

  return [...events].sort((a, b) => {
    const aLat = a.location?.lat;
    const aLng = a.location?.lng;
    const bLat = b.location?.lat;
    const bLng = b.location?.lng;

    const distA =
      aLat !== undefined && aLng !== undefined
        ? calculateDistanceKm(userCoords.lat, userCoords.lng, aLat, aLng)
        : Infinity;

    const distB =
      bLat !== undefined && bLng !== undefined
        ? calculateDistanceKm(userCoords.lat, userCoords.lng, bLat, bLng)
        : Infinity;

    return distA - distB;
  });
}

