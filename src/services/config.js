import axios from "axios";

const api = axios.create({ baseURL: "http://192.168.1.6:3000" });
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);
export default api;
