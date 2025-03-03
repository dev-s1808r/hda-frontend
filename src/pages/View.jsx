import React, { useState } from "react";
import AddFolder from "../components/SendFolder";
import FilesList from "../components/FileList";
import useFolders from "../api/data/folder";
import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";

function View() {
  const { error: folderError, folders, loading, refetch } = useFolders();
  const [openFolderId, setOpenFolderId] = useState(null); // Track the currently opened folder

  const { logout } = useAuth();

  const containerStyle = {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
  };

  const folderListStyle = {
    listStyleType: "none",
    padding: 0,
  };

  const folderItemStyle = {
    padding: "10px",
    marginBottom: "5px",
    backgroundColor: "#f1f1f1",
    border: "1px solid #ccc",
    borderRadius: "4px",
    textAlign: "left",
    cursor: "pointer",
  };

  const errorStyle = {
    color: "red",
    marginBottom: "20px",
  };

  const toggleFolder = (folderId) => {
    setOpenFolderId((prev) => (prev === folderId ? null : folderId));
  };

  return (
    <div style={containerStyle}>
      <Link to={"/login"}> login </Link>
      {folderError && (
        <p style={errorStyle}>Something went wrong: {folderError}</p>
      )}
      {/* <button style={buttonStyle} onClick={refetch}>
        Refetch Folders
      </button> */}
      <h1 style={{ color: "#007BFF", marginBottom: "20px" }} onClick={logout}>
        HDA Folders
      </h1>
      {loading ? (
        <p>Loading folders...</p>
      ) : (
        <ul style={folderListStyle}>
          {folders.map((f) => (
            <li key={f._id} style={folderItemStyle}>
              <div onClick={() => toggleFolder(f._id)}>
                {f.folderName}
                <span style={{ float: "right", color: "#007BFF" }}>
                  {openFolderId === f._id ? "▲" : "▼"}
                </span>
              </div>
              {openFolderId === f._id && (
                <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                  <FilesList folderId={f._id} /> {/* Display FilesList here */}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <AddFolder refetch={refetch} />
    </div>
  );
}

export default View;
