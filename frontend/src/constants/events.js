export const CATEGORIES = [
  "Community",
  "Cultural & Religious",
  "Music & Concerts",
  "Food & Drink",
  "Arts & Theater",
  "Sports & Outdoors",
  "Workshops & Talks",
  "Parties & Social",
  "Tech & Business",
  "Other",
];

export const REGISTRATION_MODES = [
  { value: "none", label: "No registration required (Open to all)" },
  { value: "in_app", label: "In-App RSVP / Registration" },
  { value: "external", label: "External registration link" },
  { value: "contact_host", label: "Contact host directly" },
];

// Default fallback coordinates if user location denied (e.g. Center of Pune / Mumbai / India)
export const DEFAULT_USER_COORDS = {
  lat: 18.5204,
  lng: 73.8567,
  label: "Default area",
};
