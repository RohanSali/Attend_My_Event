import { useEffect, useRef } from "react";
import L from "leaflet";
import { getEventStatus, getStatusLabel, getStatusMarkerColor } from "../../utils/eventStatus";
import { formatEventDateTime } from "../../utils/date";

export default function MapView({
  events = [],
  userCoords,
  selectedEvent,
  onSelectEvent,
  isPickerMode = false,
  pickerLocation,
  onPickLocation,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const pickerMarkerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const defaultLat = userCoords?.lat || 18.5204;
    const defaultLng = userCoords?.lng || 73.8567;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 12,
      zoomControl: false,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: "topright" }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle map click in picker mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    function handleMapClick(e) {
      if (isPickerMode && onPickLocation) {
        onPickLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }

    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
    };
  }, [isPickerMode, onPickLocation]);

  // Update user location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userHtml = `
      <div style="
        width: 18px;
        height: 18px;
        background: #2563eb;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.35);
      "></div>
    `;

    const userIcon = L.divIcon({
      className: "user-loc-pin",
      html: userHtml,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindPopup("<b>You are here</b>");
  }, [userCoords]);

  // Render picker marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isPickerMode) {
      if (pickerMarkerRef.current) pickerMarkerRef.current.remove();
      return;
    }

    if (pickerMarkerRef.current) {
      pickerMarkerRef.current.remove();
    }

    if (pickerLocation?.lat && pickerLocation?.lng) {
      const pickerIcon = L.divIcon({
        className: "picker-pin",
        html: `
          <div style="
            background: #f4a340;
            color: #17324d;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          ">
            <span style="transform: rotate(45deg);">📍</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      pickerMarkerRef.current = L.marker([pickerLocation.lat, pickerLocation.lng], {
        icon: pickerIcon,
        draggable: true,
      })
        .addTo(map)
        .on("dragend", (e) => {
          const latlng = e.target.getLatLng();
          onPickLocation?.({ lat: latlng.lat, lng: latlng.lng });
        });
    }
  }, [isPickerMode, pickerLocation, onPickLocation]);

  // Update Event Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer || isPickerMode) return;

    layer.clearLayers();

    events.forEach((event) => {
      const lat = event.location?.lat;
      const lng = event.location?.lng;
      if (!lat || !lng) return;

      const status = getEventStatus(event);
      const color = getStatusMarkerColor(status);
      const label = getStatusLabel(event);
      const isSelected = selectedEvent?.id === event.id;

      // Custom marker icon with status color
      const markerHtml = `
        <div class="custom-event-pin" style="
          background-color: ${color};
          width: ${isSelected ? "34px" : "28px"};
          height: ${isSelected ? "34px" : "28px"};
          border: ${isSelected ? "3px solid #ffffff" : "2px solid #ffffff"};
          box-shadow: ${
            isSelected
              ? "0 0 0 4px rgba(47, 111, 150, 0.4), 0 4px 12px rgba(0,0,0,0.3)"
              : "0 2px 8px rgba(0,0,0,0.25)"
          };
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: ${isSelected ? "14px" : "12px"};
        ">
          ${status === "live" ? "🔥" : "⌖"}
        </div>
      `;

      const icon = L.divIcon({
        className: "event-status-icon",
        html: markerHtml,
        iconSize: [isSelected ? 34 : 28, isSelected ? 34 : 28],
        iconAnchor: [isSelected ? 17 : 14, isSelected ? 17 : 14],
      });

      const marker = L.marker([lat, lng], { icon })
        .addTo(layer)
        .on("click", () => {
          onSelectEvent?.(event);
        });

      // Popup
      const popupHtml = `
        <div style="font-family: Inter, sans-serif; min-width: 180px; max-width: 240px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #2f6f96;">${event.category || "Event"}</span>
            <span style="font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; background: #eef2f6; color: #17324d;">${label}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #17324d; margin: 4px 0 2px 0; line-height: 1.3;">${event.title}</h4>
          <p style="font-size: 11px; color: #576c7f; margin: 0 0 6px 0;">📍 ${event.venue_name || "Location"}</p>
          <p style="font-size: 10px; color: #8996a3; margin: 0;">${formatEventDateTime(event.start_at)}</p>
        </div>
      `;
      marker.bindPopup(popupHtml);

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [events, selectedEvent, onSelectEvent, isPickerMode]);

  // Pan to selected event
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedEvent?.location?.lat || !selectedEvent?.location?.lng) return;

    map.flyTo([selectedEvent.location.lat, selectedEvent.location.lng], 14, {
      duration: 1.2,
    });
  }, [selectedEvent]);

  function handleLocateMe() {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;
    map.flyTo([userCoords.lat, userCoords.lng], 14, { duration: 1 });
  }

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-[#dce3ea] shadow-sm bg-[#e8edf2]">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Floating Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        {userCoords && (
          <button
            type="button"
            onClick={handleLocateMe}
            className="grid size-9 place-items-center rounded-xl bg-white text-[#17324d] shadow-md hover:bg-[#f3f8fb] transition-colors border border-slate-200"
            title="Center on my location"
            aria-label="My location"
          >
            🎯
          </button>
        )}
      </div>

      {/* Map Legend (Bottom-Left) */}
      {!isPickerMode && (
        <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-3 rounded-xl bg-white/95 backdrop-blur-xs px-3 py-1.5 text-[10px] font-semibold text-[#17324d] shadow-md border border-[#dce3ea]">
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-emerald-500" /> Live
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-amber-500" /> Starting soon
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-[#2f6f96]" /> Upcoming
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-slate-400" /> Ended
          </span>
        </div>
      )}
    </div>
  );
}

