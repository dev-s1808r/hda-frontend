import useAppStore from "../store/useAppStore";
import { useNavigate } from "react-router-dom";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

function NavContent() {
  const removeUser = useAppStore.getState().removeUser;
  const user = useAppStore.getState().user;
  const navigate = useNavigate();

  function handleLogOut() {
    removeUser();
    navigate("/login");
  }
  return (
    <div className="navContent">
      <BubbleChartIcon
        className="animatedIcon"
        onClick={() => {
          navigate("/");
        }}
        sx={{
          fontSize: "48px",
          color: "#616161",
          cursor: "pointer",
          "&:hover": {
            color: "#424242",
          },
        }}
      />
      <p className="appName">Hari Krishna Mandir Digital Archive</p>
      {user && (
        <ExitToAppIcon
          className="animatedIcon"
          sx={{
            fontSize: "32px",
            color: "#616161",
            cursor: "pointer",
            "&:hover": {
              color: "#424242",
            },
          }}
          onClick={handleLogOut}
        />
      )}
    </div>
  );
}

export default NavContent;
