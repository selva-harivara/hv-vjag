import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import { theme } from "./theme";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import FirebaseTest from "./components/FirebaseTest";
import { ModuleProvider } from "./contexts/ModuleContext";
import ProfessionalHubList from "./pages/puja/professional/ProfessionalHubList";
import ProfessionalHubAdd from "./pages/puja/professional/ProfessionalHubAdd";
import LocationList from "./pages/organization/location/LocationList";
import LocationAdd from "./pages/organization/location/LocationAdd";
import PujareviewList from "./pages/puja/pujareview/PujareviewList";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ModuleProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/test" element={<FirebaseTest />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route
                  path="puja/professional"
                  element={<ProfessionalHubList />}
                />
                <Route
                  path="puja/professional/add"
                  element={<ProfessionalHubAdd />}
                />
                <Route
                  path="organization/location"
                  element={<LocationList />}
                />
                <Route
                  path="organization/location/add"
                  element={<LocationAdd />}
                />
                <Route path="puja/pujareview" element={<PujareviewList />} />
                <Route
                  path="*"
                  element={
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      minHeight="60vh"
                    >
                      <Typography variant="h3" fontWeight={700} mb={2}>
                        Page Not Found
                      </Typography>
                      <Typography variant="body1" mb={3}>
                        Sorry, the page you are looking for does not exist.
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => (window.location.href = "/")}
                      >
                        Go Home
                      </Button>
                    </Box>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </ModuleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
