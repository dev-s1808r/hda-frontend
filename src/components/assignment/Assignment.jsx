import useUpdateUserInfo from "../../api/data/updateUserInfo";
import useAuth from "../../context/useAuth";
import "./assignment.css";
import Media from "../../components/Media/Media";

function Assignment() {
  const { user } = useAuth();
  const { refetchCurrentUser, userDetails } = useUpdateUserInfo(user.id);

  return (
    <div>
      {userDetails && (
        <Media
          userDetails={userDetails}
          refetchCurrentUser={refetchCurrentUser}
        />
      )}
    </div>
  );
}

export default Assignment;
