import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Snackbar,
  Alert as MuiAlert,
  AlertProps,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { format } from "date-fns";

const validationSchema = Yup.object({
  name: Yup.string().required("Full Name is required"),
  displayName: Yup.string().required("Display Name is required"),
  dob: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProfessionalHubAdd: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      displayName: "",
      dob: null,
      gender: "",
      status: "draft",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          ...values,
          dob: values.dob ? format(values.dob, "yyyy-MM-dd") : null,
          status: "draft",
        };
        await axios.post("/professional-hub/", payload);
        setSnackbar({
          open: true,
          message: "Professional added successfully!",
          severity: "success",
        });
        resetForm();
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to add professional. Please try again.",
          severity: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

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

  const handleDraft = async () => {
    try {
      const payload = {
        ...formik.values,
        dob: formik.values.dob ? format(formik.values.dob, "yyyy-MM-dd") : null,
        status: "draft",
      };
      await axios.post("/professional-hub/", payload);
      setSnackbar({
        open: true,
        message: "Saved to draft!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save draft. Please try again.",
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
          Create Professional
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
          Personal Details
        </Typography>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          {/* Display Name */}
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
          {/* Full Name */}
          <Box display="flex" alignItems="center" mb={3}>
            <Box width={180}>
              <Typography fontWeight={500}>Full Name</Typography>
            </Box>
            <TextField
              fullWidth
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              size="small"
              sx={{
                background: "#F2FCFB",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            />
          </Box>
          {/* Date of Birth */}
          <Box display="flex" alignItems="center" mb={3}>
            <Box width={180}>
              <Typography fontWeight={500}>Date of Birth</Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={formik.values.dob}
                onChange={(date) => formik.setFieldValue("dob", date)}
                format="dd-MMM-yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: {
                      background: "#F2FCFB",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    },
                    error: formik.touched.dob && Boolean(formik.errors.dob),
                    helperText: formik.touched.dob && formik.errors.dob,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          {/* Gender */}
          <Box display="flex" alignItems="center" mb={3}>
            <Box width={180}>
              <Typography fontWeight={500}>Gender</Typography>
            </Box>
            <TextField
              select
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
              fullWidth
              size="small"
              sx={{
                background: "#F2FCFB",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <MenuItem value="">Please Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
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

export default ProfessionalHubAdd;
