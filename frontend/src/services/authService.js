import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const register = async (userData) => {
  return axios.post(`${API_BASE_URL}/users/register`, userData);
};

export const login = async (credentials) => {
  return axios.post(`${API_BASE_URL}/users/login`, credentials);
};

