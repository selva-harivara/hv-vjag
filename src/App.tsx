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
import InitCurrencyList from "./pages/organization/harivaraone/init-currency-list";
import InitCurrencyEditor from "./pages/organization/harivaraone/init-currency-list/CurrencyEditor";
import CountryEditor from "./pages/organization/harivaraone/country-inti/CountryEditor";
import CountryList from "./pages/organization/harivaraone/country-inti";
import EntityList from "./pages/organization/harivaraone/entity-list";
import EntityEditor from "./pages/organization/harivaraone/entity-list/EntityEditor";
import TdsSettingsList from "./pages/organization/tdssettings/tds";
import TdsSettingsEditor from "./pages/organization/tdssettings/tds/TdsSettingsEditor";

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
