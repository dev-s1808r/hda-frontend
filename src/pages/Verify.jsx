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
    alert(`Media ID: ${mediaItem._id}`);
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

// const MediaDisplay = ({ media, handleClose }) => {
//   const [editable, setEditable] = useState(false);
//   const [formData, setFormData] = useState({ ...media });

//   // ✅ Ensures media updates when a new row is clicked
//   useEffect(() => {
//     setFormData({ ...media, timeStamp: media.timeStamp || [] });
//   }, [media]);

//   // Handle verifying the media
//   async function handleVerify() {
//     try {
//       await api.patch("/media/mark-verified", { mediaId: media._id });
//       window.location.reload();
//     } catch (error) {
//       console.error("Error verifying media:", error);
//     }
//   }

//   // Handle saving the updated media data
//   async function handleSave() {
//     try {
//       let response = await api.patch("/media/update-media", {
//         mediaId: media._id,
//         formData,
//       });
//       setFormData(response.data.updatedMedia);
//       setEditable(false);
//     } catch (error) {
//       console.error("Error saving media:", error);
//     }
//   }

//   // Handle changes to form inputs
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle changes in timestamp fields
//   const handleTimestampChange = (index, field, value) => {
//     let updatedTimestamps = [...formData.timeStamp];
//     updatedTimestamps[index][field] = value;
//     setFormData({ ...formData, timeStamp: updatedTimestamps });
//   };

//   // Add a new timestamp entry
//   const addTimestampRow = () => {
//     setFormData({
//       ...formData,
//       timeStamp: [
//         ...formData.timeStamp,
//         { startTime: "", endTime: "", content: "" },
//       ],
//     });
//   };

//   // Remove a timestamp entry
//   const removeTimestampRow = (index) => {
//     let updatedTimestamps = [...formData.timeStamp];
//     updatedTimestamps.splice(index, 1);
//     setFormData({ ...formData, timeStamp: updatedTimestamps });
//   };

//   return (
//     <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mb: 2 }}>
//       {/* Header with Edit, Save, Close Buttons */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h6">
//           {editable ? "Edit Media" : "Media Details"}
//         </Typography>
//         <Box>
//           {editable ? (
//             <IconButton onClick={handleSave}>
//               <SaveIcon color="primary" />
//             </IconButton>
//           ) : (
//             <IconButton onClick={() => setEditable(true)}>
//               <EditIcon />
//             </IconButton>
//           )}
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </Box>

//       {/* Media Details (Editable Fields) */}
//       <TextField
//         fullWidth
//         label="Pseudo Name"
//         name="pseudoName"
//         value={formData.pseudoName}
//         disabled
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         fullWidth
//         label="Title"
//         name="title"
//         value={formData.title || ""}
//         onChange={handleChange}
//         disabled={!editable}
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         fullWidth
//         label="Description"
//         name="description"
//         value={formData.description || ""}
//         onChange={handleChange}
//         disabled={!editable}
//         sx={{ mb: 2 }}
//       />
//       {formData.eventName && (
//         <TextField
//           fullWidth
//           label="Event Name"
//           name="eventName"
//           value={formData.eventName || ""}
//           onChange={handleChange}
//           disabled={!editable}
//           sx={{ mb: 2 }}
//         />
//       )}
//       {formData.eventLocation && (
//         <TextField
//           fullWidth
//           label="Event Location"
//           name="eventLocation"
//           value={formData.eventLocation || ""}
//           onChange={handleChange}
//           disabled={!editable}
//           sx={{ mb: 2 }}
//         />
//       )}

//       {/* Media Rendering */}
//       <Box sx={{ textAlign: "center", my: 2 }}>
//         {formData.mediaType === "photos" && (
//           <img
//             src={formData.mediaPath}
//             alt={formData.pseudoName}
//             style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
//           />
//         )}
//         {formData.mediaType === "audios" && (
//           <audio controls src={formData.mediaPath} style={{ width: "100%" }} />
//         )}
//         {formData.mediaType === "videos" && (
//           <video
//             controls
//             src={formData.mediaPath}
//             style={{ width: "100%", maxHeight: "400px" }}
//           />
//         )}
//       </Box>

