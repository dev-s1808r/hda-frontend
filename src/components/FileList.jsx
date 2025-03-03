import React, { useEffect, useState } from "react";
import axios from "../api/instance";

function FilesList({ folderId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`/files/${folderId}`);
        setFiles(response.data);
        console.log(response.data[0]);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch files");
      } finally {
        setLoading(false);
      }
    };

    if (folderId) {
      fetchFiles();
    }
  }, [folderId]);

  const openFile = (filePath) => {
    window.open(filePath, "_blank"); // Open the file in a new tab
  };

  if (loading) return <p>Loading files...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>Files</h3>
      {files.length === 0 ? (
        <p>No files found for this folder.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {files.map((file) => (
            <li
              key={file._id}
              style={{
                padding: "10px",
                marginBottom: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
              }}
              onClick={() => openFile(file.filePath)} // Assuming filePath is the property storing the file's URL
            >
              {file.fileName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilesList;
