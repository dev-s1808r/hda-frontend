// src/api/data/useMarkTouched.js
import { useMutateData } from "../instance";

export const useMarkVerify = () => {
  return useMutateData({
    method: "PATCH",
    url: "/media/mark-verified",
  });
};
