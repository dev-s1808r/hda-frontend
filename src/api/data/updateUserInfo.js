import useHelperFunction from "../../utility/useHelperFunction";
import { useFetchData } from "../instance";

function useUpdateUserInfo(userId) {
  const { setUser } = useHelperFunction();
  const {
    data: user,
    error: errorUpdatingUser,
    isLoading: updatingUserData,
    refetch: refetchCurrentUser,
  } = useFetchData({
    queryKey: [`current-user`],
    url: `/users/get-current-user/${userId}`,
  });

  if (user) {
    setUser(user.data);
  }

  return {
    userDetails: user?.data,
    errorUpdatingUser,
    updatingUserData,
    refetchCurrentUser,
  };
}

export default useUpdateUserInfo;