//       {/* Timestamp Table (Editable) */}
//       {(formData.mediaType === "audios" || formData.mediaType === "videos") && (
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Typography variant="h6" sx={{ p: 2 }}>
//             Timestamps
//           </Typography>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Start Time</TableCell>
//                 <TableCell>End Time</TableCell>
//                 <TableCell>Content</TableCell>
//                 {editable && <TableCell>Actions</TableCell>}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {formData.timeStamp.map((time, index) => (
//                 <TableRow key={index}>
//                   <TableCell>
//                     <TextField
//                       type="number"
//                       value={time.startTime || ""}
//                       onChange={(e) =>
//                         handleTimestampChange(
//                           index,
//                           "startTime",
//                           e.target.value
//                         )
//                       }
//                       disabled={!editable}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       type="number"
//                       value={time.endTime || ""}
//                       onChange={(e) =>
//                         handleTimestampChange(index, "endTime", e.target.value)
//                       }
//                       disabled={!editable}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       fullWidth
//                       value={time.content || ""}
//                       onChange={(e) =>
//                         handleTimestampChange(index, "content", e.target.value)
//                       }
//                       disabled={!editable}
//                     />
//                   </TableCell>
//                   {editable && (
//                     <TableCell>
//                       <IconButton
//                         onClick={() => removeTimestampRow(index)}
//                         color="error"
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           {editable && (
//             <Box sx={{ textAlign: "center", mt: 2 }}>
//               <Button
//                 onClick={addTimestampRow}
//                 variant="contained"
//                 startIcon={<AddIcon />}
//               >
//                 Add Timestamp
//               </Button>
//             </Box>
//           )}
//         </TableContainer>
//       )}

//       {/* Verify Button */}
//       <Box sx={{ textAlign: "center", mt: 2 }}>
//         <Button variant="contained" color="primary" onClick={handleVerify}>
//           Verify
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// const MediaDisplay = ({ media, handleClose }) => {
//   const [editable, setEditable] = useState(false);
//   const [formData, setFormData] = useState({
//     ...media,
//     timeStamp: media.timeStamp || [],
//   });
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedContent, setSelectedContent] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     setFormData({ ...media, timeStamp: media.timeStamp || [] });
//   }, [media]);

//   const handleContentClick = (index, content, startTime, endTime) => {
//     if (!editable) return;
//     setSelectedContent(content);
//     setSelectedIndex(index);
//     setModalOpen(true);
//     if (videoRef.current) {
//       videoRef.current.currentTime = startTime;
//       videoRef.current.loop = true;
//       const loopInterval = setInterval(() => {
//         if (
//           videoRef.current.currentTime < startTime ||
//           videoRef.current.currentTime >= endTime
//         ) {
//           videoRef.current.currentTime = startTime;
//         }
//       }, 500);
//       return () => clearInterval(loopInterval);
//     }
//   };

//   const handleModalSave = () => {
//     const updatedTimestamps = formData.timeStamp.map((item, i) =>
//       i === selectedIndex ? { ...item, content: selectedContent } : item
//     );
//     setFormData({ ...formData, timeStamp: updatedTimestamps });
//     setModalOpen(false);
//   };

//   return (
//     <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mb: 2 }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h6">
//           {editable ? "Edit Media" : "Media Details"}
//         </Typography>
//         <Box>
//           <IconButton onClick={() => setEditable(!editable)}>
//             {editable ? <SaveIcon color="primary" /> : <EditIcon />}
//           </IconButton>
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </Box>

//       {media.mediaType === "videos" && (
//         <video
//           ref={videoRef}
//           controls
//           src={media.mediaPath}
//           style={{ width: "100%", maxHeight: "400px" }}
//         />
//       )}

//       {formData.timeStamp?.map((t) => (
//         <span key={t.content}>{t.content}</span>
//       ))}

//       <TableContainer component={Paper} sx={{ mt: 2 }}>
//         <Typography variant="h6" sx={{ p: 2 }}>
//           Timestamps
//         </Typography>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Start Time</TableCell>
//               <TableCell>End Time</TableCell>
//               <TableCell>Content</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {formData.timeStamp.map((time, index) => (
//               <TableRow key={index}>
//                 <TableCell>{time.startTime}</TableCell>
//                 <TableCell>{time.endTime}</TableCell>
//                 <TableCell>
//                   <TextField
//                     fullWidth
//                     value={time.content || ""}
//                     onClick={() =>
//                       handleContentClick(
//                         index,
//                         time.content,
//                         time.startTime,
//                         time.endTime
//                       )
//                     }
//                     InputProps={{
//                       readOnly: true,
//                     }}
//                     sx={{
//                       cursor: editable ? "pointer" : "not-allowed",
//                       "&:hover": editable ? { backgroundColor: "#f0f0f0" } : {},
//                     }}
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//         <Box
//           sx={{ p: 2, backgroundColor: "white", margin: "auto", width: "50%" }}
//         >
//           <Typography variant="h6">Edit Transcript</Typography>
//           <TextField
//             fullWidth
//             multiline
//             minRows={4}
//             value={selectedContent}
//             onChange={(e) => setSelectedContent(e.target.value)}
//           />
//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//             <Button variant="contained" onClick={handleModalSave}>
//               Save
//             </Button>
//             <Button variant="outlined" onClick={() => setModalOpen(false)}>
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// const MediaDisplay = ({ media, handleClose }) => {
//   const [editable, setEditable] = useState(false);
//   const [formData, setFormData] = useState({
//     ...media,
//     timeStamp: media.timeStamp || [],
//   });
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedContent, setSelectedContent] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [currentTime, setCurrentTime] = useState(0);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     setFormData({ ...media, timeStamp: media.timeStamp || [] });
//   }, [media]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (videoRef.current) {
//         setCurrentTime(videoRef.current.currentTime);
//       }
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);

