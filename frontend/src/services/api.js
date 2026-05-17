import axios from "axios";

const API = axios.create({
  baseURL: "https://gymkart-2.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const data = JSON.parse(localStorage.getItem("user") || "{}");

  if (data?.token) {
  req.headers = req.headers || {};
  req.headers.Authorization = `Bearer ${data.token}`;
}
  return req;
});

export default API;