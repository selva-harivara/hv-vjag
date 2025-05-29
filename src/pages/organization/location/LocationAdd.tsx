import React from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const validationSchema = Yup.object({
  locationName: Yup.string().required("Location Name is required"),
  displayName: Yup.string().required("Display Name is required"),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LocationAdd: React.FC = () => {
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formik = useFormik({
    initialValues: {
      locationName: "",
      displayName: "",
      status: true,
      publishStatus: "draft",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await axios.post(`${API_BASE}/location/`, values);
        setSnackbar({
          open: true,
          message: "Location added successfully!",
          severity: "success",
        });
        resetForm();
      } catch (error: any) {
        setSnackbar({
          open: true,
          message:
            error?.response?.data?.message ||
            error.message ||
            "Failed to add location",
          severity: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDraft = async () => {
    try {
      await axios.post(`${API_BASE}/location/`, {
        ...formik.values,
        status: "draft",
      });
      setSnackbar({
        open: true,
        message: "Saved to draft!",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message ||
          error.message ||
          "Failed to save draft",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ background: "#fff", minHeight: "100vh", p: 3 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Add Location
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "#19A594",
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 16,
              px: 4,
              boxShadow: "none",
            }}
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
          >
            Save to Draft
          </Button>
        </Box>
      </Box>
      <Paper
        sx={{
          borderRadius: 3,
          p: 4,
          maxWidth: 800,
          mx: "auto",
          boxShadow: "0 2px 8px #00000014",
          border: "1px solid #E0E0E0",
        }}
      >
        <Typography
          fontWeight={700}
          color="#1D887A"
          fontSize={22}
          mb={3}
          sx={{ textAlign: "left" }}
        >
          Location Details
        </Typography>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          {/* Location Name */}
          <Box display="flex" alignItems="center" mb={3}>
            <Box width={180}>
              <Typography fontWeight={500}>Location Name</Typography>
            </Box>
            <TextField
              fullWidth
              id="locationName"
              name="locationName"
              value={formik.values.locationName}
              onChange={formik.handleChange}
              error={
                formik.touched.locationName &&
                Boolean(formik.errors.locationName)
              }
              helperText={
                formik.touched.locationName && formik.errors.locationName
              }
              size="small"
              sx={{
                background: "#F2FCFB",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            />
          </Box>
          {/* Location Display Name */}
          <Box display="flex" alignItems="center" mb={3}>
            <Box width={180}>
              <Typography fontWeight={500}>Display Name</Typography>
            </Box>
            <TextField
              fullWidth
              id="displayName"
              name="displayName"
              value={formik.values.displayName}
              onChange={formik.handleChange}
              error={
                formik.touched.displayName && Boolean(formik.errors.displayName)
              }
              helperText={
                formik.touched.displayName && formik.errors.displayName
              }
              size="small"
              sx={{
                background: "#F2FCFB",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            />
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LocationAdd;
