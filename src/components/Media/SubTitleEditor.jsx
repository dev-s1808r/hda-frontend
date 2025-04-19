import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Modal,
  CircularProgress,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from "react-quill";
import { api } from "../../api/instance";
import { useUpdateMedia } from "../../api/data/updateMediaInfo";
import jsPDF from "jspdf";
import { convert } from "html-to-text";
import "react-quill/dist/quill.core.css";

const SubtitleEditor = ({
  formData,
  setFormData,
  editable,
  mediaType,
  videoRef,
}) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedTimestamp, setSelectedTimestamp] = useState({
    start: 0,
    end: 0,
  });
  const [postTranscriptionModalOpen, setPostTranscriptionModalOpen] =
    useState(false);

  const handleAITranscription = async () => {
    if (!formData.mediaPath) {
      alert("Media path is missing!");
      return;
    }

    setIsTranscribing(true);
    try {
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
        setPostTranscriptionModalOpen(true);
      } else {
        alert("Failed to retrieve transcription data.");
      }
    } catch (error) {
      console.error("[ERROR] Transcription failed:", error);
      alert("AI transcription failed.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!formData?.timeStamp || formData.timeStamp.length === 0) {
      alert("No subtitles to download.");
      return;
    }

    const doc = new jsPDF();
    const lineHeight = 10;
    let y = 10;

    doc.setFontSize(12);
    doc.text(`Subtitle Transcript for ${formData.pseudoName}`, 10, y);
    y += lineHeight * 2;

    formData.timeStamp.forEach((item, index) => {
      const start = formatTime(item.startTime);
      const end = formatTime(item.endTime);
      const content = convert(item.content, {
        wordwrap: 80,
        selectors: [{ selector: "a", options: { ignoreHref: true } }],
      });

      const block = `(${start} - ${end})\n${content}\n`;
      const lines = doc.splitTextToSize(block, 180);

      if (y + lines.length * lineHeight > 280) {
        doc.addPage();
        y = 10;
      }

      doc.text(lines, 10, y);
      y += lines.length * lineHeight;
    });

    doc.save(`subtitles_${formData.pseudoName || "export"}.pdf`);
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
    const updated = [...formData.timeStamp];
    updated.splice(index, 1);
    setFormData({ ...formData, timeStamp: updated });
  };

  const handleContentClick = (index, content, start, end) => {
    if (!editable) return;
    setSelectedContent(content);
    setSelectedIndex(index);
    setSelectedTimestamp({ start, end });
    setModalOpen(true);
  };

  const handleModalSave = () => {
    const updated = formData.timeStamp.map((item, i) =>
      i === selectedIndex ? { ...item, content: selectedContent } : item
    );
    setFormData({ ...formData, timeStamp: updated });
    setModalOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (videoRef.current) {
      videoRef.current.loop = false;
      videoRef.current.currentTime = 0; // Reset to start
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const { mutate: updateMedia, isLoading: isSaving } = useUpdateMedia();

  const handleSaveSubtitles = () => {
    updateMedia(
      {
        mediaId: formData._id,
        formData: {
          timeStamp: formData.timeStamp, // Renaming key as per model
        },
      },
      {
        onSuccess: () => {
          alert("Subtitles saved successfully!");
        },
        onError: () => {
          alert("Failed to save subtitles. Please try again.");
        },
      }
    );
  };

  useEffect(() => {
    if (modalOpen && videoRef.current) {
      const start = parseFloat(selectedTimestamp.start);
      const end = parseFloat(selectedTimestamp.end);

      if (!isNaN(start) && !isNaN(end) && start >= 0 && end > start) {
        videoRef.current.currentTime = start;
        videoRef.current.loop = true;

        const loopInterval = setInterval(() => {
          if (
            videoRef.current.currentTime < start ||
            videoRef.current.currentTime >= end
          ) {
            videoRef.current.currentTime = start;
          }
        }, 500);

        return () => clearInterval(loopInterval);
      }
    }
  }, [modalOpen, selectedTimestamp]);

  if (!(mediaType === "audios" || mediaType === "videos")) return null;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginTop: "16px", position: "relative" }}>
        <Box
          sx={{
            position: "sticky",
            bgcolor: "whitesmoke",
            padding: "16px ",
            top: 0,
            right: 0,
            zIndex: 1200,
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleAITranscription}
            disabled={isTranscribing}
            startIcon={
              isTranscribing ? <CircularProgress size={20} /> : <AddIcon />
            }
          >
            {isTranscribing ? "Transcribing..." : "Transcribe with AI"}
          </Button>

          <Button variant="outlined" onClick={handleDownloadPDF}>
            Download as PDF
          </Button>

          {editable && (
            <Button
              onClick={handleSaveSubtitles}
              variant="outlined"
              color="success"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}
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
                  <div
                    dangerouslySetInnerHTML={{ __html: time.content }}
                    onClick={() =>
                      editable &&
                      handleContentClick(
                        index,
                        time.content,
                        time.startTime,
                        time.endTime
                      )
                    }
                    style={{
                      cursor: editable ? "pointer" : "not-allowed",
                      padding: "8px",
                      borderRadius: "4px",
                      border: editable ? "1px solid #ddd" : "none",
                      backgroundColor: editable ? "#f9f9f9" : "transparent",
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

        {/* {editable && (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              onClick={addTimestampRow}
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add Timestamp
            </Button>
          </Box>
        )} */}
      </div>

      {/* Modal for Editing Content */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Transcription Content
          </Typography>
          <ReactQuill
            value={selectedContent}
            onChange={setSelectedContent}
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: ["small", false, "large", "huge"] }],

                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ align: [] }],
                [{ color: [] }, { background: [] }],
                ["clean"],
              ],
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button variant="contained" onClick={handleModalSave}>
              Update
            </Button>
            <Button variant="outlined" color="error" onClick={handleModalClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={postTranscriptionModalOpen}
        onClose={() => setPostTranscriptionModalOpen(false)}
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
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Transcription Completed
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Do you want to save the generated subtitles?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              variant="contained"
              onClick={() => {
                handleSaveSubtitles();
                setPostTranscriptionModalOpen(false);
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setPostTranscriptionModalOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default SubtitleEditor;
