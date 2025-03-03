import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import useGetDbMeta from "../../api/data/dbMeta";
import useMedia from "../../api/data/media";

const MediaTable = ({ mediaType }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { meta, error: metaError, loading: loadingMeta } = useGetDbMeta();

  const totalRecords = meta
    ? mediaType === "videos"
      ? meta.videos
      : mediaType === "audios"
      ? meta.audios
      : mediaType === "photos"
      ? meta.photos
      : meta.totalMedia
    : 0;

  const { allMedia, loadingMedia, refetchMedia } = useMedia({
    type: mediaType,
    page: page + 1,
  });

  useEffect(() => {
    refetchMedia();
  }, [mediaType, page, rowsPerPage]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    refetchMedia();
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredMedia = allMedia?.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pseudoName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
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
            {loadingMedia || loadingMeta ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredMedia?.length > 0 ? (
              filteredMedia?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.pseudoName}</TableCell>
                  <TableCell>{item.title || "N/A"}</TableCell>
                  <TableCell>{item.description || "No description"}</TableCell>
                  <TableCell>{item.mediaType}</TableCell>
                  <TableCell>{item.isAssigned ? "✔️" : "❌"}</TableCell>
                  <TableCell>{item.isTouched ? "✔️" : "❌"}</TableCell>
                  <TableCell>{item.isVerified ? "✔️" : "❌"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No media found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
};

export default MediaTable;
