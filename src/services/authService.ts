import axios from "axios";

const API_URL = "https://expensetrackerbynjbackend.onrender.com";

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
