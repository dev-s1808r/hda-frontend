import { useMutateData } from "../instance";

export const useScanMedia = (type) => {
  return useMutateData({
    method: "POST", // or "PATCH" depending on your API
    url: `/folders/scan-static?type=${type}`, // adjust based on your actual route
  });
};
