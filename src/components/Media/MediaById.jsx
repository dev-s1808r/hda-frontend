import { useEffect, useRef, useState } from "react";
import useOneMedia from "../../api/data/oneMedia";
import "./media.css";
import MediaMeta from "./MediaMeta";
import VideoPlayer from "./VideoPlayer";
import { useMarkVerify } from "../../api/data/useMarkVerify";
import { useParams } from "react-router-dom";

function MediaById() {
  const { mediaId } = useParams();
  console.log("Media by id, id from param:", mediaId);
  const { media, refetchMedia } = useOneMedia(mediaId);
  const videoRef = useRef(null);

  console.log("media fetched by mediaById, mediaId param: ", media?._id);

  const {
    mutate: verify,
    isLoading: verifying,
    error: verificationError,
  } = useMarkVerify();

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

  function handleMarkTouched() {
    alert("Video already marked completed");
  }

  if (!media) {
    return <h1>Error loading media</h1>;
  }

  if (!media.isTouched) {
    return <h1 style={{ padding: "24px" }}>Please mark this video complete</h1>;
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

export default MediaById;
