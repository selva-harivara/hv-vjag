import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import { theme } from "./theme";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import FirebaseTest from "./components/FirebaseTest";
import { ModuleProvider } from "./contexts/ModuleContext";
import CurrencyList from "./pages/organization/harivaraone/currency-list";
import CurrencyEditor from "./pages/organization/harivaraone/currency-list/CurrencyEditor";

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
                  path="organization/harivaraone/currency"
                  element={<CurrencyList />}
                />
                <Route
                  path="organization/harivaraone/currency/add"
                  element={<CurrencyEditor mode="add" />}
                />
                <Route
                  path="organization/harivaraone/currency/edit/:id"
                  element={<CurrencyEditor mode="edit" />}
                />
                <Route
                  path="organization/harivaraone/currency/view/:id"
                  element={<CurrencyEditor mode="view" />}
                />
                {/* Add more routes here */}
              </Route>
            </Routes>
          </Router>
        </ModuleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
