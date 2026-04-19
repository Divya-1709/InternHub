import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";
const API = axios.create({
  baseURL: apiUrl
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
