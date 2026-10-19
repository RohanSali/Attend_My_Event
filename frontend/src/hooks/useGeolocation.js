import { useState, useEffect } from "react";
import { DEFAULT_USER_COORDS } from "../constants/events";

export function useGeolocation() {
  const [coords, setCoords] = useState(DEFAULT_USER_COORDS);
  const [isExact, setIsExact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Your current location",
        });
        setIsExact(true);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Unable to retrieve your location.");
        setIsExact(false);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return { coords, isExact, loading, error };
}

