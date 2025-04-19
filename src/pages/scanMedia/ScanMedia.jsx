import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useScanMedia } from "../../api/data/scanMedia";

function ScanMedia() {
  const [mediaType, setMediaType] = useState("videos");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const { mutate } = useScanMedia(mediaType);

  const handleScanMedia = () => {
    mutate(
      { password },
      {
        onSuccess: (data) => {
          console.log("Scan successful:", data);
          setData(data.data);
          setError(null);
          setPassword("");
        },
        onError: (error) => {
          console.error("Scan failed:", error);
          setError(
            error.response.data ? error.response.data : "Something went wrong"
          );
          setData(null);
        },
      }
    );
  };

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={5}
      display="flex"
      flexDirection="column"
      gap={2}
      p={3}
      boxShadow={0}
      borderRadius={2}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Scan Media
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="mediaType-label">Media Type</InputLabel>
        <Select
          labelId="mediaType-label"
          value={mediaType}
          label="Media Type"
          onChange={(e) => setMediaType(e.target.value)}
        >
          <MenuItem value="photos">Photos</MenuItem>
          <MenuItem value="videos">Videos</MenuItem>
          <MenuItem value="audios">Audios</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button variant="outlined" color="primary" onClick={handleScanMedia}>
        Scan
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && <p style={{ color: "green" }}>{data.length} files scanned</p>}
    </Box>
  );
}

export default ScanMedia;
