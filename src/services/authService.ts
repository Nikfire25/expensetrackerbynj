import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  register: async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/register`, { email, password });
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
  },
};
