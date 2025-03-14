import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading, user } = useAuth();

  console.log("protected route reached");
  console.log(user, "from protected route");

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
