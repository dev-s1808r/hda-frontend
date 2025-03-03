import { useFetchData } from "../instance";

const useOneMedia = (id) => {
  const {
    data: media,
    error: mediaError,
    isLoading: loadingMedia,
    refetch: refetchMedia,
  } = useFetchData({
    queryKey: ["get-one-media"],
    url: `/media/media/${id}`,
  });
  return {
    media: media?.data,
    mediaError,
    loadingMedia,
    refetchMedia,
  };
};

export default useOneMedia;
