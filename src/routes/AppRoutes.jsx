import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/Protected";
import Home from "../pages/home/Home";
import Auth from "../pages/Auth";
import Layout from "../layouts/Layout";
import Assignment from "../components/assignment/Assignment";
import AllMedia from "../pages/allMedia/AllMedia";
import VerifyMedia from "../pages/verification/VerifyMedia";
import Logs from "../pages/logs/Logs";
import ScanMedia from "../pages/scanMedia/ScanMedia";
import AuthPage from "../pages/auth/Auth";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assignment"
        element={
          <ProtectedRoute>
            <Layout>
              <Assignment />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-media"
        element={
          <ProtectedRoute>
            <Layout>
              <AllMedia />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify-media/:mediaId"
        element={
          <ProtectedRoute>
            <Layout>
              <VerifyMedia />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <Layout>
              <Logs />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/scan-media"
        element={
          <ProtectedRoute>
            <Layout>
              <ScanMedia />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<AuthPage />} />
    </Routes>
  );
}

export default AppRoutes;

// <Route
//       path="/verify"
//       element={
//         <ProtectedRoute>
//           <Media />
//         </ProtectedRoute>
//       }
//     />

{
  /* <Route
path="/verify"
element={
  <ProtectedRoute>
    <Layout>
      <Verify />
    </Layout>
  </ProtectedRoute>
}
/> */
}
