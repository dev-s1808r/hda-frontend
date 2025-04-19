import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRegister } from "../../api/data/regsiter";
import { useNavigate } from "react-router-dom";

export default function RegisterUser() {
  const { mutate, isLoading, isSuccess, isError, error } = useRegister();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    mutate(form, {
      onSuccess: (data) => {},
      onError: (error) => {
        console.error("Error:", error);
      },
    });
  };

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={5}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h5">Register</Typography>

      <TextField
        label="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        fullWidth
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </Button>

      {isSuccess && (
        <Alert severity="success">
          Registered successfully! Click on login to continue
        </Alert>
      )}
      {isError && (
        <Alert severity="error">
          {error?.response?.data || "Registration failed."}
        </Alert>
      )}
    </Box>
  );
}
