import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  if (loading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url('/images/login-pg.svg') center center / cover no-repeat fixed`,
        position: "relative",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              boxShadow: "0px 3px 6px #00000029",
              borderRadius: "20px",
              opacity: 1,
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              WebkitBackdropFilter: "blur(10px)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box mb={3}>
              <img
                src="/images/logo-vjag.svg"
                alt="Harivara Logo"
                style={{ width: 90, height: 90, borderRadius: 16 }}
              />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Please sign in to continue
            </Typography>
            <Button
              fullWidth
              variant="contained"
              startIcon={
                <img
                  src="/images/google-g.svg"
                  alt="Google"
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
              }
              onClick={handleGoogleSignIn}
              sx={{
                mt: 1,
                mb: 2,
                backgroundColor: "#fff",
                color: "#5F79D9",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Sign in with Google
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
