import { getIdToken } from "./authService";

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const BASE_URL = RAW_BASE_URL.replace(/\/$/, "");

async function request(path, options = {}) {
  const token = await getIdToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Normalize path
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE_URL}${normalizedPath}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    let errorMessage = `Request failed (HTTP ${response.status})`;
    if (isJson) {
      try {
        const errorBody = await response.json();
        if (errorBody?.detail) {
          if (typeof errorBody.detail === "string") {
            errorMessage = errorBody.detail;
          } else if (errorBody.detail.message) {
            errorMessage = errorBody.detail.message;
          } else if (Array.isArray(errorBody.detail)) {
            errorMessage = errorBody.detail.map((d) => d.msg || JSON.stringify(d)).join(", ");
          }
        }
      } catch {
        // ignore parse error
      }
    }
    throw new Error(errorMessage);
  }

  if (isJson) {
    return await response.json();
  }
  return await response.text();
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, data, options) =>
    request(path, { ...options, method: "POST", body: JSON.stringify(data) }),
  patch: (path, data, options) =>
    request(path, { ...options, method: "PATCH", body: JSON.stringify(data) }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};

