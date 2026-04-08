import axios from "axios";

const defaultApiUrl =
  typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "https://release-management-system-1.onrender.com/api"
    : "http://127.0.0.1:5000/api";

const apiBaseUrl = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/+$/, "");

const api = axios.create({
  baseURL: apiBaseUrl
});

export default api;
