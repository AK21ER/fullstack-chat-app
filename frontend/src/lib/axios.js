import axios from "axios";

export const axiosInsatnce = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // This allows cookies to be sent with the request
});