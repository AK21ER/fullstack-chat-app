import axios from "axios";
const viteurl="https://fullstack-chat-app-dbtu.onrender.com";
export const axiosInsatnce = axios.create({
  baseURL:  viteurl || "http://localhost:5001/api",
  withCredentials: true, // This allows cookies to be sent with the request
});