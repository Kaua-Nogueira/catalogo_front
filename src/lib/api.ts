import axios from "axios";
import { useAuth } from "@/stores/auth";

// Assuming Laravel is running locally on port 8001
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // In a real multi-tenant scenario, we might pass the domain or ID via header
    // 'X-Tenant-Domain': window.location.hostname
  },
});

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        useAuth.getState().logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
