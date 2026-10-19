import { api } from "./api";

export const userService = {
  getProfile: () => api.get("/me"),
  syncProfile: (data) => api.post("/me", data),
  updateProfile: (data) => api.patch("/me", data),
};

