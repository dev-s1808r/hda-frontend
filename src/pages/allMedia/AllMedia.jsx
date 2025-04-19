import { useState, useMemo, useEffect } from "react";
import "./allMedia.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  Box,
  TableSortLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AdjustIcon from "@mui/icons-material/Adjust";
import LaunchIcon from "@mui/icons-material/Launch";
import useMedia from "../../api/data/media";
import Pagination from "@mui/material/Pagination";
import useGetDbMeta from "../../api/data/dbMeta";
import { useNavigate } from "react-router-dom";

const AllMedia = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [showOnlyTouched, setShowOnlyTouched] = useState(false);
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setPage(1);
  }, [
    typeFilter,
    searchTerm,
    showOnlyTouched,
    showOnlyAssigned,
    showOnlyVerified,
  ]);

  const navigate = useNavigate();

  const { allMedia = [] } = useMedia({
    type: typeFilter === "all" ? "" : typeFilter,
    page: page,
  });

  const { meta, loading, error, refetch } = useGetDbMeta();

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const isAsc = prev.key === key && prev.direction === "asc";
      return { key, direction: isAsc ? "desc" : "asc" };
    });
  };

  const filteredMedia = useMemo(() => {
    let filtered = allMedia;

    // Text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(term) ||
          item.pseudoName?.toLowerCase().includes(term)
      );
    }

    // Boolean filters
    if (showOnlyTouched) filtered = filtered.filter((m) => m.isTouched);
    if (showOnlyAssigned) filtered = filtered.filter((m) => m.isAssigned);
    if (showOnlyVerified) filtered = filtered.filter((m) => m.isVerified);

    // Sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === "boolean") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortConfig.direction === "asc"
          ? ("" + aVal).localeCompare("" + bVal)
          : ("" + bVal).localeCompare("" + aVal);
      });
    }

    return filtered;
  }, [
    allMedia,
    searchTerm,
    showOnlyTouched,
    showOnlyAssigned,
    showOnlyVerified,
    sortConfig,
  ]);

  return (
    <Box className="allMedia">
      <Typography variant="h6" sx={{ mb: 2 }}>
        All media
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="videos">Videos</MenuItem>
            <MenuItem value="audios">Audios</MenuItem>
            <MenuItem value="photos">Photos</MenuItem>
          </Select>

          <TextField
            label="Search Title or PseudoName"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOnlyTouched}
                  onChange={() => setShowOnlyTouched((prev) => !prev)}
                />
              }
              label="Touched"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOnlyAssigned}
                  onChange={() => setShowOnlyAssigned((prev) => !prev)}
                />
              }
              label="Assigned"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOnlyVerified}
                  onChange={() => setShowOnlyVerified((prev) => !prev)}
                />
              }
              label="Verified"
            />
          </div>
        </div>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(meta?.totalMedia / itemsPerPage)}
            page={page}
            setPage={setPage}
            onChange={(event, value) => setPage(value)}
            color="primary"
            siblingCount={1} // number of pages to show beside current
            boundaryCount={1}
          />
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Box} className="allMediaTable">
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #ccc",
              }}
            >
              <TableCell
                sx={{ fontWeight: "600", color: "#333", fontSize: "16px" }}
              >
                PseudoName
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", color: "#333", fontSize: "16px" }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", color: "#333", fontSize: "16px" }}
              >
                <TableSortLabel
                  active={sortConfig.key === "mediaType"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("mediaType")}
                >
                  Media Type
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", color: "#333", fontSize: "16px" }}
              >
                <TableSortLabel
                  active={sortConfig.key === "isAssigned"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("isAssigned")}
                >
                  Assigned
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", color: "#333", fontSize: "16px" }}
              >
                <TableSortLabel
                  active={sortConfig.key === "isTouched"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("isTouched")}
                >
                  Touched
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", color: "#333", fontSize: "16px" }}
              >
                <TableSortLabel
                  active={sortConfig.key === "isVerified"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("isVerified")}
                >
                  Verified
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", color: "#333", fontSize: "16px" }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredMedia.map((media) => (
              <TableRow key={media._id}>
                <TableCell>{media.pseudoName}</TableCell>
                <TableCell>{media.title || "-"}</TableCell>
                <TableCell>{media.mediaType}</TableCell>
                <TableCell>
                  {media.isAssigned ? (
                    <TaskAltIcon color="success" />
                  ) : (
                    <AdjustIcon color="disabled" />
                  )}
                </TableCell>
                <TableCell>
                  {media.isTouched ? (
                    <TaskAltIcon color="success" />
                  ) : (
                    <AdjustIcon color="disabled" />
                  )}
                </TableCell>
                <TableCell>
                  {media.isVerified ? (
                    <TaskAltIcon color="success" />
                  ) : (
                    <AdjustIcon color="disabled" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/verify-media/${media._id}`)}
                  >
                    <LaunchIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllMedia;
