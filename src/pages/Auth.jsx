import { useEffect, useState } from "react";
import { login } from "../api/auth/login";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
} from "@mui/material";

function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      navigate("/");
    }
    setLoggedInUser(null);
  }, [loggedInUser]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const user = await login(data);
      console.log(user);
      setLoggedInUser(user);
    } catch (error) {
      console.error("Error during authentication:", error);
      alert(error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          {isLogin ? "Login" : "Register"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                name="email"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                variant="outlined"
                name="password"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                {isLogin ? "Login" : "Register"}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Button onClick={toggleAuthMode} color="secondary">
            {isLogin ? "Register" : "Login"}
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Auth;
