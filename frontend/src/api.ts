import axios from "axios"

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api").replace(/\/+$/, "")

export const api = axios.create({
  baseURL: apiBaseUrl
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = token
  return config
})
