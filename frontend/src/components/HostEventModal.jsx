import { useState, useRef } from "react";
import { CATEGORIES } from "../constants/events";
import { eventsService } from "../services/eventsService";
import MapView from "./map/MapView";

const QUICK_EMOJIS = ["🎉", "✨", "🎵", "🍕", "📍", "🤝", "💡", "⚽", "🏆", "📞", "🎟️", "📅"];

export default function HostEventModal({
  isOpen,
  onClose,
  onEventCreated,
  userCoords,
}) {
  const [form, setForm] = useState({
    title: "",
    category: "Community",
    venue_name: "",
    address_text: "",
    starts_at: "",
    ends_at: "",
    description: "",
    visibility: "public",
  });

  const [pickedLocation, setPickedLocation] = useState(
    userCoords || { lat: 18.5204, lng: 73.8567 }
  );
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const textareaRef = useRef(null);

  if (!isOpen) return null;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Insert text/emoji at cursor position in details
  function insertAtCursor(textToInsert) {
    const textarea = textareaRef.current;
    if (!textarea) {
      setForm((prev) => ({ ...prev, description: prev.description + textToInsert }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = form.description;
    const newText =
      previousText.substring(0, start) + textToInsert + previousText.substring(end);

    setForm((prev) => ({ ...prev, description: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  }

  function handleFormat(type) {
    switch (type) {
      case "bold":
        insertAtCursor("**bold text**");
        break;
      case "italic":
        insertAtCursor("*italic text*");
        break;
      case "list":
        insertAtCursor("\n• ");
        break;
      case "link":
        insertAtCursor("[Website Link](https://example.com)");
        break;
      case "contact":
        insertAtCursor("\n📞 Contact: +91 98765 43210 / host@example.com");
        break;
      case "fee":
        insertAtCursor("\n💳 Entry: Free / ₹100 per person (pay at venue)");
        break;
      default:
        break;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    // Validate mandatory fields
    if (!form.title.trim()) {
      setErrorMsg("Please enter an event name.");
      return;
    }
    if (!form.venue_name.trim()) {
      setErrorMsg("Please provide a venue name or meeting point.");
      return;
    }
    if (!form.starts_at || !form.ends_at) {
      setErrorMsg("Please specify both start and end dates/times.");
      return;
    }

    const startDate = new Date(form.starts_at);
    const endDate = new Date(form.ends_at);
    if (endDate <= startDate) {
      setErrorMsg("Event end time must be after the start time.");
      return;
    }

    if (!pickedLocation?.lat || !pickedLocation?.lng) {
      setErrorMsg("Please pick a location on the map.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        venue_name: form.venue_name.trim(),
        address_text: form.address_text.trim(),
        location: {
          lat: pickedLocation.lat,
          lng: pickedLocation.lng,
        },
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        description: form.description.trim(),
        visibility: form.visibility,
      };

      const created = await eventsService.createEvent(payload);
      onEventCreated?.(created);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to publish event. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="host-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-[#dce3ea] my-auto">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dce3ea] bg-white/95 backdrop-blur-sm px-6 py-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#778595]">
              BRING EVERYONE TOGETHER
            </span>
            <h2 id="host-modal-title" className="text-xl font-bold text-[#17324d]">
              Host an Event
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-[#657384] hover:bg-[#f3f8fb] hover:text-[#17324d] text-lg font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 leading-snug">
              {errorMsg}
            </div>
          )}

          {/* 1. Mandatory Event Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#3e5368] mb-1">
                Event Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sunday Morning Run, Garba Night"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-[#d4dfe6] bg-white text-[#17324d] focus:outline-none focus:ring-2 focus:ring-[#2f6f96]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3e5368] mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-[#d4dfe6] bg-white text-[#17324d] focus:outline-none focus:ring-2 focus:ring-[#2f6f96]/30"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Mandatory Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3e5368] mb-1">
                Starts At <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={form.starts_at}
                onChange={(e) => updateField("starts_at", e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-[#d4dfe6] bg-white text-[#17324d] focus:outline-none focus:ring-2 focus:ring-[#2f6f96]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3e5368] mb-1">
                Ends At <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={form.ends_at}
                onChange={(e) => updateField("ends_at", e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-[#d4dfe6] bg-white text-[#17324d] focus:outline-none focus:ring-2 focus:ring-[#2f6f96]/30"
              />
            </div>
          </div>

          {/* 3. Mandatory Location via Map */}
          <div className="space-y-2 border border-[#dce3ea] rounded-xl p-3.5 bg-[#f8fafc]">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-[#17324d]">
                  Location & Map Pin <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-[#657384]">
                  Pinpoint exact venue on the map for attendees nearby.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationPicker((prev) => !prev)}
                className="text-xs font-semibold text-[#2f6f96] hover:underline"
              >
                {showLocationPicker ? "Hide Map Picker ▲" : "Adjust on Map ▼"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Venue name (e.g. Riverside Amphitheatre, Cafe ABC)"
                  value={form.venue_name}
                  onChange={(e) => updateField("venue_name", e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-[#d4dfe6] bg-white text-[#17324d] focus:outline-none focus:ring-1 focus:ring-[#2f6f96]"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Address / landmark (optional)"
                  value={form.address_text}
                  onChange={(e) => updateField("address_text", e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-[#d4dfe6] bg-white text-[#17324d] focus:outline-none focus:ring-1 focus:ring-[#2f6f96]"
                />
              </div>
            </div>

            {/* Interactive Location Picker Map */}
            {showLocationPicker && (
              <div className="mt-2 space-y-1">
                <p className="text-[10px] font-medium text-[#2f6f96]">
                  👉 Click on the map to place or drag the pin to your venue.
                </p>
                <div className="h-48 w-full rounded-xl overflow-hidden border border-[#dce3ea]">
                  <MapView
                    isPickerMode={true}
                    pickerLocation={pickedLocation}
                    onPickLocation={(coords) => setPickedLocation(coords)}
                    userCoords={userCoords}
                  />
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>
                    Selected: {pickedLocation.lat.toFixed(4)}, {pickedLocation.lng.toFixed(4)}
                  </span>
                  <span>Drag pin or click map to change</span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Multi-functional Details Section (Markdown, emojis, links, contact) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#3e5368]">
                Event Details & Instructions{" "}
                <span className="text-[10px] font-normal text-slate-400">
                  (add text, emojis, links, contact info)
                </span>
              </label>
            </div>

            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#f1f5f9] rounded-t-xl border border-b-0 border-[#d4dfe6] text-xs">
              <span className="text-[11px] font-bold text-[#556575] mr-1">Format:</span>
              <button
                type="button"
                onClick={() => handleFormat("bold")}
                className="px-2 py-0.5 rounded bg-white font-bold hover:bg-slate-200 border border-slate-200"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => handleFormat("italic")}
                className="px-2 py-0.5 rounded bg-white italic hover:bg-slate-200 border border-slate-200"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => handleFormat("list")}
                className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200"
                title="Bullet List"
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => handleFormat("link")}
                className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200"
                title="Insert Link"
              >
                🔗 Link
              </button>
              <button
                type="button"
                onClick={() => handleFormat("contact")}
                className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200"
                title="Insert Contact Details"
              >
                📞 Contact
              </button>
              <button
                type="button"
                onClick={() => handleFormat("fee")}
                className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200"
                title="Insert Fee/Entry details"
              >
                💳 Entry Info
              </button>

              <div className="w-px h-4 bg-slate-300 mx-1" />

              {/* Quick Emojis */}
              <div className="flex items-center gap-1">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertAtCursor(emoji)}
                    className="hover:scale-125 transition-transform text-sm"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              ref={textareaRef}
              rows={4}
              placeholder="What should people know? Schedule, what to bring, fee instructions, WhatsApp group links, contact details..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-b-xl border border-[#d4dfe6] bg-white text-[#17324d] focus:outline-none focus:ring-2 focus:ring-[#2f6f96]/30 resize-y"
            />
          </div>

          {/* 5. Image Attachment placeholder (currently disabled per prompt) */}
          <div className="rounded-xl border border-dashed border-[#dce3ea] bg-[#f8fafc] p-3 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🖼️</span>
              <div>
                <p className="font-semibold text-[#17324d]">Event Banner / Cover Image</p>
                <p className="text-[10px] text-[#657384]">
                  Cloud storage integration will be connected soon.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled
              className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
            >
              Upload Disabled
            </button>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs sm:text-sm font-semibold text-[#556575] hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#2f6f96] px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#245b7c] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Publishing Event..." : "Publish Event ↗"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

