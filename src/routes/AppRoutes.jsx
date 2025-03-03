import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/Protected";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Verify from "../pages/Verify";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify"
        element={
          <ProtectedRoute>
            <Verify />
          </ProtectedRoute>
        }
      />
      <Route path="/login" Component={Auth} />
    </Routes>
  );
}

export default AppRoutes;
