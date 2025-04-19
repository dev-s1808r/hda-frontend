import { useMutateData } from "../instance";

export const useLogin = () =>
  useMutateData({
    method: "POST",
    url: "/auth/login",
  });
