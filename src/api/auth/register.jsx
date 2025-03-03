import { api } from "../instance";

export const register = async (data) => {
  try {
    const response = await api.post("/register", data);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("t", token);
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};
