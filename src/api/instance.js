import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("t");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("error intercepted", error);
    return Promise.reject(error);
  }
);

export const useFetchData = ({ queryKey, url, config = {}, options = {} }) => {
  const navigate = useNavigate();

  const queryFn = async () => {
    try {
      const response = await api.get(url, config);
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("Unauthorized, redirecting to login...");
        navigate("/login");
        return Promise.reject(error);
      }
      throw error;
    }
  };

  return useQuery({
    queryKey,
    queryFn,
    ...options,
    onError: (error) => {
      console.error("Error in useFetchData:", error);
      if (error.response?.status === 401) {
        navigate("/login"); // Ensure redirection on 401 in the onError handler
      }
    },
  });
};

export const useMutateData = ({ method, url, headers = {} }) => {
  return useMutation({
    mutationFn: (data) => {
      return api({
        method,
        url,
        data,
        headers,
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};
