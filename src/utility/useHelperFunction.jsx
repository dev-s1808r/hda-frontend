import React from "react";
import useAppStore from "../store/useAppStore";

function useHelperFunction() {
  const user = useAppStore.getState().user;
  const setUser = useAppStore.getState().setUser;
  const removeUser = useAppStore.getState().removeUser;
  return { user, setUser, removeUser };
}

export default useHelperFunction;
