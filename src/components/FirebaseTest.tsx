import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { Box, Typography, Button } from "@mui/material";

const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to get the current auth state
        await auth.currentUser;
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    testConnection();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Firebase Connection Test
      </Typography>
      <Box sx={{ mb: 2 }}>Status: {status}</Box>
      {status === "error" && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {errorMessage}
        </Typography>
      )}
      <Button variant="contained" onClick={() => window.location.reload()}>
        Retry Connection
      </Button>
    </Box>
  );
};

export default FirebaseTest;
