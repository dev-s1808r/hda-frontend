// src/api/data/useMarkTouched.js
import { useMutateData } from "../instance";

export const useMarkComplete = () => {
  return useMutateData({
    method: "PATCH",
    url: "/media/mark-touched",
  });
};
