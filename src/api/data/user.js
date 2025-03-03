import { useFetchData } from "../instance";

const useUsers = () => {
  const {
    data: response,
    error: errorInUserFetching,
    isLoading: loadingUsers,
    refetch: refetchUsers,
  } = useFetchData({
    queryKey: ["get-all-users"],
    url: "/users/get-all-users",
  });
  return {
    users: response?.data?.users,
    errorInUserFetching,
    loadingUsers,
    refetchUsers,
  };
};

export default useUsers;
