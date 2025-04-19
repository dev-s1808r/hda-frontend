import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading, user } = useAuth();

  if (loading) {
    return <h1>Loading</h1>;
  }

  return !loading && user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
