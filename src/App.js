import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Box, CircularProgress, Grid } from "@mui/material";
import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import fetchModel from "./lib/fetchModelData";

function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function UserDetailWrapper(props) {
  const { userId } = useParams();
  return <UserDetail {...props} userId={userId} />;
}

function UserPhotosWrapper(props) {
  const { userId } = useParams();
  return <UserPhotos {...props} userId={userId} />;
}

export const BE_URL = "".replace(/\/$/, "");

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [booting, setBooting] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const me = await fetchModel("/admin/current");
        setCurrentUser(me);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setBooting(false);
      }
    };
    bootstrap();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    navigate(`/users/${user._id}`);
  };

  const handleLogout = async () => {
    await fetchModel("/admin/logout", {
      method: "POST",
      body: JSON.stringify({}),
    });
    setCurrentUser(null);
    navigate("/login");
  };

  const requestRefresh = () => setRefreshToken((p) => p + 1);

  if (booting) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <TopBar
        currentUser={currentUser}
        path={location.pathname}
        onLogout={handleLogout}
        onUploaded={requestRefresh}
      />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <UserList currentUser={currentUser} refreshToken={refreshToken} />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Routes>
            <Route
              path="/login"
              element={<LoginRegister onLogin={handleLogin} />}
            />
            <Route
              path="/"
              element={
                <Navigate to={currentUser ? "/users" : "/login"} replace />
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute currentUser={currentUser}>
                  <Navigate to="/users/1" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:userId"
              element={
                <ProtectedRoute currentUser={currentUser}>
                  <UserDetailWrapper refreshToken={refreshToken} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/photos/:userId"
              element={
                <ProtectedRoute currentUser={currentUser}>
                  <UserPhotosWrapper
                    currentUser={currentUser}
                    refreshToken={refreshToken}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Grid>
      </Grid>
    </Box>
  );
}
