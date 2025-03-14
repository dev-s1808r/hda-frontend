import useAuth from "../../context/useAuth";
import useAppStore from "../../store/useAppStore";
import { api } from "../instance";

export const login = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("t", token);
    }
    setUserToState(user);
    return user;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

function setUserToState(data) {
  const setUser = useAppStore.getState().setUser;
  setUser(data);
}
