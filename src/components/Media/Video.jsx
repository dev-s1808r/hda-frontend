import React from "react";
import useMedia from "../../api/data/media";

function Video() {
  const { media } = useMedia("videos");

  if (media) {
    console.log(media);
  }
  return <div>Video</div>;
}

export default Video;
