import { useFetchData } from "../instance";

const useMedia = ({ type, page }) => {
  const {
    data: response,
    error: errorInMediaFetching,
    isLoading: loadingMedia,
    refetch: refetchMedia,
  } = useFetchData({
    queryKey: ["get-all-media", page],
    url: `/folders/scan-static?type=${type}&page=${page}`,
  });

  return {
    allMedia: response?.data,
    errorInMediaFetching,
    loadingMedia,
    refetchMedia,
  };
};

export default useMedia;
