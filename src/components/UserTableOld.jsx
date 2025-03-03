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

  return (
    <Box sx={{ maxWidth: "1080px", margin: "0 auto", padding: 2 }}>
      {/* User Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>User Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Number of Folders</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                {/* Main Row */}
                <TableRow>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => toggleRowExpansion(user._id)}
                    >
                      {expandedRow === user._id ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.allowedFolders.length}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => openAssignModal(user)}
                    >
                      Assign Folders
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Expanded Row */}
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                  >
                    <Collapse
                      in={expandedRow === user._id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Folders Assigned:</strong>
                        </Typography>
                        <ul>
                          {user.allowedFolders.map((folder) => (
                            <li key={folder._id}>{folder.folderName}</li>
                          ))}
                        </ul>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assign Folders Modal */}
      <Dialog open={open} onClose={closeAssignModal} fullWidth>
        <DialogTitle>Assign Folders to {selectedUser?.userName}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Folder Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {folders
                .filter(
                  (folder) =>
                    !selectedUser?.allowedFolders.some(
                      (assignedFolder) => assignedFolder._id === folder._id
                    )
                )
                .map((folder) => (
                  <TableRow key={folder._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFolders.includes(folder._id)}
                        onChange={() => handleFolderSelection(folder._id)}
                      />
                    </TableCell>
                    <TableCell>{folder.folderName}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAssignModal}>Cancel</Button>
          <Button
            onClick={handleAssign}
            variant="contained"
            color="primary"
            disabled={selectedFolders.length === 0}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserTable;
