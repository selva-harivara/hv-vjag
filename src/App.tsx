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
import CurrencyList from "./pages/organization/harivaraone/currency-list";
import CurrencyEditor from "./pages/organization/harivaraone/currency-list/CurrencyEditor";
import InitCurrencyList from "./pages/organization/harivaraone/init-currency-list";
import InitCurrencyEditor from "./pages/organization/harivaraone/init-currency-list/CurrencyEditor";
import CountryEditor from "./pages/organization/harivaraone/country-inti/CountryEditor";
import CountryList from "./pages/organization/harivaraone/country-inti";
import EntityList from "./pages/organization/harivaraone/entity-list";
import EntityEditor from "./pages/organization/harivaraone/entity-list/EntityEditor";
import TdsSettingsList from "./pages/organization/tdssettings/tds";
import TdsSettingsEditor from "./pages/organization/tdssettings/tds/TdsSettingsEditor";
import GstSettingsList from "./pages/organization/companyInfo/gst-settings";
import GstEditor from "./pages/organization/companyInfo/gst-settings/gstEditor";
import HorizontalCAList from "./pages/organization/appMenus/horizontalCA/list";
import HzcaEditor from "./pages/organization/appMenus/horizontalCA/hzcaEditor";
import VerticalCAList from "./pages/organization/appMenus/verticalCA/list";
import VtcaEditor from "./pages/organization/appMenus/verticalCA/vtcaEditor";
import VerticalVAList from "./pages/organization/appMenus/verticalVA/list";
import VtVaEditor from "./pages/organization/appMenus/verticalVA/vtvaEditor";

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
                <Route
                  path="organization/harivaraone/init-currency"
                  element={<InitCurrencyList />}
                />
                <Route
                  path="organization/harivaraone/init-currency/add"
                  element={<InitCurrencyEditor mode="add" />}
                />
                <Route
                  path="organization/harivaraone/init-currency/edit/:id"
                  element={<InitCurrencyEditor mode="edit" />}
                />
                <Route
                  path="organization/harivaraone/init-currency/view/:id"
                  element={<InitCurrencyEditor mode="view" />}
                />
                <Route
                  path="organization/harivaraone/country-inti/add"
                  element={<CountryEditor mode="add" />}
                />
                <Route
                  path="organization/harivaraone/country-inti/edit/:id"
                  element={<CountryEditor mode="edit" />}
                />
                <Route
                  path="organization/harivaraone/country-inti/view/:id"
                  element={<CountryEditor mode="view" />}
                />
                <Route
                  path="organization/harivaraone/country-inti"
                  element={<CountryList />}
                />
                <Route
                  path="organization/harivaraone/entity-list"
                  element={<EntityList />}
                />
                <Route
                  path="organization/harivaraone/entity-list/add"
                  element={<EntityEditor mode="add" />}
                />
                <Route
                  path="organization/harivaraone/entity-list/edit/:id"
                  element={<EntityEditor mode="edit" />}
                />
                <Route
                  path="organization/harivaraone/entity-list/view/:id"
                  element={<EntityEditor mode="view" />}
                />
                <Route
                  path="organization/tds-settings/tds"
                  element={<TdsSettingsList />}
                />
                <Route
                  path="organization/tds-settings/tds/add"
                  element={<TdsSettingsEditor mode="add" />}
                />
                <Route
                  path="organization/tds-settings/tds/edit/:id"
                  element={<TdsSettingsEditor mode="edit" />}
                />
                <Route
                  path="organization/tds-settings/tds/view/:id"
                  element={<TdsSettingsEditor mode="view" />}
                />
                <Route
                  path="organization/company-info/gst-settings"
                  element={<GstSettingsList />}
                />
                <Route
                  path="organization/company-info/gst-settings/add"
                  element={<GstEditor mode="add" />}
                />
                <Route
                  path="organization/company-info/gst-settings/edit/:id"
                  element={<GstEditor mode="edit" />}
                />
                <Route
                  path="organization/company-info/gst-settings/view/:id"
                  element={<GstEditor mode="view" />}
                />
                <Route
                  path="organization/appMenus/horizontalCA"
                  element={<HorizontalCAList />}
                />
                <Route
                  path="organization/appMenus/horizontalCA/add"
                  element={<HzcaEditor mode="add" />}
                />
                <Route
                  path="organization/appMenus/horizontalCA/edit/:id"
                  element={<HzcaEditor mode="edit" />}
                />
                <Route
                  path="organization/appMenus/horizontalCA/view/:id"
                  element={<HzcaEditor mode="view" />}
                />
                <Route
                  path="organization/appMenus/verticalCA"
                  element={<VerticalCAList />}
                />
                <Route
                  path="organization/appMenus/verticalCA/add"
                  element={<VtcaEditor mode="add" />}
                />
                <Route
                  path="organization/appMenus/verticalCA/edit/:id"
                  element={<VtcaEditor mode="edit" />}
                />
                <Route
                  path="organization/appMenus/verticalCA/view/:id"
                  element={<VtcaEditor mode="view" />}
                />
                <Route
                  path="organization/appMenus/verticalVA"
                  element={<VerticalVAList />}
                />
                <Route
                  path="organization/appMenus/verticalVA/add"
                  element={<VtVaEditor mode="add" />}
                />
                <Route
                  path="organization/appMenus/verticalVA/edit/:id"
                  element={<VtVaEditor mode="edit" />}
                />
                <Route
                  path="organization/appMenus/verticalVA/view/:id"
                  element={<VtVaEditor mode="view" />}
                />
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