//   const handleContentClick = (index, content, startTime, endTime) => {
//     if (!editable) return;
//     setSelectedContent(content);
//     setSelectedIndex(index);
//     setModalOpen(true);
//     if (videoRef.current) {
//       videoRef.current.currentTime = startTime;
//       videoRef.current.loop = true;
//       const loopInterval = setInterval(() => {
//         if (
//           videoRef.current.currentTime < startTime ||
//           videoRef.current.currentTime >= endTime
//         ) {
//           videoRef.current.currentTime = startTime;
//         }
//       }, 500);
//       return () => clearInterval(loopInterval);
//     }
//   };

//   const handleModalSave = () => {
//     const updatedTimestamps = formData.timeStamp.map((item, i) =>
//       i === selectedIndex ? { ...item, content: selectedContent } : item
//     );
//     setFormData({ ...formData, timeStamp: updatedTimestamps });
//     setModalOpen(false);
//   };

//   return (
//     <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mb: 2 }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h6">
//           {editable ? "Edit Media" : "Media Details"}
//         </Typography>
//         <Box>
//           <IconButton onClick={() => setEditable(!editable)}>
//             {editable ? <SaveIcon color="primary" /> : <EditIcon />}
//           </IconButton>
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </Box>

//       {media.mediaType === "videos" && (
//         <video
//           ref={videoRef}
//           controls
//           src={media.mediaPath}
//           style={{ width: "100%", maxHeight: "400px" }}
//         />
//       )}

//       <Box>
//         {formData.timeStamp?.map((t) => (
//           <span
//             key={t.content}
//             style={{
//               fontWeight:
//                 currentTime >= t.startTime && currentTime <= t.endTime
//                   ? "bold"
//                   : "normal",
//               backgroundColor:
//                 currentTime >= t.startTime && currentTime <= t.endTime
//                   ? "yellow"
//                   : "transparent",
//               padding: "2px 5px",
//               borderRadius: "4px",
//             }}
//           >
//             {t.content}
//           </span>
//         ))}
//       </Box>

//       <TableContainer component={Paper} sx={{ mt: 2 }}>
//         <Typography variant="h6" sx={{ p: 2 }}>
//           Timestamps
//         </Typography>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Start Time</TableCell>
//               <TableCell>End Time</TableCell>
//               <TableCell>Content</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {formData.timeStamp.map((time, index) => (
//               <TableRow key={index}>
//                 <TableCell>{time.startTime}</TableCell>
//                 <TableCell>{time.endTime}</TableCell>
//                 <TableCell>
//                   <TextField
//                     fullWidth
//                     value={time.content || ""}
//                     onClick={() =>
//                       handleContentClick(
//                         index,
//                         time.content,
//                         time.startTime,
//                         time.endTime
//                       )
//                     }
//                     InputProps={{
//                       readOnly: true,
//                     }}
//                     sx={{
//                       cursor: editable ? "pointer" : "not-allowed",
//                       "&:hover": editable ? { backgroundColor: "#f0f0f0" } : {},
//                     }}
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//         <Box
//           sx={{ p: 2, backgroundColor: "white", margin: "auto", width: "50%" }}
//         >
//           <Typography variant="h6">Edit Transcript</Typography>
//           <TextField
//             fullWidth
//             multiline
//             minRows={4}
//             value={selectedContent}
//             onChange={(e) => setSelectedContent(e.target.value)}
//           />
//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//             <Button variant="contained" onClick={handleModalSave}>
//               Save
//             </Button>
//             <Button variant="outlined" onClick={() => setModalOpen(false)}>
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

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
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mb: 2 }}>
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
        <Box>
          <IconButton onClick={() => setEditable(!editable)}>
            {editable ? <SaveIcon color="primary" /> : <EditIcon />}
          </IconButton>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {media.mediaType === "videos" && (
        <video
          ref={videoRef}
          controls
          src={media.mediaPath}
          style={{ width: "100%", maxHeight: "400px" }}
        />
      )}

      <Box>
        {formData.timeStamp?.map((t) => (
          <span
            key={t.content}
            style={{
              fontWeight:
                currentTime >= t.startTime && currentTime <= t.endTime
                  ? "bold"
                  : "normal",
              backgroundColor:
                currentTime >= t.startTime && currentTime <= t.endTime
                  ? "yellow"
                  : "transparent",
              padding: "2px 5px",
              borderRadius: "4px",
            }}
          >
            {t.content}
          </span>
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Timestamps
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.timeStamp.map((time, index) => (
              <TableRow key={index}>
                <TableCell>{time.startTime}</TableCell>
                <TableCell>{time.endTime}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={time.content || ""}
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
                      "&:hover": editable ? { backgroundColor: "#f0f0f0" } : {},
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{ p: 2, backgroundColor: "white", margin: "auto", width: "50%" }}
        >
          <Typography variant="h6">Edit Transcript</Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            value={selectedContent}
            onChange={(e) => setSelectedContent(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" onClick={handleModalSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
