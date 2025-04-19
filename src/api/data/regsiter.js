import { useMutateData } from "../instance";

export const useRegister = () =>
  useMutateData({
    method: "POST",
    url: "/auth/register",
  });
