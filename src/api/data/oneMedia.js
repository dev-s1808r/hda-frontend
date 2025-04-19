import { useFetchData } from "../instance";

const useOneMedia = (id) => {
  const {
    data: media,
    error: mediaError,
    isLoading: loadingMedia,
    refetch: refetchMedia,
  } = useFetchData({
    queryKey: ["get-one-media", id],
    url: `/media/media/${id}`,
    refetchOnWindowFocus: true,
    keepPreviousData: false,
  });

  return {
    media: media?.data,
    mediaError,
    loadingMedia,
    refetchMedia,
  };
};

export default useOneMedia;
