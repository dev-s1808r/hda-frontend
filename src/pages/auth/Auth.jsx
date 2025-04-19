import { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import LoginUser from "../../components/auth/Login";
import RegisterUser from "../../components/auth/Register";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // or "register"

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f4f6f8"
      flexDirection={"column"}
    >
      <p className="appName" style={{ marginBottom: "24px" }}>
        Hari Krishna Mandir Digital Archive
      </p>
      <Paper
        elevation={0}
        sx={{
          padding: 2,
          borderRadius: 3,
          width: "100%",
          maxWidth: 500,
        }}
      >
        {mode === "login" ? <LoginUser /> : <RegisterUser />}

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </Typography>
          <Button onClick={toggleMode} sx={{ mt: 1 }}>
            {mode === "login" ? "Register here" : "Login here"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
