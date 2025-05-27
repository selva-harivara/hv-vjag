import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  menuName: Yup.string().required("Menu Name is required"),
  navigateTo: Yup.string()
    .url("Enter a valid URL")
    .required("Navigate To is required"),
  icon: Yup.string().url("Enter a valid URL").required("Icon URL is required"),
  status: Yup.boolean().required("Status is required"),
  rearrange: Yup.number()
    .typeError("Rearrange must be a number")
    .required("Rearrange is required"),
  menuType: Yup.string().required("Menu Type is required"),
  appType: Yup.string().required("App Type is required"),
});

const reference = {
  menuName: "",
  navigateTo: "",
  icon: "",
  status: true,
  rearrange: 1,
  menuType: "vertical",
  appType: "ca",
};

export default function HzcaEditor({
  mode = "add",
}: {
  mode?: "add" | "edit" | "view";
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(reference);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_API_BASE_URL}/menu/id/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch menu");
          return res.json();
        })
        .then((data) => setInitial(data.data))
        .catch((err) =>
          setSnackbar({ open: true, message: err.message, severity: "error" })
        )
        .finally(() => setLoading(false));
    } else {
      setInitial(reference);
    }
  }, [mode, id]);

  const formik = useFormik({
    initialValues: initial,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (mode === "add") {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/menu/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to save menu");
          }
        } else if (mode === "edit" && id) {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/menu/`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...values, _id: id }),
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to save menu");
          }
        }
        setSnackbar({
          open: true,
          message: "Saved successfully!",
          severity: "success",
        });
        setTimeout(() => navigate("/organization/appMenus/verticalCA"), 1000);
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || "Something went wrong",
          severity: "error",
        });
      }
    },
  });

  const isView = mode === "view";

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3, minHeight: "100vh", background: "#fafbff" }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <form
          onSubmit={formik.handleSubmit}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Paper
            sx={{
              width: 400,
              p: 4,
              borderRadius: 4,
              boxShadow: "0 8px 32px 0 rgba(95, 121, 217, 0.10)",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" mb={3} gap={2}>
              <Typography variant="h6" fontWeight={700}>
                Vertical Menus (CA)
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.status}
                    onChange={formik.handleChange}
                    name="status"
                    color="primary"
                    disabled={isView}
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Menu Name"
              name="menuName"
              value={formik.values.menuName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isView}
              error={Boolean(formik.touched.menuName && formik.errors.menuName)}
              helperText={formik.touched.menuName && formik.errors.menuName}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Navigate To"
              name="navigateTo"
              value={formik.values.navigateTo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isView}
              error={Boolean(
                formik.touched.navigateTo && formik.errors.navigateTo
              )}
              helperText={formik.touched.navigateTo && formik.errors.navigateTo}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Icon URL"
              name="icon"
              value={formik.values.icon}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isView}
              error={Boolean(formik.touched.icon && formik.errors.icon)}
              helperText={formik.touched.icon && formik.errors.icon}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Rearrange"
              name="rearrange"
              type="number"
              value={formik.values.rearrange}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isView}
              error={Boolean(
                formik.touched.rearrange && formik.errors.rearrange
              )}
              helperText={formik.touched.rearrange && formik.errors.rearrange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Menu Type"
              name="menuType"
              value={formik.values.menuType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={true}
              error={Boolean(formik.touched.menuType && formik.errors.menuType)}
              helperText={formik.touched.menuType && formik.errors.menuType}
            />
            <TextField
              fullWidth
              margin="normal"
              label="App Type"
              name="appType"
              value={formik.values.appType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={true}
              error={Boolean(formik.touched.appType && formik.errors.appType)}
              helperText={formik.touched.appType && formik.errors.appType}
            />
            <Box
              display="flex"
              justifyContent="flex-end"
              width="100%"
              mt={3}
              gap={2}
            >
              <Button
                variant="text"
                onClick={() => navigate("/organization/appMenus/verticalCA")}
                sx={{ color: "#1976d2", fontWeight: 600 }}
                type="button"
              >
                Cancel
              </Button>
              {!isView && (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    background: "#1976d2",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { background: "#115293" },
                  }}
                >
                  Save
                </Button>
              )}
            </Box>
          </Paper>
        </form>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
