import React, { useState } from "react";
import { useUpdateMedia } from "../../api/data/updateMediaInfo";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

function UpdateField({ media, field, fieldType = "text", label }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(media[field]);

  const { mutate, isLoading } = useUpdateMedia();

  const handleSave = () => {
    mutate(
      {
        mediaId: media._id,
        formData: {
          [field]: value,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="updateField">
      <p className="fieldLabel">{label}</p>
      {isEditing ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            // label={label || field}
            variant="standard"
            multiline={fieldType === "textarea"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isLoading}
            fullWidth
            sx={{ width: "600px", maxWidth: "600px", color: "#424242" }}
          />
          <Button
            variant="outlined"
            onClick={handleSave}
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={18} />}
            sx={{ mt: 2, width: "98px" }}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : (
        <Typography
          variant="body1"
          onClick={() => setIsEditing(true)}
          sx={{ cursor: "pointer", whiteSpace: "pre-wrap" }}
        >
          {value || "Click to edit"}
        </Typography>
      )}
    </div>
  );
}

export default UpdateField;
