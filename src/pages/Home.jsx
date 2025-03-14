import useUsers from "../api/data/user";
import useAppStore from "../store/useAppStore";
import MediaTabs from "../components/Home/MediaTabs";
import MediaDisplay from "../components/Media/MediaDisplay";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../api/instance";
import useUpdateUserInfo from "../api/data/updateUserInfo";
import useAuth from "../context/useAuth";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const removeUser = useAppStore.getState().removeUser;
  // const user = useAppStore.getState().removeUser;

  const { refetchCurrentUser, userDetails } = useUpdateUserInfo(user.id);

  function handleLogOut() {
    removeUser();
    navigate("/login");
  }

  console.log("home reached");

  const handleMarkCompleted = async (id) => {
    alert(id);
    try {
      let res = await api.patch("/media/mark-touched", {
        mediaId: userDetails?.assignedMedia._id,
        userId: user?.id,
      });
      console.log(res.data, "updated media %%%%%");
      refetchCurrentUser();
      window.location.reload();
      console.log("new media after completion");
      console.log(userDetails);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="100%">
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Harikrishna Mandir Digital Archiving System
          </Typography>
          <Button color="inherit" onClick={() => navigate("/verify")}>
            Verification
          </Button>
          <Button color="inherit" onClick={handleLogOut}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          maxWidth: "100vw",
          overflow: "hidden",
          mt: 3,
          maxHeight: "90dvh",
          overflowY: "auto",
        }}
      >
        {/* Media Display */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: "100%",
            overflowX: "auto",
          }}
        >
          {userDetails && (
            <MediaDisplay
              handleMarkCompleted={handleMarkCompleted}
              userDetails={userDetails}
              refetchCurrentUser={refetchCurrentUser}
            />
          )}
        </Box>

        {/* Media Tabs */}
        {userDetails?.role === "admin" && (
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "100%",
              overflowX: "auto",
            }}
          >
            <MediaTabs />
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;
