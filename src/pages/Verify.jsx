import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TablePagination,
  Paper,
  AppBar,
  Toolbar,
  Modal,
} from "@mui/material";
import { api } from "../api/instance";
import useGetDbMeta from "../api/data/dbMeta";
import { Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import useMediaForVerification from "../api/data/mediaForVerification";
import ReactQuill from "react-quill";
import useOneMedia from "../api/data/oneMedia";
import useUpdateUserInfo from "../api/data/updateUserInfo";
import useAuth from "../context/useAuth";
import useAppStore from "../store/useAppStore";
import MarkdownRenderer from "../components/Media/DownloadPdf";

const MediaTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  const navigate = useNavigate();

  const mediaTypes = ["videos", "audios", "photos"];

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Harikrishna Mandir Digital Archiving System
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>
            Assignment
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="media tabs"
        >
          <Tab label="Videos" />
          <Tab label="Audios" />
          <Tab label="Photos" />
        </Tabs>
      </Box>
      <Box sx={{ padding: 2 }}>
        <MediaTable mediaType={mediaTypes[selectedTab]} />
      </Box>
    </Box>
  );
};

export default MediaTabs;

const MediaTable = ({ mediaType }) => {
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { meta, error: metaError, loading: loadingMeta } = useGetDbMeta();

  const totalRecords = meta ? meta[mediaType] || 0 : 0;

  const { touchedMedia, refetchMedia } = useMediaForVerification({
    type: mediaType,
    page: page + 1,
  });

  useEffect(() => {
    if (!meta || loadingMeta) return;
    refetchMedia();
  }, [mediaType, page, rowsPerPage, meta]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(null);
    // alert(`Media ID: ${mediaItem._id}`);
    setSelectedMedia(mediaItem);
  };

  const handleClose = () => {
    setSelectedMedia(null);
  };

  const filteredMedia = touchedMedia?.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pseudoName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: "100%",
        padding: 2,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* Selected Media Display */}
      <div>
        {selectedMedia && (
          <MediaDisplay media={selectedMedia} handleClose={handleClose} />
        )}
      </div>

      <div>
        {/* Search Bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField
            label="Search by Title or PseudoName"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: 300 }}
          />
        </Box>

        {/* Media Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pseudo Name</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Assigned</TableCell>
                <TableCell>Touched</TableCell>
                <TableCell>Verified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading || loadingMeta ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredMedia?.length > 0 ? (
                filteredMedia?.map((item) => (
                  <TableRow
                    key={item._id}
                    onClick={() => handleMediaClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{item.pseudoName}</TableCell>
                    <TableCell>{item.title || "N/A"}</TableCell>
                    <TableCell>
                      {item.description || "No description"}
                    </TableCell>
                    <TableCell>{item.mediaType}</TableCell>
                    <TableCell>{item.isAssigned ? "✔️" : "❌"}</TableCell>
                    <TableCell>{item.isTouched ? "✔️" : "❌"}</TableCell>
                    <TableCell>{item.isVerified ? "✔️" : "❌"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No media found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </Box>
  );
};

const MediaDisplay = ({ media, handleClose }) => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    ...media,
    timeStamp: media.timeStamp || [],
  });
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    setFormData({ ...media, timeStamp: media.timeStamp || [] });
  }, [media]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const userDetails = useAppStore.getState().user;

  console.log(userDetails, "from verify");
  const { media: newMedia, refetchMedia } = useOneMedia(
    userDetails?.assignedMedia?._id
  );

  const handleMarkVerified = async (id) => {
    // alert(id);
    try {
      let res = await api.patch("/media/mark-verified", {
        mediaId: userDetails?.assignedMedia._id,
      });
      console.log(res.data, "updated media %%%%%");
      window.location.reload();
    } catch (error) {
      console.log(error);
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

  // 🔴 Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    if (videoRef.current) {
      videoRef.current.loop = false;
    }
  };

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

  const handleContentClick = (index, content, startTime, endTime) => {
    if (!editable) return;
    setSelectedContent(content);
    setSelectedIndex(index);
    setModalOpen(true);
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.loop = true;
      const loopInterval = setInterval(() => {
        if (
          videoRef.current.currentTime < startTime ||
          videoRef.current.currentTime >= endTime
        ) {
          videoRef.current.currentTime = startTime;
        }
      }, 500);
      return () => clearInterval(loopInterval);
    }
  };

  const handleModalSave = () => {
    const updatedTimestamps = formData.timeStamp.map((item, i) =>
      i === selectedIndex ? { ...item, content: selectedContent } : item
    );
    setFormData({ ...formData, timeStamp: updatedTimestamps });
    setModalOpen(false);
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        mb: 2,
        maxWidth: "1080px",
        marginRight: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {editable ? "Edit Media" : "Media Details"}
        </Typography>
        <Button
          sx={{ mb: 2 }}
          variant="outlined"
          onClick={() => handleMarkVerified(formData._id)}
        >
          Mark Verified
        </Button>
        <Box>
          <IconButton onClick={handleEditToggle}>
            {editable ? <SaveIcon color="primary" /> : <EditIcon />}
          </IconButton>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
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

      {media?.mediaType === "videos" && (
        <video
          ref={videoRef}
          controls
          src={media?.mediaPath}
          style={{ width: "100%", maxHeight: "400px" }}
        />
      )}

      <MarkdownRenderer formData={formData} />

      <Box>
        {(formData.mediaType === "audios" ||
          formData.mediaType === "videos") && (
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
                          editable && handleContentClick(index, time.content)
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* 🔴 Modal for Editing Content (ReactQuill for Rich Text Editing) */}
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
              width: 500,
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
            <ReactQuill
              value={selectedContent}
              onChange={setSelectedContent}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ align: [] }],
                  [{ color: [] }, { background: [] }],
                  ["clean"],
                ],
              }}
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
              <Button
                variant="outlined"
                color="error"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
