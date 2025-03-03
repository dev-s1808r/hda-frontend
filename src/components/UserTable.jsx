import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

function UserTable({ users }) {
  // const [expandedRow, setExpandedRow] = useState(null);
  // const [selectedUser, setSelectedUser] = useState(null);
  // const [open, setOpen] = useState(false);
  // const [selectedFolders, setSelectedFolders] = useState([]);

  // const toggleRowExpansion = (userId) => {
  //   setExpandedRow((prev) => (prev === userId ? null : userId));
  // };

  // const openAssignModal = (user) => {
  //   setSelectedUser(user);
  //   setSelectedFolders([]);
  //   setOpen(true);
  // };

  // const closeAssignModal = () => {
  //   setSelectedUser(null);
  //   setSelectedFolders([]);
  //   setOpen(false);
  // };

  // const handleFolderSelection = (folderId) => {
  //   setSelectedFolders((prev) =>
  //     prev.includes(folderId)
  //       ? prev.filter((id) => id !== folderId)
  //       : [...prev, folderId]
  //   );
  // };

  // const handleAssign = () => {
  //   onAssignFolders(selectedUser._id, selectedFolders);
  //   closeAssignModal();
  // };

  console.log(users);

  return <Box sx={{ maxWidth: "1080px", margin: "0 auto", padding: 2 }}></Box>;
}

export default UserTable;
