import axios from "axios";

// "http://localhost:3003"
const api = axios.create({
  baseURL: "https://ai-resume-analyzer-j2kz.onrender.com", 
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
