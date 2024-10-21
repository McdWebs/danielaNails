import axios from "axios";

const baseurl = "http://localhost:3005/admins";

export const login = async (data) => {
  return await axios.post(`${baseurl}/login`, data, { withCredentials: true });
};

export const signup = async (data) => {
  return await axios.post(baseurl, data, { withCredentials: true });
};

export const logout = () => {
  return axios.post(`${baseurl}/logout`, {}, { withCredentials: true });
};

export const checkAuthStatus = () => {
  return axios.get(`${baseurl}/checkAuth`, { withCredentials: true });
};
