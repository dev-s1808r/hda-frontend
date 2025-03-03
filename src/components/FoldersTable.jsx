import React, { useState } from "react";

import useFolders from "../api/data/folder";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Collapse,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

function FoldersTable({ allowedFolders }) {
  console.log("allowed folder", allowedFolders);
  const [activeTab, setActiveTab] = useState(0); // Default to the first folder
  const [expandedRow, setExpandedRow] = useState(null); // Track the expanded row
  const { error: folderError, folders, loading } = useFolders();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setExpandedRow(null); // Collapse any expanded rows when switching tabs
  };

  const toggleRowExpansion = (fileId) => {
    setExpandedRow((prev) => (prev === fileId ? null : fileId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "orange";
      case "published":
        return "green";
      case "hidden":
        return "red";
      default:
        return "black";
    }
  };
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (folderError) {
    return (
      <Typography color="error" align="center">
        Error loading folders: {folderError.message}
      </Typography>
    );
  }
  return (
    <Box sx={{ maxWidth: "1080px", margin: "0 auto", padding: 2 }}>
      {/* Tabs for Folders */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {folders
          .filter(
            (folder) =>
              allowedFolders.some((allowed) => allowed._id === folder._id) // Check if folder._id exists in allowedFolders
          )
          .map((folder) => (
            <Tab key={folder._id} label={folder.folderName} />
          ))}
      </Tabs>

      {/* Table for Files in the Active Folder */}
      {folders[activeTab] && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Files in {folders[activeTab].folderName}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>File Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {folders[activeTab].file.map((file) => (
                  <React.Fragment key={file._id}>
                    {/* Main Row */}
                    <TableRow>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => toggleRowExpansion(file._id)}
                        >
                          {expandedRow === file._id ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>{file.fileName}</TableCell>
                      <TableCell
                        sx={{
                          color: getStatusColor(file.status),
                        }}
                      >
                        {file.status}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => window.open(file.filePath, "_blank")}
                        >
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row */}
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        <Collapse
                          in={expandedRow === file._id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>File Name:</strong> {file.fileName}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>File Path:</strong> {file.filePath}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Status:</strong> {file.status}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}

export default FoldersTable;
