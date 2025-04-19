import { useRef } from "react";
import useOneMedia from "../../api/data/oneMedia";
import "./media.css";
import MediaMeta from "./MediaMeta";
import VideoPlayer from "./VideoPlayer";
import { useMarkComplete } from "../../api/data/useMarkComplete";
import { useMarkVerify } from "../../api/data/useMarkVerify";

function Media({ userDetails, refetchCurrentUser }) {
  const { media, refetchMedia } = useOneMedia(userDetails?.assignedMedia?._id);
  const videoRef = useRef(null);

  const {
    mutate: complete,
    isLoading: completing,
    error: completionError,
  } = useMarkComplete();

  const {
    mutate: verify,
    isLoading: verifying,
    error: verificationError,
  } = useMarkVerify();

  const handleMarkTouched = () => {
    complete(
      { mediaId: media?._id, userId: userDetails?._id },
      {
        onSuccess: (data) => {
          console.log("Touched and reassigned:", data);
          refetchMedia();
          refetchCurrentUser();
          window.location.reload();
        },
        onError: (error) => {
          console.error("Error marking media as touched:", error);
          alert("Failed to mark media as touched.");
        },
      }
    );
  };

  const handleMarkVerify = () => {
    verify(
      { mediaId: media._id },
      {
        onSuccess: (data) => {
          console.log("verified", data);
          refetchMedia();
        },
        onError: (error) => {
          console.error("Error marking media as touched:", error);
          alert("Failed to mark media as touched.");
        },
      }
    );
  };

  console.log(completionError);
  console.log(verificationError);

  if (!media) {
    return <h1>Error loading media</h1>;
  }

  return (
    <div className="mediaSection">
      <MediaType media={media} />
      <div className="mediaBlock">
        <VideoPlayer
          media={media}
          videoRef={videoRef}
          handleMarkTouched={handleMarkTouched}
          handleMarkVerify={handleMarkVerify}
        />
        <MediaMeta media={media} videoRef={videoRef} />
      </div>
    </div>
  );
}

function MediaType({ media }) {
  return <p className="mediaType">{media.mediaType}</p>;
}

export default Media;
