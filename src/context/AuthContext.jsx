import { createContext, useEffect, useState } from "react";

// Create the Auth Context
const AuthContext = createContext();

// Function to manually decode a JWT token
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1]; // Extract the payload part
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const validateToken = () => {
    const token = localStorage.getItem("t");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setLoading(true);
        setUser(decoded);
        setIsLoggedIn(true);
        setLoading(false);
      } else {
        localStorage.removeItem("t");
        setIsLoggedIn(false);
        setLoading(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    validateToken();
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("t");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, loading, logout, validateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
