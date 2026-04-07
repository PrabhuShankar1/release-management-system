import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api").replace(/\/+$/, "");

const api = axios.create({
  baseURL: apiBaseUrl
});

export default api;
