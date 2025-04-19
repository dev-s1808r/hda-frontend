import { Button, Typography } from "@mui/material";
import { useState } from "react";
import Forward10Icon from "@mui/icons-material/Forward10";
import Replay10Icon from "@mui/icons-material/Replay10";

const speedOptions = [0.25, 0.5, 1, 1.5, 2];

function VideoPlayer({ media, videoRef, handleMarkTouched, handleMarkVerify }) {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackSpeed(newSpeed);

    // Update the video playback speed immediately
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        src={media.mediaPath}
        style={{ width: "720px", height: "auto" }}
        autoPlay
        // muted
        controls
        onLoadedMetadata={() => {
          if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
          }
        }}
      >
        Your browser does not support the video tag.
      </video>
      <div className="pseudoname">
        <Typography variant="body">pseudoName: {media.pseudoName}</Typography>
      </div>
      <div className="videoControls">
        <div className="speedControl">
          <label htmlFor="speedControl">Speed: </label>
          <select
            id="speedControl"
            value={playbackSpeed}
            onChange={handleSpeedChange}
          >
            {speedOptions.map((option) => (
              <option key={option} value={option}>
                {option}x
              </option>
            ))}
          </select>
        </div>
        <div className="mediaAction">
          <Button
            onClick={handleMarkTouched}
            variant="outlined"
            color={media.isTouched ? "success" : "#616161"}
            sx={{ color: media.isTouched ? "success" : "#616161" }}
          >
            {media.isTouched ? "Completed" : "Mark Complete"}
          </Button>
          <Button
            onClick={handleMarkVerify}
            variant="outlined"
            disabled={!media.isTouched}
            color={media.isVerified ? "success" : "#616161"}
            sx={{ color: media.isVerified ? "success" : "#616161" }}
          >
            {media.isVerified ? "Verified" : "Verify"}
          </Button>
        </div>
        <div className="timeControl">
          <Button variant="outlined" color="#616161" onClick={() => skip(-10)}>
            <Replay10Icon />
          </Button>
          <Button variant="outlined" color="#616161" onClick={() => skip(10)}>
            <Forward10Icon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
