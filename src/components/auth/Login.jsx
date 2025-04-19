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
import { useLogin } from "../../api/data/login";
import useAppStore from "../../store/useAppStore";
import useAuth from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginUser() {
  const { mutate, isLoading, isSuccess, isError, error, data } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { validateToken } = useAuth();
  const navigate = useNavigate();

  function setUserToState(data) {
    const setUser = useAppStore.getState().setUser;
    setUser(data);
  }

  const handleSubmit = () => {
    mutate(form, {
      onSuccess: (data) => {
        console.log("Success:", data);
        const { token, user } = data.data;
        if (token) {
          localStorage.setItem("t", token);
        }
        setUserToState(user);
        validateToken();
        navigate("/");
        return user;
      },
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
      <Typography variant="h5">Login</Typography>

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

      <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      {isSuccess && (
        <Alert severity="success">Welcome, {data?.user?.email}!</Alert>
      )}
      {isError && (
        <Alert severity="error">
          {error?.response?.data || "Login failed."}
        </Alert>
      )}
    </Box>
  );
}
