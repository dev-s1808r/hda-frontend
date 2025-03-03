import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { api } from "../../api/instance";
import useOneMedia from "../../api/data/oneMedia";

const MediaDisplay = ({
  handleMarkCompleted,
  userDetails,
  refetchCurrentUser,
}) => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedTimestamp, setSelectedTimestamp] = useState({
    start: 0,
    end: 0,
  });

  const videoRef = useRef(null);

  const { media, refetchMedia } = useOneMedia(userDetails?.assignedMedia?._id);

  useEffect(() => {
    if (media) {
      setFormData(media);
    }
  }, [media]);

  const handleEditToggle = async () => {
    if (editable && formData !== media) {
      try {
        const response = await api.patch(`/media/update-media`, {
          formData,
          mediaId: userDetails?.assignedMedia?._id,
        });

        if (response?.data?.updatedMedia) {
          setFormData(response.data.updatedMedia);
          refetchMedia();
          console.log("Media updated:", response.data.updatedMedia);
        } else {
          console.warn("No updated media received from server");
        }
      } catch (error) {
        console.error(
          "Error updating media:",
          error.response?.data?.message || error.message
        );
        alert("Failed to update media. Please try again.");
      }
    } else {
      refetchMedia();
    }
    setEditable((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimestampChange = (index, field, value) => {
    const updatedTimestamps = formData.timeStamp.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, timeStamp: updatedTimestamps });
  };

  const addTimestampRow = () => {
    setFormData({
      ...formData,
      timeStamp: [
        ...(formData.timeStamp || []),
        { startTime: "", endTime: "", content: "" },
      ],
    });
  };

  const removeTimestampRow = (index) => {
    const updatedTimestamps = [...formData.timeStamp];
    updatedTimestamps.splice(index, 1);
    setFormData({ ...formData, timeStamp: updatedTimestamps });
  };

  // 🔴 AI Transcription Handler
  const handleAITranscription = async () => {
    if (!formData.mediaPath) {
      alert("Media path is missing!");
      return;
    }

    setIsTranscribing(true);
    try {
      console.log(
        `[INFO] Sending request to /speech/convert for URL: ${formData.mediaPath}`
      );
      const response = await api.post("/speech/convert", {
        fileUrl: formData.mediaPath,
      });

      if (response?.data?.transcriptions) {
        const transcriptions = response.data.transcriptions.map((item) => ({
          startTime: item.startTime,
          endTime: item.endTime,
          content: item.content,
        }));

        setFormData({ ...formData, timeStamp: transcriptions });
        console.log(
          "[INFO] Transcription completed and populated successfully."
        );
        alert("Transcription completed successfully!");
      } else {
        console.warn("[WARNING] No transcription data received.");
        alert("Failed to retrieve transcription data.");
      }
    } catch (error) {
      console.error("[ERROR] Failed to transcribe with AI:", error);
      alert("AI transcription failed. Please check the logs.");
    } finally {
      setIsTranscribing(false);
    }
  };

  // 🔴 Handle content click (open modal)
  const handleContentClick = (index, content, start, end) => {
    if (!editable) return;
    setSelectedContent(content);
    setSelectedIndex(index);
    setSelectedTimestamp({ start, end });
    setModalOpen(true);
  };

  // 🔴 Handle content update
  const handleModalSave = () => {
    const updatedTimestamps = formData.timeStamp.map((item, i) =>
      i === selectedIndex ? { ...item, content: selectedContent } : item
    );
    setFormData({ ...formData, timeStamp: updatedTimestamps });
    setModalOpen(false);
  };

  // 🔴 Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    if (videoRef.current) {
      videoRef.current.loop = false;
    }
  };

  // 🔴 Format time in mm:ss
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // 🔴 Loop video between start and end timestamps when modal is open
  useEffect(() => {
    if (modalOpen && videoRef.current) {
      videoRef.current.currentTime = selectedTimestamp.start;
      videoRef.current.loop = true;

      const loopInterval = setInterval(() => {
        if (
          videoRef.current.currentTime < selectedTimestamp.start ||
          videoRef.current.currentTime >= selectedTimestamp.end
        ) {
          videoRef.current.currentTime = selectedTimestamp.start;
        }
      }, 500);

      return () => clearInterval(loopInterval);
    }
  }, [modalOpen, selectedTimestamp]);

  if (!formData) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">
          {editable ? "Edit Media Details" : "Media Details"}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => handleMarkCompleted(formData._id)}
        >
          Mark Completed
        </Button>
        <IconButton onClick={handleEditToggle}>
          {editable ? <SaveIcon color="primary" /> : <EditIcon />}
        </IconButton>
      </Box>

      <TextField
        fullWidth
        label="Pseudo Name"
        name="pseudoName"
        value={formData.pseudoName || ""}
        disabled
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title || ""}
        onChange={handleChange}
        disabled={!editable}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        disabled={!editable}
        sx={{ mb: 2 }}
      />

      <Box sx={{ textAlign: "center", my: 2 }}>
        {formData.mediaType === "photos" && (
          <img
            src={formData.mediaPath}
            alt={formData.pseudoName}
            style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
          />
        )}
        {formData.mediaType === "audios" && (
          <audio controls src={formData.mediaPath} style={{ width: "100%" }} />
        )}
        {formData.mediaType === "videos" && (
          <video
            ref={videoRef}
            controls
            src={formData.mediaPath}
            style={{ width: "100%", maxHeight: "400px" }}
          />
        )}
      </Box>

      <Box>
        merges
        {formData?.timeStamp?.map((c) => {
          return <p key={c.content}>{c.content}</p>;
        })}
      </Box>

      {(formData.mediaType === "audios" || formData.mediaType === "videos") && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Typography variant="h6">Timestamps</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAITranscription}
              disabled={isTranscribing}
              startIcon={
                isTranscribing ? <CircularProgress size={20} /> : <AddIcon />
              }
            >
              {isTranscribing ? "Transcribing..." : "Transcribe with AI"}
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Start Time (mm:ss)</TableCell>
                <TableCell>End Time (mm:ss)</TableCell>
                <TableCell>Content</TableCell>
                {editable && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.timeStamp?.map((time, index) => (
                <TableRow key={index}>
                  <TableCell>{formatTime(time.startTime)}</TableCell>
                  <TableCell>{formatTime(time.endTime)}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={time.content}
                      onClick={() =>
                        handleContentClick(
                          index,
                          time.content,
                          time.startTime,
                          time.endTime
                        )
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        cursor: editable ? "pointer" : "not-allowed",
                        "&:hover": editable
                          ? { backgroundColor: "#f0f0f0" }
                          : {},
                      }}
                    />
                  </TableCell>
                  {editable && (
                    <TableCell>
                      <IconButton
                        onClick={() => removeTimestampRow(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {editable && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                onClick={addTimestampRow}
                variant="contained"
                startIcon={<AddIcon />}
              >
                Add Timestamp
              </Button>
            </Box>
          )}
        </TableContainer>
      )}

      {/* 🔴 Modal for Editing Content */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="edit-content-modal"
        aria-describedby="modal-to-edit-transcription-content"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="edit-content-modal" variant="h6" sx={{ mb: 2 }}>
            Edit Transcription Content
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            value={selectedContent}
            onChange={(e) => setSelectedContent(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalSave}
            >
              Save
            </Button>
            <Button variant="outlined" color="error" onClick={handleModalClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MediaDisplay;
