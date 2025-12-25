import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const code = localStorage.getItem("activationCode");
  if (code) {
    config.headers["x-activation-code"] = code;
  }
  return config;
});

export default api;
