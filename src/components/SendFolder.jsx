import React, { useState } from "react";
import api from "../api/instance";

function AddFolder({ refetch }) {
  const [folderName, setFolderName] = useState("");
  const [contentType, setContentType] = useState("documents");
  const [folderLocation, setFolderLocation] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleFileSelection = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      const fullPath = file.path || file.webkitRelativePath || file.name; // Get the file's relative or full path
      const folderPath = fullPath.substring(0, fullPath.lastIndexOf("\\")); // Extract folder path for Windows

      setFolderLocation(folderPath); // Populate folderLocation with the extracted path
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/add-folder", {
        folderName,
        folderLocation,
        contentType,
        files: [], // No files are sent, as we're only interested in the folder
      });
      setResponseMessage(
        `Folder "${response.data.folderName}" added successfully.`
      );
      refetch();
    } catch (error) {
      setResponseMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const containerStyle = {
    maxWidth: "500px",
    margin: "20px 0",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f9f9f9",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "left", // Ensure left alignment
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    textAlign: "left", // Left-aligned text inside the input
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#007BFF", marginBottom: "20px", textAlign: "left" }}>
        Add Folder
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="browseFile" style={labelStyle}>
            Browse:
          </label>
          <input
            id="browseFile"
            type="file"
            onChange={handleFileSelection}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <div>
          <label htmlFor="folderLocation" style={labelStyle}>
            Folder Path:
          </label>
          <input
            id="folderLocation"
            type="text"
            value={folderLocation}
            onChange={(e) =>
              setFolderLocation(e.target.value.replace(/\\/g, "\\\\"))
            }
            placeholder="Enter folder path (e.g., D:\\MyFiles\\MyFolder)"
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label htmlFor="folderName" style={labelStyle}>
            Folder Name:
          </label>
          <input
            id="folderName"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name (e.g., MyFolder)"
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label htmlFor="contentType" style={labelStyle}>
            Content Type:
          </label>
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            style={inputStyle}
          >
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="photos">Photos</option>
            <option value="documents">Documents</option>
          </select>
        </div>
        <button type="submit" style={buttonStyle}>
          Add Folder
        </button>
      </form>
      {responseMessage && (
        <p
          style={{
            marginTop: "20px",
            color: responseMessage.includes("Error") ? "red" : "green",
            textAlign: "left", // Left-aligned response message
          }}
        >
          {responseMessage}
        </p>
      )}
    </div>
  );
}

export default AddFolder;
