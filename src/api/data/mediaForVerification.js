import { useFetchData } from "../instance";

const useMediaForVerification = ({ type, page }) => {
  const {
    data: response,
    error: errorInMediaFetching,
    isLoading: loadingMedia,
    refetch: refetchMedia,
  } = useFetchData({
    queryKey: ["get-all-media"],
    url: `/folders/scan-static/touched?type=${type}&page=${page}`,
  });

  return {
    touchedMedia: response?.data,
    errorInMediaFetching,
    loadingMedia,
    refetchMedia,
  };
};

export default useMediaForVerification;
