import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

const gstNameOptions = [
  {
    value: "ASTROLOGY",
    label: "Astrology",
    displayName: "Astrology",
    percentage: 18,
    countryCode: "IN",
    description: "Astrology GST",
  },
  {
    value: "POOJA",
    label: "Pooja",
    displayName: "Pooja",
    percentage: 12,
    countryCode: "IN",
    description: "Pooja GST",
  },
  // Add more as needed
];

const reference = {
  _id: "",
  displayName: "",
  percentage: 0,
  gstName: "",
};

const validationSchema = Yup.object({
  gstName: Yup.string().required("GST Name is required"),
  displayName: Yup.string().required("Display Name is required"),
  percentage: Yup.number()
    .typeError("Percentage must be a number")
    .required("Percentage is required")
    .min(0, "Percentage must be at least 0")
    .max(100, "Percentage cannot exceed 100"),
});

export default function GstEditor({
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
      fetch(`${process.env.REACT_APP_API_BASE_URL}/gst-settings/id/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch GST setting");
          return res.json();
        })
        .then((data) => {
          setInitial({
            _id: data.data._id,
            displayName: data.data.displayName,
            percentage: data.data.percentage,
            gstName: data.data.displayName, // for dropdown display
          });
        })
        .catch((err) => {
          setInitial(reference);
          setSnackbar({ open: true, message: err.message, severity: "error" });
        })
        .finally(() => setLoading(false));
    } else {
      setInitial(reference);
    }
  }, [mode, id]);

  const formik = useFormik({
    initialValues: initial,
    validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        if (mode === "add") {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/gst-settings/create/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                _id: values.gstName.toLowerCase(),
                displayName: values.displayName,
                percentage: values.percentage,
              }),
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to save GST settings");
          }
        } else if (mode === "edit" && id) {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/gst-settings`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                _id: id,
                displayName: values.displayName,
                percentage: values.percentage,
              }),
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to save GST settings");
          }
        }
        setSnackbar({
          open: true,
          message: "Saved successfully!",
          severity: "success",
        });
        setTimeout(
          () => navigate("/organization/company-info/gst-settings"),
          1000
        );
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || "Something went wrong",
          severity: "error",
        });
      }
    },
  });

  // Debug log for troubleshooting
  console.log(
    "Formik errors:",
    formik.errors,
    "touched:",
    formik.touched,
    "values:",
    formik.values
  );

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  // When GST Name changes, update displayName and percentage only in add mode.
  const handleGstNameChange = (e: any) => {
    const selected = gstNameOptions.find((opt) => opt.value === e.target.value);
    if (selected) {
      formik.setFieldValue("gstName", selected.value);
      if (isAdd) {
        formik.setFieldValue("displayName", selected.displayName);
        formik.setFieldValue("percentage", selected.percentage);
      }
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#fafbff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Paper
          sx={{
            width: 360,
            p: 4,
            borderRadius: 4,
            boxShadow: "0 8px 32px 0 rgba(95, 121, 217, 0.10)",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={3} align="center">
            GST Settings
          </Typography>
          <FormControl
            fullWidth
            margin="normal"
            disabled={isView}
            error={Boolean(formik.touched.gstName && formik.errors.gstName)}
          >
            <InputLabel>GST Name</InputLabel>
            <Select
              name="gstName"
              value={formik.values.gstName}
              onChange={handleGstNameChange}
              onBlur={formik.handleBlur}
              label="GST Name"
            >
              {gstNameOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.gstName && formik.errors.gstName && (
              <Typography color="error" variant="caption">
                {formik.errors.gstName}
              </Typography>
            )}
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Display Name"
            name="displayName"
            value={formik.values.displayName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isView}
            error={Boolean(
              formik.touched.displayName && formik.errors.displayName
            )}
            helperText={formik.touched.displayName && formik.errors.displayName}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Percentage (%)"
            name="percentage"
            type="number"
            value={formik.values.percentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isView}
            error={Boolean(
              formik.touched.percentage && formik.errors.percentage
            )}
            helperText={formik.touched.percentage && formik.errors.percentage}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mt={3}
            gap={2}
          >
            <Button
              variant="text"
              onClick={() =>
                navigate("/organization/company-info/gst-settings")
              }
              sx={{ color: "#1976d2", fontWeight: 600, flex: 1 }}
              type="button"
            >
              CANCEL
            </Button>
            {!isView && (
              <Button
                variant="contained"
                type="submit"
                sx={{
                  background: "#1976d2",
                  fontWeight: 600,
                  flex: 1,
                  boxShadow: "none",
                  "&:hover": { background: "#115293" },
                }}
              >
                SAVE
              </Button>
            )}
          </Box>
        </Paper>
      </form>
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
