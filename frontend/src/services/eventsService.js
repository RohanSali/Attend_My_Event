import { api } from "./api";

export const eventsService = {
  getEvents: (category) => {
    let query = "";
    if (category && category !== "All categories") {
      query = `?category=${encodeURIComponent(category)}`;
    }
    return api.get(`/events${query}`);
  },
  getMyEvents: () => api.get("/events/mine"),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post("/events", data),
  updateEvent: (id, data) => api.patch(`/events/${id}`, data),
  cancelEvent: (id) => api.post(`/events/${id}/cancel`, {}),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

