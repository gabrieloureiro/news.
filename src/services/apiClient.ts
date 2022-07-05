import axios from "axios";
import { parseCookies } from "nookies";

const { access_token } = parseCookies();

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  },
});

export default apiClient;
