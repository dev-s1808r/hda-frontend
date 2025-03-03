import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

const useAppStore = create(
  devtools(
    persist((set) => ({
      // Initial state
      isUser: false,
      user: null,

      // Actions to update state
      setUser: (data) => {
        set({ isUser: true, user: data });
      },
      removeUser: () => {
        set({ isUser: false, user: null });
      },
    }))
  )
);

export default useAppStore;

/**
 * 
 * 
      verifyUser: () => {
        const token = localStorage.getItem("at");
        if (!token) {
          console.log("Forbidden");
          set(() => ({
            isUser: false,
            userRole: "",
          }));
          return;
        }

        try {
          const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
          const isValid = payload.exp > Date.now() / 1000; // Check expiry

          if (isValid) {
            set((state) => {
              if (!state.isUser) {
                return {
                  isUser: true,
                  userRole: payload.role,
                };
              }
              return state; // Do not update if already verified
            });
          } else {
            console.log("Session expired. Login again");
            localStorage.removeItem("at"); // Remove invalid token
            set(() => ({
              isUser: false,
              userRole: "",
            }));
          }
        } catch (err) {
          console.error("Token verification failed:", err.message);
          localStorage.removeItem("at"); // Remove invalid token
          set(() => ({
            isUser: false,
            userRole: "",
          }));
        }
      },
 */
