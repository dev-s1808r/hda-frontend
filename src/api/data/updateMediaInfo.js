import { useMutateData } from "../instance";

export const useUpdateMedia = () => {
  return useMutateData({
    method: "PATCH", // or "PATCH" depending on your API
    url: "/media/update-media", // adjust based on your actual route
  });
};
